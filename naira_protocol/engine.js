const crypto = require('node:crypto');

const SCALE = 10n ** 18n;
const MONEY_OUTPUT_DECIMALS = 2;
const TOKEN_OUTPUT_DECIMALS = 18;

function parseDecimal(input) {
  const text = String(input).trim();
  if (!text) {
    throw new Error('empty decimal');
  }

  let sign = 1n;
  let body = text;
  if (body.startsWith('-')) {
    sign = -1n;
    body = body.slice(1);
  } else if (body.startsWith('+')) {
    body = body.slice(1);
  }

  if (!/^\d+(\.\d+)?$/.test(body)) {
    throw new Error(`invalid decimal: ${input}`);
  }

  const [whole, fraction = ''] = body.split('.');
  const fractionDigits = fraction.slice(0, 18);
  const needsRoundUp = fraction.length > 18 && Number(fraction[18]) >= 5;
  const paddedFraction = fractionDigits.padEnd(18, '0');
  let value = BigInt(whole) * SCALE + BigInt(paddedFraction);
  if (needsRoundUp) {
    value += 1n;
  }
  return value * sign;
}

function formatDecimal(value, outputDecimals) {
  const scaleDiff = 18 - outputDecimals;
  if (scaleDiff < 0) {
    throw new Error('outputDecimals cannot exceed internal precision');
  }

  const factor = 10n ** BigInt(scaleDiff);
  const rounded = value >= 0n ? ((value + factor / 2n) / factor) * factor : ((value - factor / 2n) / factor) * factor;
  const whole = rounded / SCALE;
  const fraction = (rounded >= 0n ? rounded : -rounded) % SCALE;
  if (outputDecimals === 0) {
    return whole.toString();
  }

  const fractionText = fraction.toString().padStart(18, '0').slice(0, outputDecimals);
  return `${whole.toString()}.${fractionText}`;
}

function formatMoney(value) {
  return formatDecimal(value, MONEY_OUTPUT_DECIMALS);
}

function formatToken(value) {
  const text = formatDecimal(value, TOKEN_OUTPUT_DECIMALS);
  return text.replace(/\.?0+$/, '');
}

function mul(a, b) {
  return (a * b) / SCALE;
}

function div(a, b) {
  if (b === 0n) {
    throw new Error('division by zero');
  }
  return (a * SCALE) / b;
}

function gte(a, b) {
  return a >= b;
}

function lte(a, b) {
  return a <= b;
}

function lt(a, b) {
  return a < b;
}

function roundMoney(value) {
  const factor = 10n ** 16n;
  return value >= 0n ? ((value + factor / 2n) / factor) * factor : ((value - factor / 2n) / factor) * factor;
}

class TokenDefinition {
  constructor(symbol, chain, usdPrice, options = {}) {
    this.symbol = symbol.toUpperCase();
    this.chain = chain;
    this.usdPrice = parseDecimal(usdPrice);
    this.minBuyUsd = options.minBuyUsd ? parseDecimal(options.minBuyUsd) : parseDecimal('0.50');
    this.accountAbstractionSupported = Boolean(options.accountAbstractionSupported);
  }
}

class Treasury {
  constructor({ nairaBalance, tokenBalances = {}, gasReserveUsd = '0' }) {
    this.nairaBalance = parseDecimal(nairaBalance);
    this.tokenBalances = Object.fromEntries(
      Object.entries(tokenBalances).map(([symbol, amount]) => [symbol.toUpperCase(), parseDecimal(amount)]),
    );
    this.gasReserveUsd = parseDecimal(gasReserveUsd);
  }

  hasToken(symbol, amount) {
    return gte(this.tokenBalances[symbol.toUpperCase()] ?? 0n, amount);
  }

  debitToken(symbol, amount) {
    const key = symbol.toUpperCase();
    const current = this.tokenBalances[key] ?? 0n;
    if (current < amount) {
      throw new Error(`insufficient ${key} inventory`);
    }
    this.tokenBalances[key] = current - amount;
  }

  creditNaira(amount) {
    this.nairaBalance += amount;
  }
}

class ProtocolConfig {
  constructor({
    usdNgnRate,
    spreadBps = 120,
    smallTradeThresholdUsd = '25',
    largeTradeThresholdUsd = '2500',
    nftGasBufferUsd = '1.50',
    orderExpirySeconds = 60,
  }) {
    this.usdNgnRate = parseDecimal(usdNgnRate);
    this.spreadBps = BigInt(spreadBps);
    this.smallTradeThresholdUsd = parseDecimal(smallTradeThresholdUsd);
    this.largeTradeThresholdUsd = parseDecimal(largeTradeThresholdUsd);
    this.nftGasBufferUsd = parseDecimal(nftGasBufferUsd);
    this.orderExpirySeconds = Number(orderExpirySeconds);
  }
}

class ProtocolEngine {
  constructor(config, treasury, tokens) {
    this.config = config;
    this.treasury = treasury;
    this.tokens = new Map(tokens.map((token) => [token.symbol.toUpperCase(), token]));
    if (this.tokens.size === 0) {
      throw new Error('at least one token definition is required');
    }
  }

  supportedTokens() {
    return [...this.tokens.values()].map((token) => ({
      symbol: token.symbol,
      chain: token.chain,
      min_buy_usd: formatMoney(token.minBuyUsd),
      account_abstraction_supported: token.accountAbstractionSupported,
    }));
  }

