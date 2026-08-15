import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CustomerView = ({ defaultView = 'marketplace', user, handleLogout }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState(defaultView);
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', location: '' });
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ orderId: '', rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { setView(defaultView); }, [defaultView]);
  useEffect(() => { fetchProducts(); fetchOrders(); }, []);
  useEffect(() => { applyFilters(); }, [filters, products]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("https://dukaansetu-backend.onrender.com/api/products")
      
      setProducts(res.data); setFilteredProducts(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get('https://dukaansetu-backend.onrender.com/api/orders/customer', { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const applyFilters = () => {
    let result = products;
    if (filters.search) result = result.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.category) result = result.filter(p => p.category === filters.category);
    if (filters.minPrice) result = result.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.location) result = result.filter(p =>
      (p.shopkeeperId?.address?.toLowerCase().includes(filters.location.toLowerCase())) ||
      (p.shopkeeperId?.name?.toLowerCase().includes(filters.location.toLowerCase()))
    );
    setFilteredProducts(result);
  };

  const showMsg = (text, type = 'success') => {
    setMessage(text); setMsgType(type);
    // Use a clearer notification style
    if (type === 'success') {
      console.log("Success Notification: " + text);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const addToCart = (product) => {
    const available = Number(product.stockQuantity) || 0;
    if (available <= 0) {
      showMsg(`${product.name} is currently out of stock.`, 'error');
      return;
    }

    const existing = cart.find(i => i._id === product._id);
    let newCart;
    if (existing) {
      if (existing.quantity >= available) {
        showMsg(`Only ${available} unit(s) available for ${product.name}.`, 'error');
        return;
      }
      newCart = cart.map(i => i._id === product._id ? { ...i, stockQuantity: available, quantity: i.quantity + 1 } : i);
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    showMsg(`✅ ${product.name} added to cart successfully!`);
  };

  const removeFromCart = (id) => setCart(cart.filter(i => i._id !== id));

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item._id === id) {
        const available = Number(item.stockQuantity) || 1;
        const q = item.quantity + delta;
        if (delta > 0 && item.quantity >= available) {
          showMsg(`Only ${available} unit(s) available for ${item.name}.`, 'error');
          return item;
        }
        return { ...item, quantity: Math.min(Math.max(q, 1), available) };
      }
      return item;
    }));
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { showMsg('Please login to place an order.', 'error'); return; }
      const orderData = {
        products: cart.map(i => ({ productId: i._id, quantity: i.quantity, price: i.price })),
        totalAmount: cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
      };
      await axios.post('https://dukaansetu-backend.onrender.com/api/orders', orderData, { headers: { Authorization: `Bearer ${token}` } });
      showMsg('Order placed successfully! 🎉');
      setCart([]); fetchOrders(); fetchProducts(); setView('orders');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to place order.', 'error');
      fetchProducts();
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://dukaansetu-backend.onrender.com/api/reviews', reviewData, { headers: { Authorization: `Bearer ${token}` } });
      showMsg('Thank you for your feedback!');
      setShowReviewForm(null);
      setReviewData({ orderId: '', rating: 5, comment: '' });
    } catch (err) {
      showMsg('Error submitting review', 'error');
    }
  };

  const categories = [...new Set(products.map(p => p.category || 'General'))];
  const currentReviewOrder = orders.find(o => o._id === showReviewForm);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const StarRow = ({ rating, size = 14 }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= rating ? '#FF6B6B' : 'none'}
          stroke={s <= rating ? '#FF6B6B' : '#D2CCE9'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#4B4870' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #E9E6F4', borderTopColor: '#3E3A9E', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: '0.9rem' }}>Loading marketplace…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        :root {
          --brand-primary: #3E3A9E;
          --brand-dark: #181430;
          --coral: #FF6B6B;
          --bg-light: #FCFBF9;
          --surface: #FFFFFF;
          --text-main: #181430;
          --text-muted: #4B4870;
          --border-color: #E9E6F4;
          --glass-bg: rgba(255, 255, 255, 0.7);
          --glass-border: rgba(255, 255, 255, 0.4);
          --shadow-sm: 0 2px 4px rgba(0,0,0,0.02);
          --shadow-md: 0 10px 25px -5px rgba(0,0,0,0.05);
          --shadow-lg: 0 20px 50px -12px rgba(0,0,0,0.08);
          --transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ds-cv-root {
          min-height: 100vh;
          background: var(--bg-light);
          font-family: 'DM Sans', sans-serif;
          color: var(--text-main);
          padding: 2rem 1rem 5rem;
        }

        .ds-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* --- Header & Tabs --- */
        .ds-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          padding: 0.75rem 1rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-md);
        }

        .ds-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .ds-tab {
          padding: 0.6rem 1.25rem;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .ds-tab:hover {
          background: rgba(0,0,0,0.03);
          color: var(--brand-dark);
        }

        .ds-tab.active {
          background: var(--brand-dark);
          color: white;
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);
        }

        .ds-cart-badge {
          background: var(--brand-primary);
          color: white;
          font-size: 0.7rem;
          padding: 0.1rem 0.4rem;
          border-radius: 6px;
          margin-left: 0.25rem;
        }

        /* --- Filter Section --- */
        .ds-filters {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 0.8fr 0.8fr 44px;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          background: var(--surface);
          padding: 1rem;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
        }

        .ds-filter-input-wrap {
          position: relative;
        }

        .ds-filter-input-wrap svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          opacity: 0.6;
        }

        .ds-input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          font-size: 0.875rem;
          background: var(--bg-light);
          transition: var(--transition);
          outline: none;
        }

        .ds-input:focus {
          border-color: var(--brand-primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(62, 58, 158, 0.12);
        }

        .ds-btn-refresh {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          color: var(--text-muted);
        }

        .ds-btn-refresh:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          background: rgba(62, 58, 158, 0.05);
        }

        /* --- Product Grid & Cards --- */
        .ds-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .ds-card {
          background: var(--surface);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          padding: 1rem;
          transition: var(--transition);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .ds-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: transparent;
        }

        .ds-card-img-wrap {
          width: 100%;
          height: 240px;
          border-radius: 18px;
          overflow: hidden;
          background: #EFEDFB;
          position: relative;
          margin-bottom: 1.25rem;
        }

        .ds-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .ds-card:hover .ds-card-img {
          transform: scale(1.05);
        }

        .ds-card-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          padding: 0.35rem 0.75rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--brand-primary);
          text-transform: uppercase;
        }

        .ds-card-body {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .ds-card-shop {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .ds-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--brand-dark);
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }

        .ds-card-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ds-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px dashed var(--border-color);
        }

        .ds-card-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--coral);
        }

        .ds-btn-add {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--bg-light);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          color: var(--brand-dark);
        }

        .ds-card:hover .ds-btn-add {
          background: var(--brand-primary);
          color: white;
          transform: rotate(90deg);
        }

        /* --- Cart & Tables --- */
        .ds-section-card {
          background: var(--surface);
          border-radius: 24px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }

        .ds-section-header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ds-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .ds-table-wrap {
          overflow-x: auto;
        }

        .ds-table {
          width: 100%;
          border-collapse: collapse;
        }

        .ds-table th {
          background: var(--bg-light);
          padding: 1rem 2rem;
          text-align: left;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-color);
        }

        .ds-table td {
          padding: 1.25rem 2rem;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.95rem;
        }

        .ds-qty-ctrl {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-light);
          padding: 0.25rem;
          border-radius: 10px;
          width: fit-content;
        }

        .ds-qty-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          font-weight: bold;
        }

        .ds-qty-btn:hover {
          background: var(--brand-primary);
          color: white;
        }

        /* --- Animations --- */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .ds-filters { grid-template-columns: 1fr 1fr; }
          .ds-btn-refresh { grid-column: span 2; width: 100%; }
        }

        @media (max-width: 600px) {
          .ds-header { flex-direction: column; gap: 1rem; }
          .ds-filters { grid-template-columns: 1fr; }
          .ds-btn-refresh { grid-column: span 1; }
        }
      `}</style>

      <div className="ds-cv-root">
        <div className="ds-container">

          {/* Toast */}
          {message && (
            <div style={{
              position: 'fixed', top: '2rem', right: '2rem', zIndex: 1000,
              background: msgType === 'success' ? '#10B981' : '#EF4444',
              color: 'white', padding: '1rem 1.5rem', borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: '600',
              animation: 'slideUp 0.3s ease-out'
            }}>
              {message}
            </div>
          )}

          {/* Header
          <header className="ds-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Outfit', margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-dark)' }}>Dukaan<span style={{color: 'var(--brand-primary)'}}>Setu</span></h2>
              <div className="ds-tabs">
                <button className={`ds-tab ${view === 'marketplace' ? 'active' : ''}`} onClick={() => setView('marketplace')}>
                  Marketplace
                </button>
                <button className={`ds-tab ${view === 'cart' ? 'active' : ''}`} onClick={() => setView('cart')}>
                  Cart <span className="ds-cart-badge">{cart.length}</span>
                </button>
                <button className={`ds-tab ${view === 'orders' ? 'active' : ''}`} onClick={() => setView('orders')}>
                  Orders
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.04)', padding: '0.35rem 0.75rem', borderRadius: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
                  <button onClick={handleLogout} style={{ border: 'none', background: 'transparent', color: '#EF4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginLeft: '0.5rem' }}>Logout</button>
                </div>
              ) : (
                <Link to="/login" className="ds-tab active" style={{ textDecoration: 'none' }}>Login</Link>
              )}
            </div>
          </header> */}

          {/* --- Marketplace View --- */}
          {view === 'marketplace' && (
            <>
              <div className="ds-filters">
                <div className="ds-filter-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" className="ds-input" placeholder="Search items..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
                </div>
                <div className="ds-filter-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-3h6m2 5h6"/></svg>
                  <select className="ds-input" style={{ paddingLeft: '2.5rem' }} value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
                    <option value="">Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="ds-filter-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <input type="text" className="ds-input" placeholder="Location..." value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} />
                </div>
                <input type="number" className="ds-input" style={{ paddingLeft: '1rem' }} placeholder="Min ₹" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
                <input type="number" className="ds-input" style={{ paddingLeft: '1rem' }} placeholder="Max ₹" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
                <button className="ds-btn-refresh" onClick={fetchProducts}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6m-7 10a9 9 0 113-7.7L23 10"/></svg></button>
              </div>

              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '32px' }}>
                  <h3>No products found</h3>
                  <p>Try adjusting your search criteria.</p>
                </div>
              ) : (
                <div className="ds-product-grid">
                  {filteredProducts.map((p, i) => (
                    <div key={p._id} className="ds-card" style={{ animation: `slideUp 0.4s ease-out ${i*0.05}s both` }}>
                      <div className="ds-card-img-wrap">
                        <span className="ds-card-badge">{p.category || 'Local'}</span>
                        <img src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop'} alt={p.name} className="ds-card-img" />
                      </div>
                      <div className="ds-card-body">
                        <div className="ds-card-shop">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                          {p.shopkeeperId?.name || 'Local Store'}
                        </div>
                        <h4 className="ds-card-title">{p.name}</h4>
                        <p className="ds-card-desc">{p.description}</p>
                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.78rem', fontWeight: 700, color: Number(p.stockQuantity) > 0 ? (Number(p.stockQuantity) > 5 ? '#10B981' : '#EF4444') : '#6B7280' }}>
                          {Number(p.stockQuantity) > 0 ? `${p.stockQuantity} available` : 'Unavailable'}
                        </p>
                        <div className="ds-card-footer">
                          <span className="ds-card-price">₹{p.price}</span>
                          <button
                            className="ds-btn-add"
                            onClick={() => addToCart(p)}
                            disabled={Number(p.stockQuantity) <= 0}
                            title={Number(p.stockQuantity) > 0 ? `${p.stockQuantity} available` : 'Unavailable'}
                            style={Number(p.stockQuantity) <= 0 ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* --- Cart View --- */}
          {view === 'cart' && (
            <div className="ds-section-card">
              <div className="ds-section-header">
                <h3 className="ds-section-title">Your Cart</h3>
                <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{cart.length} Items</span>
              </div>
              {cart.length === 0 ? (
                <div style={{ padding: '5rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Your cart is empty. Start shopping!</p>
                  <button className="ds-tab active" style={{ margin: '0 auto' }} onClick={() => setView('marketplace')}>Browse Marketplace</button>
                </div>
              ) : (
                <>
                  <div className="ds-table-wrap">
                    <table className="ds-table">
                      <thead>
                        <tr><th>Product</th><th>Price</th><th>Available</th><th>Quantity</th><th>Subtotal</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item._id}>
                            <td style={{ fontWeight: 700 }}>{item.name}</td>
                            <td>₹{item.price}</td>
                            <td>{item.stockQuantity ?? 'N/A'}</td>
                            <td>
                              <div className="ds-qty-ctrl">
                                <button className="ds-qty-btn" onClick={() => updateQuantity(item._id, -1)}>−</button>
                                <span style={{ width: '24px', textAlign: 'center', fontWeight: 700 }}>{item.quantity}</span>
                                <button className="ds-qty-btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                              </div>
                            </td>
                            <td style={{ fontWeight: 800 }}>₹{item.price * item.quantity}</td>
                            <td>
                              <button onClick={() => removeFromCart(item._id)} style={{ border: 'none', background: 'transparent', color: '#EF4444', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="ds-section-header" style={{ justifyContent: 'flex-end', gap: '2rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order Total</p>
                      <h4 style={{ margin: 0, fontSize: '2rem', fontFamily: "'Playfair Display', serif" }}>₹{cartTotal.toLocaleString()}</h4>
                    </div>
                    <button className="ds-tab active" style={{ padding: '1rem 2.5rem' }} onClick={placeOrder}>Checkout Now</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* --- Orders View --- */}
          {view === 'orders' && (
            <div className="ds-container">
              <h3 className="ds-section-title" style={{ marginBottom: '2rem' }}>Order History</h3>
              {orders.length === 0 ? (
                <div style={{ padding: '5rem', textAlign: 'center', background: 'white', borderRadius: '32px' }}>
                  <p>You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order._id} className="ds-section-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID: #{order._id.slice(-8).toUpperCase()}</p>
                          <p style={{ margin: 0, fontWeight: 700 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style={{
                          padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800,
                          background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', textTransform: 'uppercase'
                        }}>
                          {order.status}
                        </div>
                      </div>
                      <div style={{ background: 'var(--bg-light)', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem' }}>
                        {order.products.map((p, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <span>{p.productId?.name || 'Item'} × {p.quantity}</span>
                            <span style={{ fontWeight: 700 }}>₹{p.price * p.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{order.totalAmount.toLocaleString()}</span>
                        <button className="ds-tab" onClick={() => { setShowReviewForm(order._id); setReviewData({...reviewData, orderId: order._id}); }}>Write a Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Review Modal --- */}
      {showReviewForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="ds-section-card" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <h3 className="ds-section-title" style={{ marginBottom: '1.5rem' }}>Share Your Experience</h3>
            <form onSubmit={submitReview}>
               <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewData({...reviewData, rating: s})} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={s <= reviewData.rating ? '#FF6B6B' : 'none'} stroke={s <= reviewData.rating ? '#FF6B6B' : '#D2CCE9'} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </button>
                ))}
              </div>
              <textarea
                className="ds-input"
                style={{ height: '120px', padding: '1rem', marginBottom: '1.5rem' }}
                placeholder="How was the product and delivery?"
                value={reviewData.comment}
                onChange={e => setReviewData({...reviewData, comment: e.target.value})}
                required
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="ds-tab active" style={{ flex: 1 }}>Submit Review</button>
                <button type="button" className="ds-tab" style={{ flex: 1 }} onClick={() => setShowReviewForm(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerView;
