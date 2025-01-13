import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout/layout';
import axios from 'axios';

import { BASE_URL } from './Components/Urls/Urls';
import Search  from './Components/View-Products/Search'; 
// Lazy load components
import ProductList from './Components/View-Products/View-products';

const Login = React.lazy(() => import('./Components/Login/Login'));
const Signup = React.lazy(() => import('./Components/Signup/Signup'));
const Logout = React.lazy(() => import('./Components/Login/Logout'));
const Cart = React.lazy(() => import('./Components/Cart/Cart'));
const OrderList = React.lazy(() => import('./Components/Orders/Orders'));
const PlaceOrder = React.lazy(() => import('./Components/Orders/PlaceOrders'));
const OrderSuccess = React.lazy(() => import('./Components/Orders/Order-Success'));
const OrderPage = React.lazy(() => import('./Components/Orders/Ordered-products'));
const Wishlist = React.lazy(() => import('./Components/Wishlist/Wishlist'));
const ReturnOrder = React.lazy(() => import('./Components/Orders/ReturnOrder'));
const ProfilePage = React.lazy(() => import('./Components/Profile/Profile'));
const Category = React.lazy(() => import('./Components/Category/Category'));
const ProductDisplay = React.lazy(() => import('./Components/View-Products/Products'));
const Slider = React.lazy(() => import('./Components/View-Products/Slider'));
const HelpCenter = React.lazy(() => import('./Components/HelpCenter/HelpCenter'));

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
        setCartCount(response.data.cartCount);
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const ProtectedRoute = ({ component: Component }) => {
    return user ? <Component setCartCount={setCartCount}/> : <Login setUser={setUser} setCartCount={setCartCount} />;
  };

  if (loading) {
    return (
      <div className="row">
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="loading-spinner">
            <div className="spinner-segment"></div>
            <div className="spinner-segment"></div>
            <div className="spinner-segment"></div>
          </div>
          <p>Loading, please wait...</p>
        </div>
      </div>

    );
  }


  return (
    <div className={`${darkMode ? 'dark' : 'light'}`}>
      <Router>
        <Layout user={user} cartCount={cartCount} darkMode={darkMode} setDarkMode={setDarkMode} />
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<ProductList setCartCount={setCartCount} />} />
            <Route path="/login" element={<Login setCartCount={setCartCount} setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} setCartCount={setCartCount} />} />
            <Route path="/logout" element={<Logout setUser={setUser} setCartCount={setCartCount} />} />
            <Route path="/cart" element={<Cart setCartCount={setCartCount} />} />
            <Route path="/orders" element={<ProtectedRoute component={OrderList} />} />
            <Route path="/place-order" element={user? <PlaceOrder setCartCount={setCartCount} setSuccess={setSuccess}/> : <Login setUser={setUser} setCartCount={setCartCount} />} />
            <Route path="/order-success" element={success ? <OrderSuccess /> : <ProductList setCartCount={setCartCount} />} />
            <Route path="/view-orders-products/:Id" element={<ProtectedRoute component={OrderPage} />} />
            <Route path="/wishlist" element={<ProtectedRoute component={Wishlist} />} />
            <Route path="/category/:thing" element={<Category />} />
            <Route path="/return" element={<ProtectedRoute component={ReturnOrder} />} />
            <Route path="/profile" element={user? <ProfilePage user={user}/> : <Login setUser={setUser} setCartCount={setCartCount} /> } />
            <Route path="/search" element={<Search user={user} darkMode={darkMode} cartCount={cartCount} setDarkMode={setDarkMode} />} />
              <Route path="/product/:id" element={<ProductDisplay setCartCount={setCartCount}/>} />
              <Route path="/slider" element={<Slider />} />
              <Route path="/help-center" element={<ProtectedRoute component={HelpCenter} />} />
            </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
