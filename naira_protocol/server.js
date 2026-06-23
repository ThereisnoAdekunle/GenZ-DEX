const http = require('node:http');
const { ProtocolConfig, ProtocolEngine, TokenDefinition, Treasury } = require('./engine');

function createDefaultEngine() {
  return new ProtocolEngine(
    new ProtocolConfig({
      usdNgnRate: '1600',
      spreadBps: 120,
      smallTradeThresholdUsd: '25',
      largeTradeThresholdUsd: '2500',
      nftGasBufferUsd: '1.50',
      orderExpirySeconds: 60,
    }),
    new Treasury({
      nairaBalance: '10000000',
      tokenBalances: {
        ETH: '50',
        USDC: '25000',
        MATIC: '5000',
      },
      gasReserveUsd: '500',
    }),
    [
      new TokenDefinition('ETH', 'ethereum', '3500', { accountAbstractionSupported: true }),
      new TokenDefinition('USDC', 'ethereum', '1'),
      new TokenDefinition('BNB', 'bsc', '612'),
      new TokenDefinition('MATIC', 'polygon', '0.70', { accountAbstractionSupported: true }),
      new TokenDefinition('PEPE', 'ethereum', '0.00001'),
    ],
  );
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = Buffer.from(JSON.stringify(payload, null, 2));
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': body.length,
  });
  res.end(body);
}

