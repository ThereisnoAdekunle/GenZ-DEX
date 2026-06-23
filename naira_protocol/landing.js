function renderLandingPage() {
  return String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GenZ</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0c0e14;
      --panel: #131620;
      --panel-2: #0a0c12;
      --border: #2a2d3e;
      --text: #c8ccde;
      --muted: #6b7280;
      --accent: #f0a832;
      --green: #4affa0;
      --blue: #60aaff;
      --soft: rgba(255,255,255,0.03);
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0;
      background:
        radial-gradient(circle at 10% 0%, rgba(240, 168, 50, 0.10), transparent 28%),
        radial-gradient(circle at 90% 8%, rgba(96, 170, 255, 0.08), transparent 22%),
        linear-gradient(180deg, #0b0d13 0%, #0e1017 100%);
      color: var(--text);
      font-family: "DM Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
      padding: 2rem 1rem 3rem;
      line-height: 1.55;
      font-size: 13px;
    }
    .page {
      width: min(1320px, calc(100vw - 24px));
      margin: 0 auto;
    }
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 1rem;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .brand-mark {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(240, 168, 50, 0.95), rgba(96, 170, 255, 0.9));
      color: #171311;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.32);
    }
    .brand small {
      display: block;
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-top: 2px;
    }
    .nav {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 12px;
      border-radius: 999px;
      border: 0.5px solid var(--border);
      background: var(--soft);
      color: var(--text);
      text-decoration: none;
      font-weight: 700;
    }
    .pill .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 0 5px rgba(74, 255, 160, 0.10);
    }
    .hero {
      display: grid;
      grid-template-columns: 1.12fr 0.88fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .card {
      background: var(--panel);
      border: 0.5px solid var(--border);
      border-radius: 8px;
      padding: 14px;
    }
    h1 {
      margin: 0 0 12px;
      font-size: clamp(34px, 5vw, 62px);
      line-height: 0.95;
      letter-spacing: -0.05em;
      max-width: 12ch;
    }
    .lede {
      max-width: 72ch;
      margin: 0 0 14px;
      color: var(--muted);
      font-size: 15px;
    }
    .metrics, .mini-grid, .flow-strip, .layout {
      display: grid;
      gap: 8px;
    }
    .metrics {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-top: 14px;
    }
    .metric, .mini {
      border: 0.5px solid var(--border);
      background: #131620;
      padding: 12px;
      text-align: center;
    }
    .metric .num {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    .metric .lbl, .mini .label, .step .label {
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #5a6080;
      margin-bottom: 3px;
    }
    .metric .lbl { margin-bottom: 0; }
    .metric .lbl, .mini .label { margin-top: 3px; }
    .metric .num, .mini .value { color: #e8eaf4; }
    .mini-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      margin-top: 14px;
    }
    .mini .value {
      font-size: 14px;
      font-weight: 700;
    }
    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      margin: 0 0 10px;
    }
    .section-title h2 {
      margin: 0;
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .section-title span {
      color: var(--muted);
      font-size: 12px;
    }
    .flow-strip {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin: 16px 0 0;
    }
    .step {
      padding: 12px;
      border: 0.5px solid var(--border);
      background: #131620;
    }
    .step .title {
      color: #e8eaf4;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .step .desc {
      color: var(--muted);
      font-size: 11px;
      line-height: 1.5;
    }
    .layout {
      grid-template-columns: minmax(0, 1.06fr) minmax(320px, 0.94fr);
      margin-top: 16px;
    }
    .tokens {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0 14px;
    }
    .token, .chip {
      padding: 8px 12px;
      border-radius: 999px;
      border: 0.5px solid var(--border);
      background: var(--soft);
      color: var(--text);
      cursor: pointer;
      font: inherit;
      font-weight: 700;
    }
    .token[aria-pressed="true"] {
      border-color: rgba(240, 168, 50, 0.7);
      background: rgba(240, 168, 50, 0.12);
    }
    .field { margin-top: 10px; }
    label {
      display: block;
      margin-bottom: 8px;
      color: #5a6080;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .input-row {
      display: grid;
      grid-template-columns: 88px 1fr;
      gap: 10px;
      align-items: center;
    }
    .prefix {
      display: grid;
      place-items: center;
      height: 100%;
      border-radius: 8px;
      border: 0.5px solid var(--border);
      background: var(--soft);
      color: #5a6080;
      font-weight: 700;
    }
    input, select, button {
      width: 100%;
      padding: 12px 14px;
      border-radius: 8px;
      border: 0.5px solid var(--border);
      background: #0d1017;
      color: var(--text);
      font: inherit;
    }
    input:focus, select:focus {
      outline: none;
      border-color: rgba(240, 168, 50, 0.55);
    }
    .swap {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      padding-top: 12px;
      margin-top: 12px;
      border-top: 0.5px solid var(--border);
    }
    .swap strong {
      color: #e8eaf4;
      font-size: 16px;
    }
    .swap-icon {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      border: 0.5px solid var(--border);
      background: var(--soft);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0;
    }
    .chip {
      border-radius: 8px;
      color: var(--muted);
    }
    .controls {
      display: flex;
      gap: 10px;
      margin-top: 14px;
    }
    .controls button {
      font-weight: 800;
      cursor: pointer;
    }
    .controls .primary {
      background: linear-gradient(135deg, rgba(240, 168, 50, 0.98), rgba(230, 165, 108, 0.96));
      color: #171311;
      border: 0;
    }
    .controls .secondary {
      background: var(--soft);
      color: var(--text);
    }
    .summary {
      display: grid;
      gap: 10px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: baseline;
      color: var(--muted);
    }
    .summary-row strong { color: var(--text); }
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-top: 12px;
      margin-top: 12px;
      border-top: 0.5px solid var(--border);
      font-size: 18px;
      font-weight: 800;
    }
    .summary-total span:last-child {
      font-size: 20px;
      letter-spacing: -0.02em;
    }
    pre {
      margin: 0;
      padding: 16px;
      background: var(--panel-2);
      border-radius: 8px;
      border: 0.5px solid var(--border);
      color: #f0e9dd;
      overflow: auto;
      min-height: 180px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .response-card {
      margin-top: 16px;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 11px;
      border-radius: 999px;
      border: 0.5px solid var(--border);
      background: var(--soft);
      color: var(--muted);
      text-decoration: none;
      font-weight: 700;
    }
    .status .dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--green);
      box-shadow: 0 0 0 5px rgba(74, 255, 160, 0.10);
    }
    .muted { color: var(--muted); }
    @media (max-width: 980px) {
      .topbar, .hero, .layout, .flow-strip, .metrics, .mini-grid { grid-template-columns: 1fr; }
      .nav { justify-content: flex-start; }
      .controls { flex-direction: column; }
      .page { width: min(100vw - 20px, 1320px); }
    }
  </style>
