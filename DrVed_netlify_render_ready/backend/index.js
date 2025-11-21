require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const { Low, JSONFile } = require('lowdb');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_keyid',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret'
});

// simple lowdb
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB(){
  await db.read();
  db.data = db.data || { products: [] };
  if(!db.data.products || db.data.products.length === 0){
    db.data.products = [
      { id: 1, name: 'Bamboo Toothbrush - Classic', price: 199, currency: 'INR', description: 'Moso bamboo handle, charcoal bristles.', image: '/images/toothbrush.png' },
      { id: 2, name: 'Paper Pen - Eco', price: 49, currency: 'INR', description: 'Paper pen made from recycled paper.', image: '/images/paperpen.png' },
      { id: 3, name: 'Bamboo Bottle', price: 799, currency: 'INR', description: 'Bamboo sleeve bottle.', image: '/images/bottle.png' }
    ];
    await db.write();
  }
}
initDB();

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.get('/api/products', async (req, res) => {
  await db.read();
  res.json(db.data.products);
});

app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  await db.read();
  const p = db.data.products.find(x => x.id === id);
  if(!p) return res.status(404).json({ error: 'Product not found' });
  res.json(p);
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency='INR', receipt='rcpt_'+Date.now(), notes={} } = req.body;
    if(!amount) return res.status(400).json({ error: 'amount required in paise' });
    const order = await razorpay.orders.create({ amount, currency, receipt, payment_capture: 1, notes });
    res.json(order);
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'create order failed', details: err.message });
  }
});

app.post('/api/verify-payment', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret');
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated = hmac.digest('hex');
    res.json({ valid: generated === razorpay_signature });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.listen(PORT, () => {
  console.log(`DrVed backend running on port ${PORT}`);
});
