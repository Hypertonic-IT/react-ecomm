import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";

import TrackOrderDrawer from "./modules/website/components/TrackOrder/TrackOrderDrawer";
import ScrollToTop from "./modules/website/components/ScrollToTop";
import SplashScreen from "./modules/website/components/SplashScreen/SplashScreen";

import AdminLayout from "./modules/admin/layouts/AdminLayout";
import Dashboard from "./modules/admin/pages/Dashboard/Dashboard";
import AdminLogin from "./modules/admin/pages/Auth/AdminLogin";
import ProductList from "./modules/admin/pages/Products/ProductList";
import ProductAddEdit from "./modules/admin/pages/Products/ProductAddEdit";
import AdminRoute from "./modules/admin/components/AdminRoute";
import AdminPlaceholder from "./modules/admin/components/AdminPlaceholder";
import CategoryList from "./modules/admin/pages/Categories/CategoryList";
import CategoryAddEdit from "./modules/admin/pages/Categories/CategoryAddEdit";
import OrderList from "./modules/admin/pages/Orders/OrderList";
import OrderDetails from "./modules/admin/pages/Orders/OrderDetails";
import UserList from "./modules/admin/pages/Users/UserList";
import InventoryManagement from "./modules/admin/pages/Inventory/InventoryManagement";
import CouponList from "./modules/admin/pages/Coupons/CouponList";
import CouponAddEdit from "./modules/admin/pages/Coupons/CouponAddEdit";
import ReviewList from "./modules/admin/pages/Reviews/ReviewList";
import ReportsDashboard from "./modules/admin/pages/Reports/ReportsDashboard";
import SalesReports from "./modules/admin/pages/Reports/SalesReports";
import OrderReports from "./modules/admin/pages/Reports/OrderReports";
import ProductReports from "./modules/admin/pages/Reports/ProductReports";

import StaffList from "./modules/admin/pages/Users/StaffList";

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if it's the first visit, it is the home page, and NOT an admin route
    // const hasVisited = sessionStorage.getItem('hasVisited'); // User said first time only.
    // Actually typically splash screens are for the landing experience.
    // If I reload /cart, do I want splash? User said "when user on home page".

    const isHome = window.location.pathname === '/';
    const isAdmin = window.location.pathname.startsWith('/admin');
    const hasVisited = sessionStorage.getItem('hasVisited');

    if (isHome && !isAdmin && !hasVisited) {
      // Show splash
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem('hasVisited', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      // Hide immediately
      setIsLoading(false);
    }
  }, []);

  return (
    <CurrencyProvider>
      <AuthProvider>
        <AdminAuthProvider>
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

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/new" element={<ProductAddEdit />} />
                  <Route path="products/edit/:id" element={<ProductAddEdit />} />

                  <Route path="orders" element={<OrderList />} />
                  <Route path="orders/:id" element={<OrderDetails />} />
                  <Route path="categories" element={<CategoryList />} />
                  <Route path="categories/new" element={<CategoryAddEdit />} />
                  <Route path="categories/edit/:id" element={<CategoryAddEdit />} />
                  <Route path="users" element={<UserList />} />
                  <Route path="staff" element={
                    <AdminRoute requiredRoles={['super_admin']}>
                      <StaffList />
                    </AdminRoute>
                  } />
                  <Route path="inventory" element={<InventoryManagement />} />
                  <Route path="coupons" element={<CouponList />} />
                  <Route path="coupons/new" element={<CouponAddEdit />} />
                  <Route path="coupons/edit/:id" element={<CouponAddEdit />} />
                  <Route path="reviews" element={<ReviewList />} />
                  <Route path="reports" element={<ReportsDashboard />} />
                  <Route path="reports/sales" element={<SalesReports />} />
                  <Route path="reports/orders" element={<OrderReports />} />
                  <Route path="reports/products" element={<ProductReports />} />
                  <Route path="reports/customers" element={<AdminPlaceholder title="Customer Reports" />} />
                  <Route path="reports/inventory" element={<AdminPlaceholder title="Inventory Reports" />} />
                  <Route path="reports/coupons" element={<AdminPlaceholder title="Coupon Reports" />} />
                  <Route path="analytics" element={<Navigate to="reports" replace />} />
                  <Route path="content" element={<AdminPlaceholder title="Content Management (CMS)" />} />
                  <Route path="settings" element={<AdminPlaceholder title="Admin Settings" />} />
                </Route>
              </Routes>
              <TrackOrderDrawer />
            </Router>
          </ShopProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </CurrencyProvider>
  );
}

export default App;
