import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';

export default function App(){
  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1><Link to="/" style={{textDecoration:'none', color:'#000'}}>Dr. Ved Store</Link></h1>
        <nav>
          <Link to="/cart">Cart</Link>
        </nav>
      </header>
      <main style={{marginTop:20}}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
