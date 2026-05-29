import React from "react";
import { Helmet } from 'react-helmet';
import { useShop } from '../../../../context/ShopContext';
import TopBar from "../../components/TopBar/TopBar";
import Header from "../../components/Header/Header";
import Hero from "../../components/Hero/Hero";
import CategorySlider from "../../components/CategorySlider/CategorySlider";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import PromotionalBanner from "../../components/PromotionalBanner/PromotionalBanner";
import TrustSection from "../../components/TrustSection/TrustSection";
import Newsletter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";

function Home() {
  const { products } = useShop();

  // Filter products for sections

  // 1. Trending Now
  let trendingProducts = products.filter(p => p.isTrending);
  if (trendingProducts.length === 0 && products.length > 0) {
    trendingProducts = products.slice(0, 10);
  }

  // 2. Best Sellers
  let bestSellers = products.filter(p => p.isBestSeller);
  if (bestSellers.length === 0) {
    // Fallback to rating if no manual best sellers
    bestSellers = products.filter(p => p.rating > 4.5);
  }
  if (bestSellers.length === 0 && products.length > 0) {
    // Final fallback
    bestSellers = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
  }

  // 3. New Arrivals
  let newArrivals = products.filter(p => p.isNewArrival);
  if (newArrivals.length === 0 && products.length > 0) {
    // Fallback to latest products
    newArrivals = [...products].reverse().slice(0, 10);
  }

  // 4. Exclusive For You
  let exclusive = products.filter(p => p.isExclusive);
  if (exclusive.length === 0 && products.length > 0) {
    // Fallback to random slice
    exclusive = products.slice(0, 10);
  }

  // 5. Gender-specific Picks (Men's and Women's)
  // Robust category detection: handle string, object, id fields, arrays, and variations like "Men's", "male"
  const extractCategoryTokens = (p) => {
    const tokens = [];
    const push = (v) => { if (v || v === 0) tokens.push(String(v).toLowerCase().trim()); };

    if (p.category) {
      if (typeof p.category === 'string') push(p.category.replace(/['’]/g, ''));
      else if (typeof p.category === 'object') {
        push(p.category.id || p.category._id || p.category.name || p.category.title);
      }
    }
    // Common alternate fields
    if (p.categoryId) push(p.categoryId);
    if (p.gender) push(p.gender);
    if (p.categories && Array.isArray(p.categories)) p.categories.forEach(c => push(c));

    // Normalize tokens: split comma/space if someone stored combined values
    return tokens.flatMap(t => t.split(/[,/\s]+/).map(x => x.replace(/[^a-z0-9]/g, '').trim()).filter(Boolean));
  };

  const isMen = (p) => {
    const toks = extractCategoryTokens(p);
    return toks.some(t => ['men', 'man', 'male'].includes(t) || t.includes('men') || t.includes('male'));
  };
  const isWomen = (p) => {
    const toks = extractCategoryTokens(p);
    return toks.some(t => ['women', 'woman', 'female'].includes(t) || t.includes('women') || t.includes('female'));
  };

  // Build men first, then women excluding already-picked products to avoid duplicates
  const menProducts = products.filter(isMen).slice(0, 10);
  const menIds = new Set(menProducts.map(p => (p.id || p._id).toString()));
  const womenProducts = products.filter(p => isWomen(p) && !menIds.has((p.id || p._id).toString())).slice(0, 10);

  return (
    <>
      <Helmet>
        <title>Kayaroop | Premium Fashion Store</title>
        <meta name="description" content="Shop the latest trends in fashion for Men, Women, and Kids." />
      </Helmet>

      <TopBar />
      <Header />

      <main>
        <Hero />
        <CategorySlider />

    {/* Gender specific picks */}
    {menProducts.length > 0 && <ProductSlider title="Men's Picks" products={menProducts} />}
    {womenProducts.length > 0 && <ProductSlider title="Women's Picks" products={womenProducts} />}
        {/* Added multiple sections for a 'fuller' feel */}
        <ProductSlider title="Trending Now" products={trendingProducts} />
        <ProductSlider title="New Arrivals" products={newArrivals} />

        <PromotionalBanner />

        <ProductSlider title="Best Sellers" products={bestSellers} />
        <ProductSlider title="Exclusive For You" products={exclusive} />

        <TrustSection />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}

export default Home;
