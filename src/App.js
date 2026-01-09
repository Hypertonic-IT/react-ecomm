import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';
import Home from "./modules/website/pages/Home/Home";
import Products from "./modules/website/pages/Products/Products";
import ProductDetail from "./modules/website/pages/ProductDetail/ProductDetail";


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
        </Routes>
      </Router>
    </ShopProvider>
  );
}

export default App;
