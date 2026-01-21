import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./modules/website/pages/Home/Home";
import Products from "./modules/website/pages/Products/Products";
import ProductDetail from "./modules/website/pages/ProductDetail/ProductDetail";
import Cart from "./modules/website/pages/Cart/Cart";
import Wishlist from "./modules/website/pages/Wishlist/Wishlist";
import Login from "./modules/website/pages/Auth/Login";
import Signup from "./modules/website/pages/Auth/Signup";
import ForgotPassword from "./modules/website/pages/Auth/ForgotPassword";
import ProtectedRoute from "./modules/website/components/ProtectedRoute";
import AddressPage from "./modules/website/pages/Checkout/AddressPage";
import PaymentPage from "./modules/website/pages/Checkout/PaymentPage";
import OrderSuccessPage from "./modules/website/pages/Checkout/OrderSuccessPage";
import OrdersPage from "./modules/website/pages/Orders/OrdersPage";
import ProfilePage from "./modules/website/pages/Profile/ProfilePage";
import AboutUs from "./modules/website/pages/About/AboutUs";
import ContactUs from "./modules/website/pages/Contact/ContactUs";
import Careers from "./modules/website/pages/Static/Careers";
import PrivacyPolicy from "./modules/website/pages/Static/PrivacyPolicy";
import TermsConditions from "./modules/website/pages/Static/TermsConditions";

import { ShopProvider } from "./context/ShopContext";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";

import TrackOrderDrawer from "./modules/website/components/TrackOrder/TrackOrderDrawer";
import ScrollToTop from "./modules/website/components/ScrollToTop";
import SplashScreen from "./modules/website/components/SplashScreen/SplashScreen";

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading time (e.g., 2.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CurrencyProvider>
      <AuthProvider>
        <ShopProvider>
          <SplashScreen isLoading={isLoading} />
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />

              <Route path="/checkout/address" element={
                <ProtectedRoute>
                  <AddressPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout/payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/order-success/:id" element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
            <TrackOrderDrawer />
          </Router>
        </ShopProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}

export default App;
