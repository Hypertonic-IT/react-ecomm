import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Home from "./modules/website/pages/Home/Home";
import Products from "./modules/website/pages/Products/Products";
import ProductDetail from "./modules/website/pages/ProductDetail/ProductDetail";
import Cart from "./modules/website/pages/Cart/Cart";
import Wishlist from "./modules/website/pages/Wishlist/Wishlist";


import { ShopProvider } from "./context/ShopContext";
// import "./fonts/taile.ttf"; // Assuming fonts are handled in CSS or index.html for now

function App() {
  return (
    <ShopProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </Router>
    </ShopProvider>
  );
}

export default App;
