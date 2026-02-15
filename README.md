# x402 on Stacks — HTTP 402 Pay-per-Request MVP (Testnet)

This repo is a **minimal, hackathon-ready demo** of the x402 flow on the **Stacks testnet**:

1. Client calls a paid endpoint (`/api/premium-data`)
2. Server responds **HTTP 402 Payment Required** with `payment-required` header
3. Client **automatically signs** a payment and retries (axios interceptor)
4. Server returns **HTTP 200** + JSON + `payment-response` header

## What’s inside
- `server.js` — Express server with `paymentMiddleware()`
- `client.js` — axios client wrapped with `wrapAxiosWithPayment()`
- `facilitator.js` — **local mock facilitator** (used for reliable demo)

## Why a local mock facilitator?
Some hosted facilitators can be slow/unreliable during demos. For a stable hackathon submission, this repo includes a **local facilitator mock** that immediately returns a successful settlement response.

> Swap `FACILITATOR_URL` in `.env` to a real facilitator if you want real on-chain broadcasting/confirmation.

## Quickstart

### 1) Install
```bash
npm i
```

### 2) Configure env
```bash
cp .env.example .env
# Edit .env and set PRIVATE_KEY (Stacks testnet, hex)
```

### 3) Run (3 terminals)
Terminal A:
```bash
npm run facilitator
```

Terminal B:
```bash
npm run server
```

Terminal C:
```bash
npm run client
```

If successful, you’ll see `HTTP 200` and a JSON response from the premium endpoint.

## Security
- **Never commit** `.env` or any private keys.
- This repo is intended for **testnet demo** purposes.
