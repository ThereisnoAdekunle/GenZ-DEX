function renderLandingPage() {
  return String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GenZ</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
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
      --red: #ff5f5f;
      --soft: rgba(255,255,255,0.03);
    }
    * { box-sizing: border-box; }
    html, body { min-height: 100%; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: "DM Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
      padding: 1.75rem 0.75rem 2.5rem;
      line-height: 1.5;
      font-size: 13px;
    }
    .page {
      width: min(1320px, calc(100vw - 18px));
      margin: 0 auto;
    }
    h1 {
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 1.5rem;
      border-bottom: 0.5px solid var(--border);
      padding-bottom: 10px;
      font-weight: 400;
    }
    h2 {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 1rem;
      font-weight: 400;
    }
    h3 {
      font-size: 12px;
      font-weight: 500;
      color: #e8eaf4;
      margin: 0 0 8px;
    }
    .topbar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: center;
      margin-bottom: 0.5rem;
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
      border-radius: 6px;
      background: linear-gradient(135deg, rgba(240, 168, 50, 0.95), rgba(96, 170, 255, 0.9));
      color: #171311;
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
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 11px;
      border-radius: 6px;
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
    .tabbar {
      display: flex;
      gap: 0;
      margin-bottom: 0.5rem;
      border-bottom: 0.5px solid var(--border);
      flex-wrap: wrap;
    }
    .tab {
      padding: 7px 14px;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      color: #5a6080;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      background: none;
      border-top: none;
      border-left: none;
      border-right: none;
      font-family: inherit;
    }
    .tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .tabpane {
      display: none;
      padding-top: 1.25rem;
    }
    .tabpane.active {
      display: block;
    }
    .hero {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 5px;
      margin-bottom: 0.45rem;
    }
    .card {
      background: var(--panel);
      border: 0.5px solid var(--border);
      border-radius: 6px;
      padding: 9px;
    }
    .lede {
      margin: 0;
      max-width: 68ch;
      color: var(--muted);
      line-height: 1.4;
      font-size: 13px;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3px;
      margin-top: 0.55rem;
    }
    .metric {
      text-align: center;
      padding: 8px;
      border: 0.5px solid var(--border);
      background: #131620;
    }
    .metric .num {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 2px;
      color: #e8eaf4;
    }
    .metric .lbl {
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #5a6080;
    }
    .flow {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .flow-row {
      display: flex;
      align-items: stretch;
      gap: 0;
    }
    .flow-node {
      flex: 1;
      border: 0.5px solid var(--border);
      padding: 9px 11px;
      background: #131620;
    }
    .flow-node.highlight { border-color: var(--accent); }
    .flow-node.green { border-color: var(--green); }
    .flow-node.red { border-color: var(--red); }
    .node-label {
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #5a6080;
      margin-bottom: 4px;
    }
    .node-title {
      font-size: 13px;
      font-weight: 500;
      color: #e8eaf4;
      margin-bottom: 4px;
    }
    .node-desc {
      font-size: 11px;
      color: var(--muted);
      line-height: 1.45;
    }
    .node-tag {
      display: inline-block;
      margin-top: 6px;
      font-size: 9px;
      padding: 2px 7px;
      border-radius: 3px;
      letter-spacing: 0.06em;
      border: 0.5px solid currentColor;
    }
    .tag-amber { color: var(--accent); background: #2a1f00; }
    .tag-green { color: var(--green); background: #00201a; }
    .tag-blue { color: var(--blue); background: #00142a; }
    .tag-red { color: var(--red); background: #2a0000; }
    .arrow-down {
      text-align: center;
      color: var(--border);
      font-size: 18px;
      padding: 4px 0;
    }
    .arrow-right {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--border);
      font-size: 16px;
      width: 24px;
      flex-shrink: 0;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.04fr) minmax(320px, 0.96fr);
      gap: 8px;
      margin-top: 8px;
    }
    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      margin: 0 0 6px;
    }
    .section-title span {
      color: var(--muted);
      font-size: 12px;
    }
    .tokens {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 5px 0 10px;
    }
    .token, .chip {
      padding: 7px 11px;
      border-radius: 6px;
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
      gap: 8px;
      align-items: center;
    }
    .prefix {
      display: grid;
      place-items: center;
      height: 100%;
      border-radius: 6px;
      border: 0.5px solid var(--border);
      background: var(--soft);
      color: #5a6080;
      font-weight: 700;
    }
    input, select, button {
      width: 100%;
      padding: 11px 13px;
      border-radius: 6px;
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
      padding-top: 7px;
      margin-top: 7px;
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
      border-radius: 6px;
      border: 0.5px solid var(--border);
      background: var(--soft);
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 7px 0;
    }
    .chip { color: var(--muted); }
    .controls {
      display: flex;
      gap: 10px;
      margin-top: 8px;
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
    .mini-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 3px;
      margin-top: 8px;
    }
    .mini {
      border: 0.5px solid var(--border);
      background: #131620;
      padding: 8px;
      text-align: center;
    }
    .mini .label {
      color: #5a6080;
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .mini .value {
      color: #e8eaf4;
      font-size: 14px;
      font-weight: 700;
    }
    .summary {
      display: grid;
      gap: 5px;
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
      padding-top: 8px;
      margin-top: 7px;
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
      padding: 11px;
      background: var(--panel-2);
      border-radius: 6px;
      border: 0.5px solid var(--border);
      color: #f0e9dd;
      overflow: auto;
      min-height: 180px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 11px;
      border-radius: 6px;
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
      .hero, .layout { grid-template-columns: 1fr; }
      .topbar { grid-template-columns: 1fr; }
      .nav { justify-content: flex-start; }
      .controls { flex-direction: column; }
      .metrics, .mini-grid { grid-template-columns: 1fr; }
      .page { width: min(100vw - 20px, 1320px); }
    }
  </style>
</head>
<body>
  <main class="page">
    <h1>// GenZ Protocol - Landing & Quote Desk</h1>

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

    <nav class="tabbar" aria-label="Primary sections">
      <button class="tab active" data-tab="flow" type="button">01 Flow</button>
      <button class="tab" data-tab="quote" type="button">02 Quote</button>
      <button class="tab" data-tab="response" type="button">03 Response</button>
    </nav>

    <section id="tab-flow" class="tabpane active">
      <div class="hero">
        <div class="card">
          <h3>Product overview</h3>
          <p class="lede">
            GenZ is a quote-first token desk: the user picks an asset, the backend locks a rate, and the purchase moves
            through inventory, batch, or RFQ depending on size and liquidity.
          </p>
          <div class="metrics">
            <div class="metric"><div class="num">3</div><div class="lbl">Settlement modes</div></div>
            <div class="metric"><div class="num">$0.50</div><div class="lbl">Minimum buy</div></div>
            <div class="metric"><div class="num">Live</div><div class="lbl">Quote routing</div></div>
            <div class="metric"><div class="num">24/7</div><div class="lbl">Availability</div></div>
          </div>
        </div>
        <div class="card">
          <h3>Transaction flow</h3>
          <div class="flow">
            <div class="flow-row">
              <div class="flow-node highlight">
                <div class="node-label">Step 1 - Buyer</div>
                <div class="node-title">Pick token and enter NGN amount</div>
                <div class="node-desc">The interface locks the amount before quote execution.</div>
                <span class="node-tag tag-amber">Frontend</span>
              </div>
              <div class="arrow-right">→</div>
              <div class="flow-node">
                <div class="node-label">Step 2 - Backend</div>
                <div class="node-title">Create payment context</div>
                <div class="node-desc">The server prepares the order and settlement route.</div>
                <span class="node-tag tag-blue">Node.js</span>
              </div>
            </div>
            <div class="arrow-down">↓</div>
            <div class="flow-row">
              <div class="flow-node green">
                <div class="node-label">Step 3 - Engine</div>
                <div class="node-title">Quote and route</div>
                <div class="node-desc">Inventory, batch, or RFQ is selected from the same price engine.</div>
                <span class="node-tag tag-green">Protocol</span>
              </div>
              <div class="arrow-right">←</div>
              <div class="flow-node red">
                <div class="node-label">Step 4 - Buyer</div>
                <div class="node-title">Execute purchase</div>
                <div class="node-desc">Payment reference and amount are checked before release.</div>
                <span class="node-tag tag-red">Settlement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="tab-quote" class="tabpane">
      <div class="layout">
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
              <div class="muted">The same engine powers the API and the page.</div>
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
          <div class="mini-grid" style="margin-top:12px;">
            <div class="mini"><div class="label">Quote state</div><div class="value" id="summary-state">Loaded</div></div>
            <div class="mini"><div class="label">Destination</div><div class="value">Wallet</div></div>
            <div class="mini"><div class="label">Route</div><div class="value">Desk</div></div>
          </div>
        </div>
      </div>
    </section>

    <section id="tab-response" class="tabpane">
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
    const tabButtons = Array.from(document.querySelectorAll('.tab'));
    const tabs = Array.from(document.querySelectorAll('.tabpane'));
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
    const summaryState = document.getElementById('summary-state');
    const status = document.getElementById('status');

    const FX_RATE = 1600;
    let selectedToken = 'ETH';
    let selectedPurpose = 'spot';

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

    function activateTab(name) {
      tabButtons.forEach((button) => button.classList.toggle('active', button.dataset.tab === name));
      tabs.forEach((pane) => pane.classList.toggle('active', pane.id === 'tab-' + name));
    }

    function syncSummary(quote) {
      if (!quote) return;
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
      summaryState.textContent = quote.settlement_mode;
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

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => activateTab(button.dataset.tab));
    });

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
      summaryState.textContent = order.status;
      activateTab('response');
    });

    quoteNaira.addEventListener('input', () => {
      summaryStatus.textContent = 'Typing';
    });
    quoteNaira.addEventListener('change', refreshQuote);

    setToken('ETH');
    setPurposeValue('spot');
    activateTab('flow');
    refreshQuote().catch((error) => show({ error: error.message }));
  </script>
</body>
</html>`;
}

module.exports = {
  renderLandingPage,
};
