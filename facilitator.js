require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json({ limit: '2mb' }));

// Minimal x402 facilitator mock (for demo only)
// Endpoints: GET /supported, POST /verify, POST /settle

app.get('/supported', (req, res) => {
  // Return "supported" shapes expected by verifier (best-effort)
  res.json({
    kinds: [
      { x402Version: 2, scheme: 'exact', network: 'stacks:2147483648' },
      { x402Version: 2, scheme: 'exact', network: 'stacks:1' },
    ],
    extensions: [],
    signers: {},
  });
});

app.post('/verify', (req, res) => {
  // For MVP we accept payload as-is
  res.json({ success: true });
});

app.post('/settle', async (req, res) => {
  // In real facilitator: broadcast tx + wait confirmations.
  // MVP mock: immediately return success.
  const payload = req.body || {};
  const tx = payload?.paymentPayload?.payload?.transaction || payload?.payload?.transaction || null;
  res.json({
    success: true,
    payer: payload?.paymentPayload?.accepted?.payTo ? undefined : undefined,
    transaction: tx || '0xMOCK_TX',
    network: payload?.paymentRequirements?.network || payload?.paymentPayload?.accepted?.network || 'stacks:2147483648',
  });
});

const PORT = 8085;
app.listen(PORT, () => {
  console.log(`Mock facilitator listening on http://localhost:${PORT}`);
});
