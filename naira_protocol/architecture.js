function renderArchitecturePage() {
  return String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>GenZ - Architecture & Audit</title>
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
      --amber-bg: #2a1f00;
      --blue-bg: #00142a;
      --green-bg: #00201a;
      --red-bg: #2a0000;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: "DM Mono", ui-monospace, SFMono-Regular, Consolas, monospace;
      padding: 2rem 1rem 3rem;
      line-height: 1.6;
      font-size: 13px;
    }
    .page {
      width: min(1320px, calc(100vw - 24px));
      margin: 0 auto;
    }
    h1 {
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 1.5rem;
      padding-bottom: 10px;
      border-bottom: 0.5px solid var(--border);
    }
    h2 {
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      margin: 0 0 1rem;
    }
    h3 {
      font-size: 12px;
      font-weight: 500;
      color: #e8eaf4;
      margin: 0 0 8px;
    }
    .hero {
      display: grid;
      grid-template-columns: 1.6fr 1fr;
      gap: 12px;
      margin-bottom: 1rem;
    }
    .card {
      background: var(--panel);
      border: 0.5px solid var(--border);
      border-radius: 8px;
      padding: 14px;
    }
    .hero p {
      margin: 0;
      color: var(--muted);
      max-width: 70ch;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 1rem 0 1.5rem;
    }
    .metric {
      text-align: center;
      padding: 12px;
      border: 0.5px solid var(--border);
      background: var(--panel);
    }
    .metric .num {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 2px;
    }
    .metric .lbl {
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #5a6080;
    }
    .tabbar {
      display: flex;
      border-bottom: 0.5px solid var(--border);
      margin-bottom: 0;
      flex-wrap: wrap;
    }
    .tab {
      padding: 8px 16px;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: none;
      border: 0;
      border-bottom: 2px solid transparent;
      color: #5a6080;
      cursor: pointer;
      font-family: inherit;
    }
    .tab.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .tabcontent {
      display: none;
      padding-top: 1.25rem;
    }
    .tabcontent.active {
      display: block;
    }
    .flow {
      display: grid;
      gap: 0;
    }
    .flow-row {
      display: grid;
      grid-template-columns: 1fr 24px 1fr;
      gap: 0;
      align-items: stretch;
    }
    .flow-node {
      border: 0.5px solid var(--border);
      background: #131620;
      padding: 12px 14px;
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
      line-height: 1.5;
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
    .tag-amber { color: var(--accent); background: var(--amber-bg); }
    .tag-green { color: var(--green); background: var(--green-bg); }
    .tag-blue { color: var(--blue); background: var(--blue-bg); }
    .tag-red { color: var(--red); background: var(--red-bg); }
    .arrow-right, .arrow-down {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--border);
      font-size: 18px;
    }
    .stack {
      display: grid;
      gap: 12px;
    }
    .code {
      background: var(--panel-2);
      border: 0.5px solid var(--border);
      border-radius: 6px;
      padding: 1rem;
      overflow-x: auto;
    }
    .code pre {
      margin: 0;
      white-space: pre;
      font-family: inherit;
      font-size: 12px;
      line-height: 1.7;
      color: var(--text);
    }
    .kw { color: var(--accent); }
    .fn { color: var(--blue); }
    .str { color: var(--green); }
    .cm { color: #3a4060; }
    .num { color: #ff9d6f; }
    .ty { color: #c084fc; }
    .audit-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .audit-table th {
      text-align: left;
      padding: 8px 12px;
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #5a6080;
      border-bottom: 0.5px solid var(--border);
      font-weight: 400;
    }
    .audit-table td {
      padding: 10px 12px;
      border-bottom: 0.5px solid #1a1d28;
      vertical-align: top;
    }
    .sev {
      display: inline-block;
      font-size: 9px;
      padding: 2px 8px;
      border-radius: 3px;
      letter-spacing: 0.05em;
      font-weight: 500;
      border: 0.5px solid currentColor;
    }
    .sev-high { color: #ff9d6f; background: #2a1400; }
    .sev-med { color: var(--accent); background: var(--amber-bg); }
    .sev-low { color: var(--blue); background: var(--blue-bg); }
    .sev-ok { color: var(--green); background: var(--green-bg); }
    .fix {
      font-size: 11px;
      color: var(--muted);
      margin-top: 4px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 1.5rem;
    }
    .sum-card {
      background: #131620;
      border: 0.5px solid var(--border);
      padding: 12px;
      text-align: center;
    }
    .sum-num { font-size: 24px; font-weight: 500; }
    .sum-lbl {
      font-size: 9px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #5a6080;
      margin-top: 3px;
    }
    .section { margin-bottom: 2.5rem; }
    .muted { color: var(--muted); }
    @media (max-width: 980px) {
      .hero, .summary, .flow-row, .summary-grid { grid-template-columns: 1fr; }
      .arrow-right { display: none; }
      .page { width: min(100vw - 20px, 1320px); }
    }
  </style>
</head>
<body>
  <main class="page">
    <h1>// GenZ Architecture & Security Audit</h1>

    <section class="hero">
      <div class="card">
        <h3>System overview</h3>
        <p>
          GenZ is a quote-first token exchange flow: the user locks a naira amount, the backend creates an order and
          virtual account, Paystack confirms the NGN credit, and the relayer releases tokens from escrow after checks pass.
          This page documents the transaction path, backend responsibilities, contract boundaries, and the current audit posture.
        </p>
      </div>
      <div class="card">
        <h3>Operational model</h3>
        <p class="muted">
          Frontend, backend, webhook verification, on-chain release, seller settlement, and failure handling are separated so
          each step can be reasoned about independently.
        </p>
      </div>
    </section>

    <div class="summary-grid">
      <div class="sum-card"><div class="sum-num" style="color:#ff5f5f">0</div><div class="sum-lbl">Critical</div></div>
      <div class="sum-card"><div class="sum-num" style="color:#ff9d6f">2</div><div class="sum-lbl">High</div></div>
      <div class="sum-card"><div class="sum-num" style="color:#f0a832">4</div><div class="sum-lbl">Medium</div></div>
      <div class="sum-card"><div class="sum-num" style="color:#60aaff">3</div><div class="sum-lbl">Low / Info</div></div>
    </div>

    <nav class="tabbar" aria-label="Architecture sections">
      <button class="tab active" data-tab="flow" type="button">01 Flow</button>
      <button class="tab" data-tab="backend" type="button">02 Backend</button>
      <button class="tab" data-tab="contracts" type="button">03 Contracts</button>
      <button class="tab" data-tab="audit" type="button">04 Audit</button>
    </nav>

    <section id="tab-flow" class="tabcontent active">
      <div class="section">
        <h2>End-to-end transaction flow</h2>
        <div class="flow">
          <div class="flow-row">
            <div class="flow-node highlight">
              <div class="node-label">Step 1 - Buyer</div>
              <div class="node-title">Select token and enter NGN amount</div>
              <div class="node-desc">UI locks the rate from oracle. Order is created in the DB with state <code>PENDING_PAYMENT</code>.</div>
              <span class="node-tag tag-amber">Frontend</span>
            </div>
            <div class="arrow-right">&rarr;</div>
            <div class="flow-node">
              <div class="node-label">Step 2 - Backend</div>
              <div class="node-title">Create virtual account</div>
              <div class="node-desc">A dedicated Paystack account is created per order. The account number identifies the order.</div>
              <span class="node-tag tag-blue">Node.js</span>
            </div>
          </div>

          <div class="arrow-down">&darr;</div>

          <div class="flow-row">
            <div class="flow-node">
              <div class="node-label">Step 3 - Paystack</div>
              <div class="node-title">NGN credit webhook</div>
              <div class="node-desc">Webhook fires on transfer credit. Signature is verified before the order is touched.</div>
              <span class="node-tag tag-amber">Webhook</span>
            </div>
            <div class="arrow-right">&larr;</div>
            <div class="flow-node green">
              <div class="node-label">Step 4 - Backend</div>
              <div class="node-title">Verify and call contract</div>
              <div class="node-desc">Exact amount is checked, order is marked confirmed, and the relayer signs the release transaction.</div>
              <span class="node-tag tag-green">Relayer</span>
            </div>
          </div>

          <div class="arrow-down">&darr;</div>

          <div class="flow-row">
            <div class="flow-node highlight">
              <div class="node-label">Step 5 - Smart contract</div>
              <div class="node-title">OTCDesk.release()</div>
              <div class="node-desc">Contract verifies relayer authority, pulls from seller escrow, transfers tokens, and emits the fill event.</div>
              <span class="node-tag tag-green">On-chain</span>
            </div>
            <div class="arrow-right">&rarr;</div>
            <div class="flow-node green">
              <div class="node-label">Step 6 - Buyer</div>
              <div class="node-title">Token delivered</div>
              <div class="node-desc">Buyer receives USDC, ETH, BNB, or MATIC and the order moves to <code>SETTLED</code>.</div>
              <span class="node-tag tag-green">2-5 min</span>
            </div>
          </div>

          <div class="arrow-down">&darr;</div>

          <div class="flow-row">
            <div class="flow-node">
              <div class="node-label">Step 7 - Seller settlement</div>
              <div class="node-title">NGN disbursed to seller bank</div>
              <div class="node-desc">Seller payouts are batched through the transfer rail after fills are confirmed.</div>
              <span class="node-tag tag-blue">Async</span>
            </div>
            <div class="arrow-right">&rarr;</div>
            <div class="flow-node red">
              <div class="node-label">Failure path</div>
              <div class="node-title">Timeout or mismatch</div>
              <div class="node-desc">Expired orders are deactivated, and mismatched credits are held for review.</div>
              <span class="node-tag tag-red">Fallback</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="tab-backend" class="tabcontent">
      <div class="section stack">
        <div>
          <h2>Order creation + rate oracle</h2>
          <div class="code">
            <pre><span class="cm">// routes/orders.ts</span>
<span class="kw">import</span> { getRateSnapshot } <span class="kw">from</span> <span class="str">'../oracle'</span>
<span class="kw">import</span> { createVirtualAccount } <span class="kw">from</span> <span class="str">'../paystack'</span>
<span class="kw">import</span> { db } <span class="kw">from</span> <span class="str">'../db'</span>

<span class="kw">export async function</span> <span class="fn">createOrder</span>(req, res) {
  <span class="kw">const</span> { ngnAmount, token, buyerWallet } = req.body
  <span class="kw">if</span> (ngnAmount &lt; <span class="num">400</span>) <span class="kw">throw</span> <span class="kw">new</span> Error(<span class="str">'Minimum NGN 400'</span>)
  <span class="kw">if</span> (!isValidEthAddress(buyerWallet)) <span class="kw">throw</span> <span class="kw">new</span> Error(<span class="str">'Invalid wallet'</span>)

  <span class="kw">const</span> rate = <span class="kw">await</span> <span class="fn">getRateSnapshot</span>(token)
  <span class="kw">const</span> tokenAmount = ngnAmount / rate.ngnPerToken
  <span class="kw">const</span> fee = ngnAmount * <span class="num">0.012</span>
  <span class="kw">const</span> totalNgn = ngnAmount + fee
  <span class="kw">const</span> seller = <span class="kw">await</span> <span class="fn">matchSeller</span>(token, tokenAmount)
  <span class="kw">if</span> (!seller) <span class="kw">throw</span> <span class="kw">new</span> Error(<span class="str">'No liquidity available'</span>)

  <span class="kw">const</span> dva = <span class="kw">await</span> <span class="fn">createVirtualAccount</span>({
    email: <span class="str">'order@genz.example'</span>,
    preferred_bank: <span class="str">'wema-bank'</span>,
    amount_limit: totalNgn * <span class="num">100</span>
  })

  <span class="kw">const</span> order = <span class="kw">await</span> db.orders.<span class="fn">create</span>({
    token,
    ngnAmount,
    tokenAmount,
    totalNgn,
    fee,
    buyerWallet,
    sellerId: seller.id,
    virtualAccountId: dva.id,
    accountNumber: dva.account_number,
    bankName: dva.bank.name,
    rateSnapshot: rate,
    status: <span class="str">'PENDING_PAYMENT'</span>,
    expiresAt: <span class="kw">new</span> Date(Date.now() + <span class="num">15</span> * <span class="num">60</span> * <span class="num">1000</span>)
  })

  <span class="kw">return</span> res.<span class="fn">json</span>({ order, paymentInstructions: dva })
}</pre>
          </div>
        </div>

        <div>
          <h2>Webhook handler</h2>
          <div class="code">
            <pre><span class="cm">// routes/webhook.ts</span>
<span class="kw">export async function</span> <span class="fn">handleWebhook</span>(req, res) {
  <span class="kw">const</span> hash = crypto.<span class="fn">createHmac</span>(<span class="str">'sha512'</span>, process.env.PAYSTACK_SECRET)
    .<span class="fn">update</span>(JSON.<span class="fn">stringify</span>(req.body)).<span class="fn">digest</span>(<span class="str">'hex'</span>)
  <span class="kw">if</span> (hash !== req.headers[<span class="str">'x-paystack-signature'</span>]) <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">401</span>).<span class="fn">end</span>()

  <span class="kw">const</span> { event, data } = req.body
  <span class="kw">if</span> (event !== <span class="str">'charge.success'</span>) <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">end</span>()

  <span class="kw">const</span> alreadyProcessed = <span class="kw">await</span> redis.<span class="fn">set</span>(<span class="str">'webhook:'</span> + data.reference, <span class="str">'1'</span>, <span class="str">'NX'</span>, <span class="str">'EX'</span>, <span class="num">86400</span>)
  <span class="kw">if</span> (!alreadyProcessed) <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">end</span>()

  <span class="kw">const</span> order = <span class="kw">await</span> db.orders.<span class="fn">findByAccountNumber</span>(data.authorization.receiver_bank_account_number)
  <span class="kw">if</span> (!order || order.status !== <span class="str">'PENDING_PAYMENT'</span>) <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">end</span>()

  <span class="kw">const</span> paid = data.amount / <span class="num">100</span>
  <span class="kw">if</span> (Math.<span class="fn">abs</span>(paid - order.totalNgn) &gt; <span class="num">0.5</span>) {
    <span class="kw">await</span> <span class="fn">flagForManualReview</span>(order, paid)
    <span class="kw">return</span> res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">end</span>()
  }

  <span class="kw">await</span> releaseQueue.<span class="fn">add</span>(<span class="str">'release'</span>, { orderId: order.id }, { attempts: <span class="num">3</span>, backoff: <span class="num">5000</span> })
  res.<span class="fn">status</span>(<span class="num">200</span>).<span class="fn">end</span>()
}</pre>
          </div>
        </div>
      </div>
    </section>

    <section id="tab-contracts" class="tabcontent">
      <div class="section stack">
        <div>
          <h2>OTCDesk.sol - release logic</h2>
          <div class="code">
            <pre><span class="cm">// SPDX-License-Identifier: MIT</span>
<span class="kw">pragma solidity</span> ^<span class="num">0.8.20</span>;

<span class="kw">contract</span> <span class="ty">OTCDesk</span> {
  <span class="kw">address public</span> relayer;
  <span class="kw">mapping</span>(<span class="ty">bytes32</span> =&gt; <span class="ty">bool</span>) <span class="kw">public</span> usedOrderIds;

  <span class="kw">function</span> <span class="fn">release</span>(
    <span class="ty">bytes32</span> orderId,
    <span class="ty">address</span> token,
    <span class="ty">uint256</span> amount,
    <span class="ty">address</span> buyer,
    <span class="ty">address</span> escrow
  ) <span class="kw">external</span> {
    <span class="kw">require</span>(msg.sender == relayer, <span class="str">"Not relayer"</span>);
    <span class="kw">require</span>(!usedOrderIds[orderId], <span class="str">"Order already filled"</span>);
    usedOrderIds[orderId] = <span class="kw">true</span>;
    <span class="kw">require</span>(amount &gt; <span class="num">0</span>, <span class="str">"Zero amount"</span>);
    <span class="ty">ISellerEscrow</span>(escrow).<span class="fn">release</span>(token, amount, buyer);
  }
}</pre>
          </div>
        </div>

        <div>
          <h2>SellerEscrow.sol - liquidity vault</h2>
          <div class="code">
            <pre><span class="kw">contract</span> <span class="ty">SellerEscrow</span> {
  <span class="ty">address</span> <span class="kw">public immutable</span> desk;
  <span class="ty">address</span> <span class="kw">public immutable</span> seller;
  <span class="kw">mapping</span>(<span class="ty">address</span> =&gt; <span class="ty">uint256</span>) <span class="kw">public</span> balances;

  <span class="kw">function</span> <span class="fn">release</span>(<span class="ty">address</span> token, <span class="ty">uint256</span> amount, <span class="ty">address</span> buyer) <span class="kw">external</span> {
    <span class="kw">require</span>(msg.sender == desk, <span class="str">"Only desk"</span>);
    <span class="kw">require</span>(balances[token] &gt;= amount, <span class="str">"Insufficient liquidity"</span>);
    balances[token] -= amount;
    <span class="ty">IERC20</span>(token).<span class="fn">transfer</span>(buyer, amount);
  }
}</pre>
          </div>
        </div>
      </div>
    </section>

    <section id="tab-audit" class="tabcontent">
      <div class="section">
        <h2>Security audit findings</h2>
        <table class="audit-table">
          <thead>
            <tr>
              <th style="width:80px">Severity</th>
              <th style="width:220px">Finding</th>
              <th>Detail</th>
              <th style="width:180px">Mitigation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="sev sev-high">HIGH</span></td>
              <td style="color:#e8eaf4">Relayer single point of failure</td>
              <td>A compromised relayer could release arbitrary escrowed balances if the private key is not protected.</td>
              <td><div class="fix">Use multisig or time-delayed release for large fills.</div></td>
            </tr>
            <tr>
              <td><span class="sev sev-high">HIGH</span></td>
              <td style="color:#e8eaf4">No token allowlist</td>
              <td>Without an allowlist, the release path could be pointed at unsupported or malicious tokens.</td>
              <td><div class="fix">Restrict contracts to approved token addresses.</div></td>
            </tr>
            <tr>
              <td><span class="sev sev-med">MED</span></td>
              <td style="color:#e8eaf4">Webhook replay window</td>
              <td>Redis idempotency alone is not enough if the cache layer fails.</td>
              <td><div class="fix">Add a DB unique constraint on the payment reference.</div></td>
            </tr>
            <tr>
              <td><span class="sev sev-med">MED</span></td>
              <td style="color:#e8eaf4">Rate oracle concentration</td>
              <td>Single-source pricing creates a stale-data or outage risk.</td>
              <td><div class="fix">Use a median of multiple sources and reject large deviations.</div></td>
            </tr>
            <tr>
              <td><span class="sev sev-med">MED</span></td>
              <td style="color:#e8eaf4">Seller withdrawal risk</td>
              <td>Unlocked balances can move while an order is in flight.</td>
              <td><div class="fix">Lock escrow balances while orders are active.</div></td>
            </tr>
            <tr>
              <td><span class="sev sev-low">LOW</span></td>
              <td style="color:#e8eaf4">Missing event metadata</td>
              <td>Deposit and withdraw events should include more indexable fields for off-chain monitoring.</td>
              <td><div class="fix">Emit indexed seller and timestamp fields.</div></td>
            </tr>
            <tr>
              <td><span class="sev sev-low">LOW</span></td>
              <td style="color:#e8eaf4">Expiry cleanup</td>
              <td>Expired virtual accounts must be deactivated so late transfers do not hang unresolved.</td>
              <td><div class="fix">Run a minute-level cleanup job and alert ops on late credits.</div></td>
            </tr>
            <tr>
              <td><span class="sev sev-ok">PASS</span></td>
              <td style="color:#4affa0">Replay protection on-chain</td>
              <td>The order ID is marked as used after the first successful release.</td>
              <td><div class="fix">No action needed.</div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <script>
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tabcontent');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach((item) => item.classList.toggle('active', item === tab));
        panels.forEach((panel) => panel.classList.toggle('active', panel.id === 'tab-' + target));
      });
    });
  </script>
</body>
</html>`;
}

module.exports = {
  renderArchitecturePage,
};
