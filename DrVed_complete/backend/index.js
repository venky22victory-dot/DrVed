require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Low, JSONFile } = require('lowdb');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_keyid',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// lowdb setup for demo products
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB(){
  await db.read();
  db.data = db.data || { products: [] };
  await db.write();
}
initDB();

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Products
app.get('/api/products', async (req, res) => {
  await db.read();
  res.json(db.data.products);
});
app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  await db.read();
  const p = db.data.products.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

// Create Razorpay order (expects amount in paise)
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'rcpt_' + Date.now(), notes = {} } = req.body;
    if (!amount) return res.status(400).json({ error: 'amount is required (in paise)' });
    const options = {
      amount: amount,
      currency,
      receipt,
      payment_capture: 1,
      notes
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('create-order-error', err);
    res.status(500).json({ error: 'failed to create order', details: err.message });
  }
});

// Verify payment signature (client can post the payment response for verification)
app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret');
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    const valid = generated_signature === razorpay_signature;
    res.json({ valid, generated_signature });
  } catch (err) {
    console.error('verify-error', err);
    res.status(500).json({ error: 'verification failed', details: err.message });
  }
});

// Webhook endpoint stub (configure on Razorpay dashboard)
app.post('/api/webhook', (req, res) => {
  // verify the webhook signature as per Razorpay docs
  console.log('received webhook', req.body);
  res.json({ status: 'received' });
});

app.listen(PORT, () => {
  console.log(`DrVed backend listening on ${PORT}`);
});