  quotePurchase(tokenSymbol, usdAmount, purpose = 'spot') {
    const symbol = String(tokenSymbol).toUpperCase();
    const token = this.tokens.get(symbol);
    if (!token) {
      throw new Error(`unsupported token: ${tokenSymbol}`);
    }

    const usdValue = parseDecimal(usdAmount);
    if (lt(usdValue, token.minBuyUsd)) {
      throw new Error(`minimum buy size for ${symbol} is $${formatMoney(token.minBuyUsd)}`);
    }

    let message;
    if (purpose === 'nft_mint') {
      message = 'NFT mint support includes a sponsored gas buffer';
    } else if (lte(usdValue, this.config.smallTradeThresholdUsd)) {
      message = 'small trade served from inventory';
    } else if (gte(usdValue, this.config.largeTradeThresholdUsd)) {
      message = 'large trade routed through RFQ';
    } else {
      message = 'standard trade routed through treasury';
    }

    const settlementMode = this._settlementMode(usdValue);
    const tokenAmount = div(usdValue, token.usdPrice);
    const baseNaira = mul(usdValue, this.config.usdNgnRate);
    const spreadNaira = (baseNaira * this.config.spreadBps) / 10000n;
    const gasBufferNaira = purpose === 'nft_mint' ? mul(this.config.nftGasBufferUsd, this.config.usdNgnRate) : 0n;
    const feeNaira = roundMoney(spreadNaira + gasBufferNaira);
    const nairaAmount = roundMoney(baseNaira + feeNaira);

    return {
      quote_id: this._quoteId(symbol, usdValue, purpose),
      token_symbol: symbol,
      token_chain: token.chain,
      usd_amount: formatMoney(usdValue),
      token_amount: formatToken(tokenAmount),
      naira_amount: formatMoney(nairaAmount),
      fee_naira: formatMoney(feeNaira),
      spread_naira: formatMoney(spreadNaira),
      gas_buffer_naira: formatMoney(gasBufferNaira),
      settlement_mode: settlementMode,
      purpose,
      expires_in_seconds: this.config.orderExpirySeconds,
      message,
      _raw: {
        usdAmount: usdValue,
        tokenAmount,
        nairaAmount,
        feeNaira,
        spreadNaira,
        gasBufferNaira,
      },
    };
  }

  planSettlement(quote) {
    if (quote.purpose === 'nft_mint') {
      return {
        delivery_mode: 'inventory',
        source: 'treasury',
        user_credit: false,
        batchable: false,
        requires_gas_sponsorship: true,
        reason: 'gas-sponsored NFT flow should settle immediately',
      };
    }

    if (lte(quote._raw.usdAmount, this.config.smallTradeThresholdUsd) && this.treasury.hasToken(quote.token_symbol, quote._raw.tokenAmount)) {
      return {
        delivery_mode: 'inventory',
        source: 'treasury',
        user_credit: false,
        batchable: true,
        requires_gas_sponsorship: false,
        reason: 'small order fulfilled from inventory',
      };
    }

    if (gte(quote._raw.usdAmount, this.config.largeTradeThresholdUsd)) {
      return {
        delivery_mode: 'rfq',
        source: 'external_liquidity',
        user_credit: true,
        batchable: true,
        requires_gas_sponsorship: false,
        reason: 'large order should source best execution from RFQ liquidity',
      };
    }

    return {
      delivery_mode: 'batched',
      source: 'treasury',
      user_credit: true,
      batchable: true,
      requires_gas_sponsorship: false,
      reason: 'standard order can be credited internally and settled in batch',
    };
  }

  executePurchase(tokenSymbol, usdAmount, paymentReference, purpose = 'spot') {
    const quote = this.quotePurchase(tokenSymbol, usdAmount, purpose);
    const settlement = this.planSettlement(quote);
    const orderId = this._orderId(quote.quote_id, paymentReference);

    if (settlement.delivery_mode === 'inventory') {
      this.treasury.creditNaira(quote._raw.nairaAmount);
      this.treasury.debitToken(quote.token_symbol, quote._raw.tokenAmount);
      if (settlement.requires_gas_sponsorship) {
        this.treasury.gasReserveUsd = this.treasury.gasReserveUsd > this.config.nftGasBufferUsd
          ? this.treasury.gasReserveUsd - this.config.nftGasBufferUsd
          : 0n;
      }
    } else {
      this.treasury.creditNaira(quote._raw.nairaAmount);
    }

    return {
      order_id: orderId,
      quote: this.serializeQuote(quote),
      payment_reference: paymentReference,
      status: settlement.delivery_mode === 'inventory' ? 'filled' : settlement.delivery_mode === 'rfq' ? 'rfq_pending' : 'credited',
      settlement,
    };
  }

  inventorySnapshot() {
    const tokenBalances = Object.fromEntries(
      Object.entries(this.treasury.tokenBalances).map(([symbol, amount]) => [symbol, formatToken(amount)]),
    );

    return {
      naira_balance: formatMoney(this.treasury.nairaBalance),
      gas_reserve_usd: formatMoney(this.treasury.gasReserveUsd),
      token_balances: tokenBalances,
    };
  }

  serializeQuote(quote) {
    const { _raw, ...rest } = quote;
    return rest;
  }

  _settlementMode(usdValue) {
    if (lte(usdValue, this.config.smallTradeThresholdUsd)) {
      return 'inventory';
    }
    if (gte(usdValue, this.config.largeTradeThresholdUsd)) {
      return 'rfq';
    }
    return 'batched';
  }

  _quoteId(symbol, usdValue, purpose) {
    return crypto.createHash('sha256').update(`${symbol}:${usdValue.toString()}:${purpose}:${crypto.randomUUID()}`).digest('hex').slice(0, 24);
  }

  _orderId(quoteId, paymentReference) {
    return crypto.createHash('sha256').update(`${quoteId}:${paymentReference}:${crypto.randomUUID()}`).digest('hex').slice(0, 24);
  }
}

module.exports = {
  ProtocolEngine,
  ProtocolConfig,
  TokenDefinition,
  Treasury,
  parseDecimal,
  formatMoney,
  formatToken,
};