</head>
<body>
  <main class="page">
    <section class="topbar">
      <div class="brand">
        <div class="brand-mark">↯</div>
        <div>
          GenZ
          <small>DEX</small>
        </div>
      </div>
      <div class="nav">
        <div class="status"><span class="dot"></span><span id="status">Rates live</span></div>
        <a class="status" href="/architecture">Architecture</a>
      </div>
    </section>

    <section class="hero">
      <div class="card">
        <h1>Buy tokens in naira with a cleaner control surface.</h1>
        <p class="lede">
          GenZ keeps the quote, the settlement path, and the final amount in view. It is intentionally quieter and more
          technical, closer to a desk workflow than a typical consumer landing page.
        </p>
        <div class="metrics">
          <div class="metric"><div class="num">3</div><div class="lbl">Settlement modes</div></div>
          <div class="metric"><div class="num">$0.50</div><div class="lbl">Minimum buy</div></div>
          <div class="metric"><div class="num">Live</div><div class="lbl">Quote routing</div></div>
          <div class="metric"><div class="num">24/7</div><div class="lbl">Availability</div></div>
        </div>
        <div class="flow-strip">
          <div class="step">
            <div class="label">Step 1</div>
            <div class="title">Pick token</div>
            <div class="desc">ETH, USDC, BNB, or MATIC.</div>
          </div>
          <div class="step">
            <div class="label">Step 2</div>
            <div class="title">Lock quote</div>
            <div class="desc">Compute naira cost from the reference price.</div>
          </div>
          <div class="step">
            <div class="label">Step 3</div>
            <div class="title">Confirm payment</div>
            <div class="desc">Orders route through inventory, batch, or RFQ.</div>
          </div>
          <div class="step">
            <div class="label">Step 4</div>
            <div class="title">Deliver tokens</div>
            <div class="desc">Release after the payment check passes.</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="section-title">
          <h2>Quote desk</h2>
          <span>Quote first, execute second</span>
        </div>
        <div class="tokens" role="group" aria-label="Token selection">
          <button class="token" aria-pressed="true" data-token="ETH">ETH</button>
          <button class="token" aria-pressed="false" data-token="USDC">USDC</button>
          <button class="token" aria-pressed="false" data-token="BNB">BNB</button>
          <button class="token" aria-pressed="false" data-token="MATIC">MATIC</button>
        </div>
        <div class="field">
          <label for="quote-naira">You pay (naira)</label>
          <div class="input-row">
            <div class="prefix">₦</div>
            <input id="quote-naira" value="2500" inputmode="numeric" />
          </div>
        </div>
        <div class="field">
          <label for="purpose">Purpose</label>
          <select id="purpose">
            <option value="spot" selected>Spot</option>
            <option value="nft_mint">NFT mint</option>
          </select>
        </div>
        <div class="swap">
          <div class="muted">
            <div>1 <strong id="swap-token">ETH</strong> = <strong id="swap-rate">₦5,553,290</strong></div>
            <div class="muted">Quote updates from the same engine used by the API.</div>
          </div>
          <div class="swap-icon">↔</div>
        </div>
        <div class="chips" aria-label="Quick amounts">
          <button class="chip" data-amount="500">₦500</button>
          <button class="chip" data-amount="1000">₦1,000</button>
          <button class="chip" data-amount="5000">₦5,000</button>
          <button class="chip" data-amount="10000">₦10,000</button>
          <button class="chip" data-amount="50000">₦50k</button>
          <button class="chip" data-amount="200000">₦200k</button>
        </div>
        <div class="controls">
          <button id="quote-btn" class="primary">Quote purchase</button>
          <button id="buy-btn" class="secondary">Execute order</button>
        </div>
        <div class="mini-grid">
          <div class="mini">
            <div class="label">Receive</div>
            <div class="value" id="receive-amount">1.537328</div>
          </div>
          <div class="mini">
            <div class="label">Mode</div>
            <div class="value" id="summary-status">Ready</div>
          </div>
          <div class="mini">
            <div class="label">Purpose</div>
            <div class="value" id="summary-purpose">Spot</div>
          </div>
        </div>
      </div>
    </section>

    <section class="layout">
      <div class="card">
        <div class="section-title">
          <h2>Order summary</h2>
          <span>Same numbers as the API</span>
        </div>
        <div class="summary">
          <div class="summary-row"><span>You pay</span><strong id="sum-pay">₦2,500</strong></div>
          <div class="summary-row"><span>You receive</span><strong id="sum-receive">1.537328 USDC</strong></div>
          <div class="summary-row"><span>Rate</span><strong id="sum-rate">1 USDC = ₦1,626</strong></div>
          <div class="summary-row"><span>Protocol fee</span><strong id="sum-fee">₦30</strong></div>
          <div class="summary-total"><span>Total charged</span><span id="sum-total">₦2,530</span></div>
        </div>
      </div>

      <div class="card">
        <div class="section-title">
          <h2>Protocol response</h2>
          <span>Request / response view</span>
        </div>
        <pre id="output">Ready.</pre>
      </div>
    </section>
  </main>
  <script>
    const output = document.getElementById('output');
    const tokenButtons = Array.from(document.querySelectorAll('.token'));
    const chipButtons = Array.from(document.querySelectorAll('.chip'));
    const quoteNaira = document.getElementById('quote-naira');
    const purpose = document.getElementById('purpose');
    const swapToken = document.getElementById('swap-token');
    const swapRate = document.getElementById('swap-rate');
    const receiveAmount = document.getElementById('receive-amount');
    const sumPay = document.getElementById('sum-pay');
    const sumReceive = document.getElementById('sum-receive');
    const sumRate = document.getElementById('sum-rate');
    const sumFee = document.getElementById('sum-fee');
    const sumTotal = document.getElementById('sum-total');
    const summaryPurpose = document.getElementById('summary-purpose');
    const summaryStatus = document.getElementById('summary-status');
    const status = document.getElementById('status');

    const FX_RATE = 1600;
    let selectedToken = 'ETH';
    let selectedPurpose = 'spot';
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
        button.setAttribute('aria-pressed', String(button.dataset.token === symbol));
      });
      swapToken.textContent = symbol;
    }

    function setPurposeValue(value) {
      selectedPurpose = value;
      summaryPurpose.textContent = value === 'nft_mint' ? 'NFT Mint' : 'Spot';
    }

    function syncSummary(quote) {
      if (!quote) return;
      lastQuote = quote;
      const pay = Number(quoteNaira.value || '0');
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
      summaryStatus.textContent = quote.settlement_mode === 'inventory' ? 'Inventory' : quote.settlement_mode === 'rfq' ? 'RFQ' : 'Batch';
      swapRate.textContent = '₦' + formatNaira(total / Number(String(quote.token_amount).replace(/,/g, '')));
      status.textContent = 'Rates live';
    }

    async function refreshQuote() {
      const payload = {
        token_symbol: selectedToken,
        usd_amount: (Number(quoteNaira.value || '0') / FX_RATE).toFixed(6),
        purpose: selectedPurpose,
      };
      const quote = await post('/quote', payload);
      syncSummary(quote);
      show(quote);
      return quote;
    }

    tokenButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        setToken(button.dataset.token);
        await refreshQuote();
      });
    });

    chipButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        quoteNaira.value = button.dataset.amount;
        await refreshQuote();
      });
    });

    purpose.addEventListener('change', async () => {
      setPurposeValue(purpose.value);
      await refreshQuote();
    });

    document.getElementById('quote-btn').addEventListener('click', async () => {
      summaryStatus.textContent = 'Quoting';
      await refreshQuote();
    });

    document.getElementById('buy-btn').addEventListener('click', async () => {
      summaryStatus.textContent = 'Executing';
      const order = await post('/purchase', {
        token_symbol: selectedToken,
        usd_amount: (Number(quoteNaira.value || '0') / FX_RATE).toFixed(6),
        purpose: selectedPurpose,
        payment_reference: 'demo-' + Math.random().toString(16).slice(2, 10),
      });
      show(order);
      summaryStatus.textContent = order.status;
    });

    quoteNaira.addEventListener('input', () => {
      summaryStatus.textContent = 'Typing';
    });
    quoteNaira.addEventListener('change', refreshQuote);

    setToken('ETH');
    setPurposeValue('spot');
    refreshQuote().catch((error) => show({ error: error.message }));
  </script>
</body>
</html>`;
}

module.exports = {
  renderLandingPage,
};
