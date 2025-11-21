import React, {useEffect, useState} from 'react';
import api from '../api';

export default function Cart(){
  const [cart, setCart] = useState([]);
  useEffect(()=> setCart(JSON.parse(localStorage.getItem('dv_cart')||'[]')), []);
  const total = cart.reduce((s,p)=> s + (p.price||0), 0);
  const handleCheckout = async ()=>{
    if(!cart.length) return alert('Cart empty');
    try{
      const amountPaise = Math.round(total * 100);
      const resp = await api.post('/api/create-order', { amount: amountPaise, currency: 'INR' });
      const order = resp.data;
      const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if(!rzpKey) return alert('Razorpay key missing');
      const options = {
        key: rzpKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Dr. Ved Store',
        description: 'Order Payment',
        order_id: order.id,
        handler: async function(response){
          try{ const verify = await api.post('/api/verify-payment', response); if(verify.data.valid){ alert('Payment verified — thank you!'); localStorage.removeItem('dv_cart'); window.location.href = '/'; } else alert('Verification failed'); } catch(err){ console.error(err); alert('Verification error'); }
        },
        theme: { color: '#00C47A' }
      };
      const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.onload = ()=>{ const rzp = new window.Razorpay(options); rzp.open(); }; document.body.appendChild(script);
    }catch(err){ console.error(err); alert('Checkout failed: ' + (err.response?.data?.error || err.message)); }
  };
  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? <p>Cart is empty.</p> : (
        <div>
          <ul>{cart.map((p,i) => <li key={i}>{p.name} — ₹{p.price}</li>)}</ul>
          <p><strong>Total: ₹{total}</strong></p>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
}
