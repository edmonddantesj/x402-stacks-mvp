require('dotenv').config();
const axios = require('axios');
const { wrapAxiosWithPayment, privateKeyToAccount, decodePaymentResponse } = require('x402-stacks');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('Missing PRIVATE_KEY in .env (never paste it in chat)');
  process.exit(1);
}

(async () => {
  const account = privateKeyToAccount(PRIVATE_KEY, 'testnet');

  const api = wrapAxiosWithPayment(
    axios.create({ baseURL: SERVER_URL, timeout: 30000 }),
    account
  );

  console.log('Calling premium endpoint (payment should be automatic)...');
  const resp = await api.get('/api/premium-data');

  console.log('HTTP', resp.status);
  console.log('Response data:', resp.data);

  const pr = decodePaymentResponse(resp.headers['payment-response']);
  if (pr) {
    console.log('payment-response:', pr);
  } else {
    console.log('No payment-response header found (still OK if JSON returned).');
  }
})().catch((e) => {
  const status = e?.response?.status;
  const body = e?.response?.data;
  console.error('Client error:', status || '', body || e.message);
  process.exit(1);
});
