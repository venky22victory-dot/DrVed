import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Product(){
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  useEffect(()=>{
    api.get('/api/products/' + id).then(r => setProduct(r.data)).catch(e => console.error(e));
  }, [id]);
  if (!product) return <div>Loading...</div>;
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('dv_cart')||'[]');
    cart.push(product);
    localStorage.setItem('dv_cart', JSON.stringify(cart));
    navigate('/cart');
  };
  return (
    <div style={{display:'flex', gap:20}}>
      <div style={{width:300, height:300, background:'#f6f6f6', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <img src={product.image || '/images/placeholder.png'} alt={product.name} style={{maxWidth:'100%', maxHeight:280}} />
      </div>
      <div>
        <h2>{product.name}</h2>
        <p>₹{product.price}</p>
        <p>{product.description}</p>
        <button onClick={addToCart}>Add to cart</button>
      </div>
    </div>
  );
}