function renderIndex() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Naira Token Protocol</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #12110f;
      --bg-2: #171513;
      --panel: rgba(35, 32, 28, 0.88);
      --panel-strong: rgba(42, 38, 34, 0.96);
      --panel-border: rgba(255, 255, 255, 0.09);
      --text: #f6f1e8;
      --muted: #a8a096;
      --accent: #f7d08a;
      --accent-2: #8bd5ca;
      --accent-3: #e6a56c;
      --good: #8dc891;
      --danger: #ff8a8a;
      --shadow: 0 18px 50px rgba(0, 0, 0, 0.32);
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 15% 0%, rgba(247, 208, 138, 0.14), transparent 28%),
        radial-gradient(circle at 85% 12%, rgba(139, 213, 202, 0.10), transparent 24%),
        linear-gradient(180deg, #0f0e0d 0%, #151311 100%);
      color: var(--text);
      min-height: 100vh;
    }
    .wrap {
      width: min(1160px, calc(100vw - 28px));
      margin: 0 auto;
      padding: 22px 0 40px;
    }
    .shell {
      position: relative;
      overflow: hidden;
    }
    .shell::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.03), transparent 35%),
        linear-gradient(0deg, rgba(255,255,255,0.02), transparent 18%);
      mask-image: radial-gradient(circle at center, black 54%, transparent 100%);
      opacity: 0.9;
    }
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: start;
      gap: 16px;
      margin-bottom: 18px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 800;
      letter-spacing: -0.03em;
      font-size: 20px;
    }
    .brand-mark {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(247, 208, 138, 0.95), rgba(139, 213, 202, 0.9));
      color: #171311;
      box-shadow: var(--shadow);
      font-size: 16px;
    }
    .brand small {
      display: block;
      color: var(--muted);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid var(--panel-border);
      background: rgba(255,255,255,0.03);
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
    }
    .status .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--good);
      box-shadow: 0 0 0 5px rgba(141, 200, 145, 0.12);
    }
    .rates {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 16px;
    }
    .rate-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid var(--panel-border);
      background: rgba(255,255,255,0.03);
      color: var(--text);
      font-size: 13px;
      font-weight: 700;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
    }
    .rate-pill span {
      color: var(--muted);
      font-weight: 700;
    }
    .hero {
      display: grid;
      gap: 16px;
      grid-template-columns: 1fr;
      margin-bottom: 18px;
    }
    .hero-card {
      padding: 20px;
      border-radius: 24px;
      border: 1px solid var(--panel-border);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.04), transparent 26%),
        linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.02)),
        var(--panel);
      box-shadow: var(--shadow);
      backdrop-filter: blur(18px);
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 16px;
      align-items: stretch;
    }
    h1 {
      margin: 0 0 10px;
      font-size: clamp(34px, 5vw, 62px);
      line-height: 0.95;
      letter-spacing: -0.05em;
      max-width: 11ch;
    }
    .lede {
      max-width: 60ch;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
    }
    .mini-stats {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .mini-stat, .panel {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 20px;
      box-shadow: var(--shadow);
      backdrop-filter: blur(16px);
    }
    .mini-stat {
      padding: 18px;
    }
    .mini-stat .label {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }
    .mini-stat .value {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .layout {
      display: grid;
      gap: 16px;
      grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
    }
    .panel {
      padding: 20px;
    }
    .panel.strong {
      background: var(--panel-strong);
    }
    .tabs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    }
    .tab {
      border-radius: 14px;
      border: 1px solid var(--panel-border);
      background: rgba(255,255,255,0.03);
      color: var(--text);
      padding: 12px 14px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
    }
    .tab[aria-selected="true"] {
      background: linear-gradient(135deg, rgba(247, 208, 138, 0.16), rgba(139, 213, 202, 0.10));
      border-color: rgba(247, 208, 138, 0.35);
      transform: translateY(-1px);
    }
    .panel h2 {
      margin: 0 0 8px;
      font-size: 18px;
      letter-spacing: -0.02em;
    }
    .panel p {
      margin: 0 0 16px;
      color: var(--muted);
      line-height: 1.5;
    }
    .field-grid {
      display: grid;
      gap: 14px;
      grid-template-columns: 1fr;
    }
    label {
      display: block;
      margin: 0 0 8px;
      color: var(--muted);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    input, select, button, textarea {
      width: 100%;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(16, 14, 12, 0.92);
      color: var(--text);
      padding: 14px 16px;
      font: inherit;
    }
    input::placeholder {
      color: rgba(246, 241, 232, 0.36);
    }
    input:focus, select:focus {
      outline: 2px solid rgba(247, 208, 138, 0.18);
      border-color: rgba(247, 208, 138, 0.42);
    }
    .amount-row {
      display: grid;
      grid-template-columns: 90px 1fr;
      gap: 10px;
      align-items: center;
    }
    .currency-prefix {
      display: grid;
      place-items: center;
      height: 100%;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.10);
      background: rgba(255,255,255,0.03);
      color: var(--muted);
      font-weight: 700;
    }
    .token-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 4px 0 2px;
    }
    .token-pill, .quick-chip {
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.03);
      color: var(--text);
      padding: 10px 14px;
      cursor: pointer;
      font-weight: 700;
      line-height: 1;
    }
    .token-pill[aria-pressed="true"] {
      background: linear-gradient(135deg, rgba(247, 208, 138, 0.18), rgba(139, 213, 202, 0.10));
      border-color: rgba(247, 208, 138, 0.4);
    }
    .quick-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 14px;
    }
    .quick-chip {
      padding: 8px 12px;
      color: var(--muted);
    }
    .swap-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      margin: 10px 0 14px;
      padding: 12px 0 0;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .swap-rate {
      color: var(--muted);
      font-size: 13px;
      font-weight: 700;
    }
    .swap-rate strong {
      color: var(--text);
      font-size: 16px;
    }
    .swap-icon {
      width: 34px;
      height: 34px;
      border-radius: 999px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,0.11);
      background: rgba(255,255,255,0.03);
      color: var(--text);
    }
    .summary-list {
      display: grid;
      gap: 12px;
      margin-top: 10px;
    }
    .summary-item {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: baseline;
      color: var(--muted);
      font-size: 14px;
    }
    .summary-item strong {
      color: var(--text);
      font-size: 14px;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,0.10);
      font-size: 18px;
      font-weight: 800;
    }
    .summary-total span:last-child {
      font-size: 20px;
      letter-spacing: -0.02em;
    }
    .wallet-box {
      margin-top: 16px;
      padding: 14px;
      border-radius: 16px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .wallet-box .label {
      margin-bottom: 8px;
    }
    .wallet-address {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 13px;
      color: #d8d1c7;
      word-break: break-all;
    }
    .button-row {
      display: flex;
      gap: 12px;
      margin-top: 18px;
    }
    button {
      background: linear-gradient(135deg, rgba(247, 208, 138, 0.98), rgba(230, 165, 108, 0.96));
      color: #171311;
      font-weight: 900;
      border: 0;
      cursor: pointer;
      box-shadow: 0 10px 22px rgba(247, 208, 138, 0.16);
    }
    button.secondary {
      background: rgba(255,255,255,0.04);
      color: var(--text);
      border: 1px solid rgba(255,255,255,0.10);
      box-shadow: none;
    }
    button:hover { filter: brightness(1.03); }
    pre {
      margin: 16px 0 0;
      padding: 16px;
      background: rgba(12, 10, 9, 0.72);
      border-radius: 16px;
      overflow: auto;
      color: #f0e9dd;
      border: 1px solid rgba(255,255,255,0.10);
      min-height: 180px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .micro {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .micro .mini-stat {
      background: rgba(255,255,255,0.03);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      color: var(--good);
      font-size: 13px;
    }
    .hidden { display: none !important; }
    .muted-small {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
    }
    @media (max-width: 900px) {
      .hero-grid, .layout, .micro, .topbar { grid-template-columns: 1fr; }
      .wrap { width: min(100vw - 20px, 1160px); }
    }
  </style>
</head>
<body>
  <main class="wrap shell">
    <section class="topbar">
      <div class="brand">
        <div class="brand-mark">↯</div>
        <div>
          NairaSwap
          <small>Protocol</small>
        </div>
      </div>
      <div class="status"><span class="dot"></span><span id="status">Rates live</span></div>
    </section>

    <section class="rates" aria-label="Live rates">
      <div class="rate-pill">ETH <span id="rate-eth">₦5,553,290</span></div>
      <div class="rate-pill">USDC <span id="rate-usdc">₦1,626</span></div>
      <div class="rate-pill">BNB <span id="rate-bnb">₦978,304</span></div>
      <div class="rate-pill">MATIC <span id="rate-matic">₦1,428</span></div>
    </section>

    <section class="hero hero-card">
      <div class="hero-grid">
        <div>
          <h1>Buy tokens in naira with a cleaner flow.</h1>
          <p class="lede">
            Fast quote-first UI for ETH, USDC, BNB, and MATIC. Small orders can be inventory-filled, larger orders can route
            to batch or RFQ, and the layout keeps the important information visible before you hit buy.
          </p>
          <div class="badge"><span class="dot"></span><span>Minimum buy starts at $0.50</span></div>
        </div>
        <div class="mini-stats">
          <div class="mini-stat">
            <div class="label">Settlement</div>
            <div class="value">Inventory / RFQ / Batch</div>
          </div>
          <div class="mini-stat">
            <div class="label">Flow</div>
            <div class="value">Quote first</div>
          </div>
          <div class="mini-stat">
            <div class="label">Gas support</div>
            <div class="value">NFT-ready</div>
          </div>
          <div class="mini-stat">
            <div class="label">Delivery</div>
            <div class="value">Naira in, tokens out</div>
          </div>
        </div>
      </div>
    </section>

    <section class="tabs" role="tablist" aria-label="Primary actions">
      <button class="tab" aria-selected="true" data-tab="buy">Buy token</button>
      <button class="tab" aria-selected="false" data-tab="sell">Seller desk</button>
      <button class="tab" aria-selected="false" data-tab="how">How it works</button>
    </section>

    <section class="layout">
      <div class="panel strong" id="buy-panel">
        <h2>Select token</h2>
        <p>Pick the asset, enter the naira amount, and keep the quote panel visible while you adjust the size.</p>
        <div class="token-pills" role="group" aria-label="Token selection">
          <button class="token-pill" aria-pressed="true" data-token="ETH">ETH</button>
          <button class="token-pill" aria-pressed="false" data-token="USDC">USDC</button>
          <button class="token-pill" aria-pressed="false" data-token="BNB">BNB</button>
          <button class="token-pill" aria-pressed="false" data-token="MATIC">MATIC</button>
        </div>

        <div class="field-grid" style="margin-top:16px;">
          <div>
            <label for="quote-naira">You pay (naira)</label>
            <div class="amount-row">
              <div class="currency-prefix">₦</div>
              <input id="quote-naira" value="2500" inputmode="numeric" />
            </div>
          </div>

          <div class="swap-row">
            <div class="swap-rate">
              <div>1 USDC = <strong>₦1,626</strong></div>
              <div>Fast quote with live settlement routing</div>
            </div>
            <div class="swap-icon">⇄</div>
          </div>

          <div>
            <div class="label">You receive</div>
            <div style="display:flex; align-items:baseline; gap:10px;">
              <div style="font-size:14px; color:var(--muted);" id="receive-symbol">USDC</div>
              <div style="font-size:28px; font-weight:800; letter-spacing:-0.03em;" id="receive-amount">1.537328</div>
            </div>
          </div>

          <div class="quick-chips" aria-label="Quick amounts">
            <button class="quick-chip" data-amount="500">₦500</button>
            <button class="quick-chip" data-amount="1000">₦1,000</button>
            <button class="quick-chip" data-amount="5000">₦5,000</button>
            <button class="quick-chip" data-amount="10000">₦10,000</button>
            <button class="quick-chip" data-amount="50000">₦50k</button>
            <button class="quick-chip" data-amount="200000">₦200k</button>
          </div>

          <div class="button-row">
            <button id="quote-btn">Quote purchase</button>
            <button id="buy-btn" class="secondary">Execute order</button>
          </div>
        </div>
      </div>

      <div class="panel" id="summary-panel">
        <h2>Order summary</h2>
        <p>Review the current quote before execution. The summary updates from the same underlying protocol logic.</p>
        <div class="summary-list">
          <div class="summary-item"><span>You pay</span><strong id="sum-pay">₦2,500</strong></div>
          <div class="summary-item"><span>You receive</span><strong id="sum-receive">1.537328 USDC</strong></div>
          <div class="summary-item"><span>Rate</span><strong id="sum-rate">1 USDC = ₦1,626</strong></div>
          <div class="summary-item"><span>Protocol fee (1.2%)</span><strong id="sum-fee">₦30</strong></div>
        </div>

        <div class="summary-total">
          <span>Total charged</span>
          <span id="sum-total">₦2,530</span>
        </div>

        <div class="wallet-box">
          <div class="label">Destination wallet</div>
          <div class="wallet-address" id="wallet-address">0xAc85323EcA915DD8197f</div>
        </div>

        <div class="micro">
          <div class="mini-stat">
            <div class="label">Min buy</div>
            <div class="value">$0.50</div>
          </div>
          <div class="mini-stat">
            <div class="label">Purpose</div>
            <div class="value" id="summary-purpose">Spot</div>
          </div>
          <div class="mini-stat">
            <div class="label">Status</div>
            <div class="value" id="summary-status">Ready</div>
          </div>
        </div>
      </div>
    </section>

    <section class="panel strong" style="margin-top:16px;">
      <h2>Protocol response</h2>
      <p>Live server response from the protocol.</p>
      <pre id="output">Ready.</pre>
    </section>
  </main>
  <script>
    const output = document.getElementById('output');
    const tokenButtons = Array.from(document.querySelectorAll('.token-pill'));
    const quickButtons = Array.from(document.querySelectorAll('.quick-chip'));
    const tabButtons = Array.from(document.querySelectorAll('.tab'));
    const quoteNaira = document.getElementById('quote-naira');
    const receiveAmount = document.getElementById('receive-amount');
    const receiveSymbol = document.getElementById('receive-symbol');
    const sumPay = document.getElementById('sum-pay');
    const sumReceive = document.getElementById('sum-receive');
    const sumRate = document.getElementById('sum-rate');
    const sumFee = document.getElementById('sum-fee');
    const sumTotal = document.getElementById('sum-total');
    const summaryPurpose = document.getElementById('summary-purpose');
    const summaryStatus = document.getElementById('summary-status');

    const FX_RATE = 1600;
    let selectedToken = 'USDC';
    let lastQuote = null;

    const show = (value) => { output.textContent = JSON.stringify(value, null, 2); };

    async function post(path, payload) {
      const response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return response.json();
    }

    function formatNaira(value) {
      return new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(Number(value));
    }

    function setToken(symbol) {
      selectedToken = symbol;
      tokenButtons.forEach((button) => {
        const active = button.dataset.token === symbol;
        button.setAttribute('aria-pressed', String(active));
      });
      receiveSymbol.textContent = symbol;
    }

    function setSummary(quote) {
      if (!quote) return;
      lastQuote = quote;
      const inputNaira = Number(quoteNaira.value || '0');
      const pay = inputNaira;
      const fee = Number(String(quote.fee_naira).replace(/,/g, ''));
      const total = Number(String(quote.naira_amount).replace(/,/g, ''));
      const receive = quote.token_amount;
      const rate = '1 ' + quote.token_symbol + ' = ₦' + formatNaira(pay / Number(String(quote.token_amount).replace(/,/g, '')));

      receiveAmount.textContent = quote.token_amount;
      sumPay.textContent = '₦' + formatNaira(pay);
      sumReceive.textContent = receive + ' ' + quote.token_symbol;
      sumRate.textContent = rate;
      sumFee.textContent = '₦' + formatNaira(fee);
      sumTotal.textContent = '₦' + formatNaira(total);
      summaryPurpose.textContent = quote.purpose === 'nft_mint' ? 'NFT Mint' : 'Spot';
      summaryStatus.textContent = quote.settlement_mode === 'inventory' ? 'Inventory' : quote.settlement_mode === 'rfq' ? 'RFQ' : 'Batch';
    }

    async function refreshQuote() {
      const payload = {
        token_symbol: selectedToken,
        usd_amount: (Number(quoteNaira.value || '0') / FX_RATE).toFixed(6),
        purpose: 'spot',
      };

      const quote = await post('/quote', payload);
      setSummary(quote);
      show(quote);
      return quote;
    }

    tokenButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        setToken(button.dataset.token);
        await refreshQuote();
      });
    });

    quickButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        quoteNaira.value = button.dataset.amount;
        await refreshQuote();
      });
    });

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        tabButtons.forEach((candidate) => candidate.setAttribute('aria-selected', String(candidate === button)));
        document.getElementById('summary-panel').classList.toggle('hidden', button.dataset.tab !== 'buy');
        document.getElementById('buy-panel').querySelector('p').textContent =
          button.dataset.tab === 'buy'
            ? 'Pick the asset, enter the naira amount, and keep the quote panel visible while you adjust the size.'
            : button.dataset.tab === 'sell'
              ? 'Seller desk view can be expanded later for off-ramp and inventory management.'
              : 'How it works can be used for product copy, onboarding, and route explanation.';
      });
    });

    document.getElementById('quote-btn').addEventListener('click', async () => {
      summaryStatus.textContent = 'Quoting';
      await refreshQuote();
      summaryStatus.textContent = lastQuote ? (lastQuote.settlement_mode === 'inventory' ? 'Inventory' : lastQuote.settlement_mode === 'rfq' ? 'RFQ' : 'Batch') : 'Ready';
    });

    document.getElementById('buy-btn').addEventListener('click', async () => {
      summaryStatus.textContent = 'Executing';
      const order = await post('/purchase', {
        token_symbol: selectedToken,
        usd_amount: (Number(quoteNaira.value || '0') / FX_RATE).toFixed(6),
        purpose: 'spot',
        payment_reference: 'demo-' + Math.random().toString(16).slice(2, 10),
      });
      show(order);
      summaryStatus.textContent = order.status;
    });

    quoteNaira.addEventListener('input', () => {
      summaryStatus.textContent = 'Typing';
    });
    quoteNaira.addEventListener('change', refreshQuote);

    setToken('USDC');
    refreshQuote().catch((error) => show({ error: error.message }));
  </script>
