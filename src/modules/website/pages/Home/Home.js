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
  // Filter products for sections and duplicate to ensure we have enough items to scroll
  const trendingProducts = products.filter(p => p.isTrending);
  const bestSellers = products.filter(p => p.rating > 4.5);

  return (
    <>
      <Helmet>
        <title>Hypertonic | Premium Fashion Store</title>
        <meta name="description" content="Shop the latest trends in fashion for Men, Women, and Kids." />
      </Helmet>

      <TopBar />
      <Header />

      <main>
        <Hero />
        <CategorySlider />
        <ProductSlider title="Trending Now" products={trendingProducts} />
        <PromotionalBanner />
        <ProductSlider title="Best Sellers" products={bestSellers} />
        <TrustSection />
        <Newsletter />
      </main>

      <Footer />
    </>
  );
}

export default Home;
