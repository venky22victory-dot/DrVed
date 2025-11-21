import React, {useEffect, useState} from 'react';
import api from '../api';

export default function Cart(){
  const [cart, setCart] = useState([]);
  useEffect(()=> {
    setCart(JSON.parse(localStorage.getItem('dv_cart')||'[]'));
  }, []);
  const total = cart.reduce((s,p)=> s + (p.price||0), 0);
  const handleCheckout = async () => {
    if (!cart.length) return alert('Cart is empty');
    try {
      // create order on backend - amount in paise
      const amountPaise = Math.round(total * 100);
      const resp = await api.post('/api/create-order', { amount: amountPaise, currency: 'INR' });
      const order = resp.data;
      // open Razorpay checkout
      const rzpKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
      if (!rzpKey) return alert('Razorpay key not configured in environment');
      const options = {
        key: rzpKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Dr. Ved Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function (response){
          // verify payment with backend
          try {
            const verify = await api.post('/api/verify-payment', response);
            if (verify.data.valid) {
              alert('Payment verified — thank you!');
              localStorage.removeItem('dv_cart');
              window.location.href = '/';
            } else {
              alert('Payment verification failed.');
            }
          } catch (err) {
            console.error(err);
            alert('Verification error');
          }
        },
        prefill: { name: '', email: '' },
        theme: { color: '#00C47A' }
      };
      // load razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error(err);
      alert('Checkout failed: ' + (err.response?.data?.error || err.message));
    }
  };
  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Cart is empty.</p> : (
        <div>
          <ul>
            {cart.map((p, idx) => <li key={idx}>{p.name} — ₹{p.price}</li>)}
          </ul>
          <p><strong>Total: ₹{total}</strong></p>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
}
