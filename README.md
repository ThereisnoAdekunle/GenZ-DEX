# GenZ

This workspace contains a small protocol engine for selling tokens in naira without forcing every trade through an on-chain swap.

## What it does

- Quotes token purchases in naira from a USD-denominated reference price.
- Supports very small buys, including sub-dollar amounts such as `0.50 USD`.
- Routes small trades from inventory, standard trades through batched settlement, and large trades through RFQ.
- Adds a gas sponsorship buffer for NFT-minting flows.
- Exposes a tiny HTTP API for quotes, purchases, token listings, and treasury inspection.

## Files

- `naira_protocol/engine.js`: core pricing and settlement logic.
- `naira_protocol/server.js`: local HTTP adapter.
- `test/engine.test.js`: behavioral checks.

## Run

```bash
node --test
node naira_protocol/server.js
```

## Example request

```bash
curl -X POST http://127.0.0.1:8000/quote ^
  -H "Content-Type: application/json" ^
  -d "{\"token_symbol\":\"ETH\",\"usd_amount\":\"1\",\"purpose\":\"nft_mint\"}"
```
