require('dotenv').config();
const express = require('express');
const { paymentMiddleware, getPayment, STXtoMicroSTX } = require('x402-stacks');

const app = express();

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
const FACILITATOR_URL = process.env.FACILITATOR_URL;
const PORT = Number(process.env.PORT || 3000);

if (!SERVER_ADDRESS) {
  console.error('Missing SERVER_ADDRESS in .env');
  process.exit(1);
}

app.get(
  '/api/premium-data',
  paymentMiddleware({
    amount: STXtoMicroSTX(0.01), // 0.01 STX
    payTo: SERVER_ADDRESS,
    network: 'testnet',
    facilitatorUrl: FACILITATOR_URL,
    description: 'x402-stacks MVP: premium endpoint',
  }),
  (req, res) => {
    const payment = getPayment(req);
    res.json({
      ok: true,
      message: 'Premium content unlocked via HTTP 402 + x402-stacks',
      paidBy: payment?.payer || null,
      tx: payment?.transaction || null,
      network: payment?.network || 'testnet',
      ts: new Date().toISOString(),
    });
  }
);

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`Premium endpoint: http://localhost:${PORT}/api/premium-data`);
});