</body>
</html>`;
}

function createServer(engine = createDefaultEngine()) {
  return http.createServer(createRequestListener(engine));
}

function createRequestListener(engine = createDefaultEngine()) {
  return async (req, res) => {
    try {
      if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderIndex());
        return;
      }

      if (req.method === 'GET' && req.url === '/health') {
        sendJson(res, 200, { ok: true });
        return;
      }

      if (req.method === 'GET' && req.url === '/tokens') {
        sendJson(res, 200, { tokens: engine.supportedTokens() });
        return;
      }

      if (req.method === 'GET' && req.url === '/inventory') {
        sendJson(res, 200, engine.inventorySnapshot());
        return;
      }

      if (req.method === 'POST' && req.url === '/quote') {
        const body = await readJsonBody(req);
        const quote = engine.quotePurchase(body.token_symbol, body.usd_amount, body.purpose || 'spot');
        sendJson(res, 200, engine.serializeQuote(quote));
        return;
      }

      if (req.method === 'POST' && req.url === '/purchase') {
        const body = await readJsonBody(req);
        const order = engine.executePurchase(
          body.token_symbol,
          body.usd_amount,
          body.payment_reference,
          body.purpose || 'spot',
        );
        sendJson(res, 200, order);
        return;
      }

      sendJson(res, 404, { error: 'not_found' });
    } catch (error) {
      sendJson(res, 400, { error: error.message });
    }
  };
}

function main() {
  const port = Number(process.env.PORT || 8000);
  const server = createServer();
  server.listen(port, '127.0.0.1', () => {
    process.stdout.write(`Naira protocol listening on http://127.0.0.1:${port}\n`);
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  createServer,
  createRequestListener,
  createDefaultEngine,
  main,
};
