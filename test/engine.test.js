const test = require('node:test');
const assert = require('node:assert/strict');

const { ProtocolConfig, ProtocolEngine, TokenDefinition, Treasury } = require('../naira_protocol/engine');

function makeEngine() {
  return new ProtocolEngine(
    new ProtocolConfig({
      usdNgnRate: '1600',
      spreadBps: 120,
      smallTradeThresholdUsd: '25',
      largeTradeThresholdUsd: '2500',
      nftGasBufferUsd: '1.50',
    }),
    new Treasury({
      nairaBalance: '1000000',
      tokenBalances: {
        ETH: '100',
        USDC: '5000',
      },
      gasReserveUsd: '250',
    }),
    [
      new TokenDefinition('ETH', 'ethereum', '3500', { accountAbstractionSupported: true }),
      new TokenDefinition('USDC', 'ethereum', '1'),
      new TokenDefinition('PEPE', 'ethereum', '0.00001'),
    ],
  );
}

test('sub-dollar quote is allowed', () => {
  const engine = makeEngine();
  const quote = engine.quotePurchase('PEPE', '0.50');
  assert.equal(quote.usd_amount, '0.50');
  assert.equal(quote.settlement_mode, 'inventory');
});

test('small trade routes to inventory when available', () => {
  const engine = makeEngine();
  const quote = engine.quotePurchase('ETH', '1');
  const plan = engine.planSettlement(quote);
  assert.equal(plan.delivery_mode, 'inventory');
  assert.equal(plan.user_credit, false);
});

test('large trade routes to RFQ', () => {
  const engine = makeEngine();
  const quote = engine.quotePurchase('ETH', '3000');
  const plan = engine.planSettlement(quote);
  assert.equal(plan.delivery_mode, 'rfq');
  assert.equal(plan.user_credit, true);
});

test('NFT purchase adds gas buffer', () => {
  const engine = makeEngine();
  const quote = engine.quotePurchase('ETH', '1', 'nft_mint');
  assert.ok(Number(quote.gas_buffer_naira) > 0);
  const plan = engine.planSettlement(quote);
  assert.equal(plan.requires_gas_sponsorship, true);
});

test('execute purchase updates inventory', () => {
  const engine = makeEngine();
  const before = engine.inventorySnapshot();
  const order = engine.executePurchase('ETH', '1', 'bank-ref-123');
  const after = engine.inventorySnapshot();

  assert.equal(order.status, 'filled');
  assert.notEqual(before.naira_balance, after.naira_balance);
  assert.notEqual(before.token_balances.ETH, after.token_balances.ETH);
});
