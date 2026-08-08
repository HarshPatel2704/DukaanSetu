import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerView from './pages/CustomerView';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import ProductManagement from './pages/ProductManagement';
import FeedbackMonitoring from './pages/FeedbackMonitoring';
import AdminDashboard from './pages/AdminDashboard';
import EditProduct from './pages/EditProduct';
import ShopkeeperOrders from './pages/ShopkeeperOrders';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isRole = (role) => user && user.role === role;

  return (
    <Router>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup handleLogin={handleLogin} />} />
        
        {/* Customer Routes */}
        <Route path="/customer" element={isRole('customer') ? <div className="container mt-4"><CustomerView defaultView="marketplace" /></div> : <Navigate to="/login" />} />
        <Route path="/cart" element={isRole('customer') ? <div className="container mt-4  "><CustomerView defaultView="cart" /></div> : <Navigate to="/login" />} />
        <Route path="/orders" element={isRole('customer') ? <div className="container mt-4"><CustomerView defaultView="orders" /></div> : <Navigate to="/login" />} />
        
        {/* Shopkeeper Routes */}
        <Route path="/shopkeeper" element={isRole('shopkeeper') ? <div className="container mt-4"><ShopkeeperDashboard /></div> : <Navigate to="/login" />} />
        <Route path="/shopkeeper-orders" element={isRole('shopkeeper') ? <div className="container mt-4"><ShopkeeperOrders /></div> : <Navigate to="/login" />} />
        <Route path="/product-management" element={isRole('shopkeeper') ? <div className="container mt-4"><ProductManagement /></div> : <Navigate to="/login" />} />
        <Route path="/feedback" element={isRole('shopkeeper') ? <div className="container mt-4"><FeedbackMonitoring /></div> : <Navigate to="/login" />} />
        <Route path="/edit-product/:id" element={isRole('shopkeeper') ? <div className="container mt-4"><EditProduct /></div> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={isRole('admin') ? <div className="container mt-4"><AdminDashboard defaultTab="stats" /></div> : <Navigate to="/login" />} />
        <Route path="/admin-products" element={isRole('admin') ? <div className="container mt-4"><AdminDashboard defaultTab="products" /></div> : <Navigate to="/login" />} />
        <Route path="/admin-categories" element={isRole('admin') ? <div className="container mt-4"><AdminDashboard defaultTab="categories" /></div> : <Navigate to="/login" />} />
        <Route path="/admin-users" element={isRole('admin') ? <div className="container mt-4"><AdminDashboard defaultTab="users" /></div> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
