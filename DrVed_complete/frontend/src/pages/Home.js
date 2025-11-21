import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Home(){
  const [products, setProducts] = useState([]);
  useEffect(()=> {
    api.get('/api/products').then(r => setProducts(r.data)).catch(e => console.error(e));
  }, []);
  return (
    <div>
      <h2>Products</h2>
      <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
        {products.map(p => (
          <div key={p.id} style={{border:'1px solid #ddd', padding:12, width:240}}>
            <div style={{height:140, background:'#f6f6f6', display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src={p.image || '/images/placeholder.png'} alt={p.name} style={{maxWidth:'100%', maxHeight:120}} />
            </div>
            <h3>{p.name}</h3>
            <p>₹{(p.price/1).toFixed(0)}</p>
            <Link to={'/product/'+p.id}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
