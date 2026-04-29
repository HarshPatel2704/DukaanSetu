import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerView = ({ defaultView = 'marketplace' }) => {
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

  useEffect(() => { setView(defaultView); }, [defaultView]);
  useEffect(() => { fetchProducts(); fetchOrders(); }, []);
  useEffect(() => { applyFilters(); }, [filters, products]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
      setProducts(res.data); setFilteredProducts(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders/customer`, { headers: { Authorization: `Bearer ${token}` } });
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
    const existing = cart.find(i => i._id === product._id);
    let newCart;
    if (existing) {
      newCart = cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
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
      if (item._id === id) { const q = item.quantity + delta; return { ...item, quantity: q > 0 ? q : 1 }; }
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
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, orderData, { headers: { Authorization: `Bearer ${token}` } });
      showMsg('Order placed successfully! 🎉');
      setCart([]); fetchOrders(); setView('orders');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to place order.', 'error');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, reviewData, { headers: { Authorization: `Bearer ${token}` } });
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
          fill={s <= rating ? '#F59E0B' : 'none'}
          stroke={s <= rating ? '#F59E0B' : '#DDD0C4'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#7A6652' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #EAE0D5', borderTopColor: '#E8621A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: '0.9rem' }}>Loading marketplace…</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --saffron: #E8621A;
          --saffron-light: #F7894A;
          --saffron-glow: rgba(232,98,26,0.14);
          --cream: #FDF6ED;
          --deep: #1A0F00;
          --muted: #7A6652;
          --card-bg: #FFFFFF;
          --border-soft: #EAE0D5;
          --shadow-card: 0 4px 24px rgba(26,15,0,0.07);
          --shadow-hover: 0 12px 36px rgba(26,15,0,0.12);
        }

        .ds-cv-root {
          min-height: 100vh; background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding: 2rem 1.5rem 4rem;
          position: relative;
        }
        .ds-cv-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(232,98,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,98,26,0.03) 1px, transparent 1px);
          background-size: 48px 48px; pointer-events: none; z-index: 0;
        }
        .ds-cv-inner { max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Tab bar ── */
        .ds-tabs {
          display: flex; gap: 0.3rem;
          background: var(--card-bg); border-radius: 14px;
          padding: 0.35rem; box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          margin-bottom: 1.75rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
          width: fit-content;
        }
        .ds-tab {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1.15rem; border: none; background: transparent;
          border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500; color: var(--muted);
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .ds-tab svg { opacity: 0.5; transition: opacity 0.2s; }
        .ds-tab:hover { color: var(--deep); background: rgba(232,98,26,0.05); }
        .ds-tab.active {
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; box-shadow: 0 4px 14px var(--saffron-glow);
        }
        .ds-tab.active svg { opacity: 1; stroke: white; }
        .ds-cart-count {
          display: inline-flex; align-items: center; justify-content: center;
          width: 19px; height: 19px; border-radius: 50%;
          background: rgba(255,255,255,0.3); font-size: 0.7rem; font-weight: 700;
        }
        .ds-tab:not(.active) .ds-cart-count { background: rgba(232,98,26,0.12); color: var(--saffron); }

        /* ── Toast message ── */
        .ds-toast {
          position: fixed; top: 5rem; left: 50%; transform: translateX(-50%); z-index: 9999;
          padding: 1rem 2rem; border-radius: 50px;
          font-size: 1rem; font-weight: 600;
          display: flex; align-items: center; gap: 0.8rem;
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
          animation: slideDown 0.4s cubic-bezier(0.23, 1, 0.32, 1) both;
          white-space: nowrap;
        }
        .ds-toast.success { background: #10B981; color: white; border: none; }
        .ds-toast.error   { background: #EF4444; color: white; border: none; }

        @keyframes slideDown {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }

        /* ── Filter bar ── */
        .ds-filter-bar {
          background: var(--card-bg); border-radius: 16px;
          padding: 1.1rem 1.4rem; margin-bottom: 1.75rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.06s both;
        }
        .ds-filter-input-wrap { position: relative; flex: 1; min-width: 140px; }
        .ds-filter-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          stroke: var(--muted); opacity: 0.5; pointer-events: none;
        }
        .ds-filter-input, .ds-filter-select {
          width: 100%; padding: 0.65rem 0.9rem 0.65rem 2.35rem;
          border: 1.5px solid var(--border-soft); border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 0.87rem;
          color: var(--deep); background: #FDFAF7;
          transition: border-color 0.2s, box-shadow 0.2s; outline: none;
          box-sizing: border-box;
        }
        .ds-filter-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%237A6652' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 10px center;
          background-color: #FDFAF7; padding-right: 2rem; -webkit-appearance: none;
        }
        .ds-filter-input::placeholder { color: #C5B8AB; }
        .ds-filter-input:focus, .ds-filter-select:focus {
          border-color: var(--saffron); background: #fff;
          box-shadow: 0 0 0 3px var(--saffron-glow);
        }
        .ds-filter-refresh {
          padding: 0.65rem 0.9rem; border: 1.5px solid var(--border-soft);
          background: #FDFAF7; border-radius: 9px; cursor: pointer;
          color: var(--muted); transition: all 0.2s; flex-shrink: 0;
          display: flex; align-items: center;
        }
        .ds-filter-refresh:hover { border-color: var(--saffron); color: var(--saffron); }
        .ds-results-count { font-size: 0.8rem; color: var(--muted); flex-shrink: 0; white-space: nowrap; }

        /* ── Product grid ── */
        .ds-product-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        @media (max-width: 900px) { .ds-product-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .ds-product-grid { grid-template-columns: 1fr; } }

        .ds-product-card {
          background: var(--card-bg); border-radius: 16px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          overflow: hidden; display: flex; flex-direction: column;
          transition: box-shadow 0.22s, transform 0.22s;
        }
        .ds-product-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-4px); }

        .ds-product-img-wrap { position: relative; height: 192px; overflow: hidden; background: #F5EDE3; }
        .ds-product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .ds-product-card:hover .ds-product-img { transform: scale(1.04); }
        .ds-product-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }

        .ds-cat-pill {
          position: absolute; top: 10px; left: 10px;
          padding: 0.22rem 0.65rem; border-radius: 20px;
          font-size: 0.72rem; font-weight: 600;
          background: rgba(255,255,255,0.92); color: var(--saffron);
          border: 1px solid rgba(232,98,26,0.22);
          backdrop-filter: blur(4px);
        }

        .ds-product-body { padding: 1.1rem 1.2rem 1.3rem; display: flex; flex-direction: column; flex: 1; }
        .ds-product-shop { font-size: 0.78rem; color: var(--muted); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.3rem; }
        .ds-product-name { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; color: var(--deep); margin-bottom: 0.45rem; line-height: 1.3; text-transform: capitalize; }
        .ds-product-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.55; flex: 1; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .ds-product-footer { display: flex; align-items: center; justify-content: space-between; }
        .ds-product-price { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--deep); }

        .ds-btn-cart {
          padding: 0.5rem 1.1rem; border: none;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 0.83rem; font-weight: 600;
          cursor: pointer; transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 3px 10px var(--saffron-glow);
          display: flex; align-items: center; gap: 0.4rem;
        }
        .ds-btn-cart:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(232,98,26,0.3); }
        .ds-btn-cart:active { transform: translateY(0); }

        /* ── Cart view ── */
        .ds-cart-card {
          background: var(--card-bg); border-radius: 18px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft); overflow: hidden;
          animation: slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-cart-header {
          padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; justify-content: space-between;
        }
        .ds-cart-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; color: var(--deep); margin: 0; }

        .ds-table-wrap { overflow-x: auto; }
        .ds-table { width: 100%; border-collapse: collapse; }
        .ds-table th {
          padding: 0.8rem 1.25rem; text-align: left;
          font-size: 0.73rem; font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.08em;
          background: #FDFAF7; border-bottom: 1px solid var(--border-soft); white-space: nowrap;
        }
        .ds-table td {
          padding: 1rem 1.25rem; font-size: 0.9rem; color: var(--deep);
          border-bottom: 1px solid #F5EDE3; vertical-align: middle;
        }
        .ds-table tr:last-child td { border-bottom: none; }
        .ds-table tbody tr { transition: background 0.15s; }
        .ds-table tbody tr:hover { background: #FDFAF7; }

        .ds-qty-ctrl { display: flex; align-items: center; gap: 0; }
        .ds-qty-btn {
          width: 30px; height: 30px; border: 1.5px solid var(--border-soft);
          background: #FDFAF7; color: var(--deep); font-size: 1rem;
          cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center;
        }
        .ds-qty-btn:first-child { border-radius: 7px 0 0 7px; }
        .ds-qty-btn:last-child  { border-radius: 0 7px 7px 0; }
        .ds-qty-btn:hover { border-color: var(--saffron); color: var(--saffron); background: rgba(232,98,26,0.05); }
        .ds-qty-val {
          width: 36px; height: 30px; border-top: 1.5px solid var(--border-soft);
          border-bottom: 1.5px solid var(--border-soft); border-left: none; border-right: none;
          background: white; display: flex; align-items: center; justify-content: center;
          font-size: 0.88rem; font-weight: 600;
        }

        .ds-subtotal { font-family: 'Playfair Display', serif; font-weight: 600; }
        .ds-btn-remove {
          padding: 0.35rem 0.75rem; border: 1.5px solid rgba(220,38,38,0.28);
          background: transparent; color: #DC2626; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .ds-btn-remove:hover { background: rgba(220,38,38,0.06); border-color: #DC2626; }

        .ds-cart-footer {
          padding: 1.5rem; border-top: 1px solid var(--border-soft);
          display: flex; align-items: center; justify-content: flex-end; gap: 1.5rem;
          flex-wrap: wrap;
        }
        .ds-cart-total { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: var(--deep); }
        .ds-btn-order {
          padding: 0.85rem 2.2rem; border: none;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 5px 18px var(--saffron-glow);
          position: relative; overflow: hidden;
        }
        .ds-btn-order::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%); }
        .ds-btn-order:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(232,98,26,0.32); }

        /* ── Orders view ── */
        .ds-orders-wrap { animation: slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .ds-orders-header { margin-bottom: 1.5rem; }
        .ds-orders-title { font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 700; color: var(--deep); margin: 0 0 0.2rem; }
        .ds-orders-sub { font-size: 0.85rem; color: var(--muted); }

        .ds-order-card {
          background: var(--card-bg); border-radius: 16px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          overflow: hidden; margin-bottom: 1.1rem;
        }
        .ds-order-header {
          padding: 1rem 1.4rem; background: #FDFAF7;
          border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;
        }
        .ds-order-id { font-size: 0.78rem; color: var(--muted); font-weight: 500; font-family: monospace; }
        .ds-order-date { font-size: 0.78rem; color: var(--muted); }
        .ds-status-badge {
          padding: 0.25rem 0.75rem; border-radius: 20px;
          font-size: 0.75rem; font-weight: 600; text-transform: capitalize;
          background: rgba(22,163,74,0.1); color: #15803D;
          border: 1px solid rgba(22,163,74,0.2);
        }

        .ds-order-body { padding: 1.2rem 1.4rem; }
        .ds-order-items { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
        .ds-order-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.55rem 0.75rem; background: #FDFAF7; border-radius: 8px;
          border: 1px solid var(--border-soft);
        }
        .ds-order-item-name { font-size: 0.875rem; font-weight: 500; display: flex; align-items: center; gap: 0.4rem; }
        .ds-order-item-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), var(--saffron-light)); flex-shrink: 0; }
        .ds-order-item-price { font-family: 'Playfair Display', serif; font-size: 0.9rem; font-weight: 600; color: var(--deep); }

        .ds-order-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 1rem; border-top: 1px solid var(--border-soft); flex-wrap: wrap; gap: 0.75rem;
        }
        .ds-order-total { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; color: var(--deep); }
        .ds-btn-review {
          padding: 0.5rem 1.1rem; border: 1.5px solid var(--saffron);
          background: transparent; color: var(--saffron);
          border-radius: 9px; font-family: 'DM Sans', sans-serif;
          font-size: 0.83rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem;
        }
        .ds-btn-review:hover { background: rgba(232,98,26,0.07); }

        /* ── Empty states ── */
        .ds-empty {
          padding: 4rem 1.5rem; text-align: center;
          background: var(--card-bg); border-radius: 18px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
        }
        .ds-empty-icon {
          width: 60px; height: 60px; border-radius: 18px; background: #F5EDE3;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;
        }
        .ds-empty-icon svg { stroke: var(--muted); opacity: 0.55; }
        .ds-empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--deep); margin-bottom: 0.35rem; }
        .ds-empty-sub { font-size: 0.85rem; color: var(--muted); }

        /* ── Review modal ── */
        .ds-modal-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(26,15,0,0.55); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; padding: 1.5rem;
          animation: fadeIn 0.2s ease both;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .ds-modal {
          background: var(--card-bg); border-radius: 20px;
          width: 100%; max-width: 460px;
          box-shadow: 0 24px 80px rgba(26,15,0,0.25);
          position: relative; overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-modal::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B);
        }
        .ds-modal-header { padding: 1.5rem 1.6rem 0; }
        .ds-modal-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: var(--deep); margin: 0 0 0.25rem; }
        .ds-modal-sub { font-size: 0.83rem; color: var(--muted); margin: 0; }

        .ds-modal-items {
          margin: 1.1rem 1.6rem 0;
          background: #FDFAF7; border-radius: 10px;
          border: 1px solid var(--border-soft); padding: 0.75rem 1rem;
        }
        .ds-modal-items-label { font-size: 0.72rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }
        .ds-modal-item { font-size: 0.875rem; font-weight: 500; color: var(--deep); padding: 0.3rem 0; border-bottom: 1px solid #F0E8DF; display: flex; align-items: center; gap: 0.4rem; }
        .ds-modal-item:last-child { border-bottom: none; }

        .ds-modal-body { padding: 1.25rem 1.6rem 1.6rem; }
        .ds-modal-label { display: block; font-size: 0.75rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.45rem; }

        /* Star rating selector */
        .ds-star-selector { display: flex; gap: 0.35rem; margin-bottom: 1.2rem; }
        .ds-star-btn {
          background: none; border: none; cursor: pointer; padding: 2px;
          transition: transform 0.15s;
        }
        .ds-star-btn:hover { transform: scale(1.2); }
        .ds-star-btn svg { width: 28px; height: 28px; }

        .ds-modal-textarea {
          width: 100%; padding: 0.8rem 1rem; border: 1.5px solid var(--border-soft);
          border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: var(--deep); background: #FDFAF7; outline: none; resize: none;
          min-height: 90px; line-height: 1.55; box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 1.1rem;
        }
        .ds-modal-textarea::placeholder { color: #C5B8AB; }
        .ds-modal-textarea:focus { border-color: var(--saffron); background: #fff; box-shadow: 0 0 0 4px var(--saffron-glow); }

        .ds-modal-actions { display: flex; gap: 0.75rem; }
        .ds-btn-submit {
          flex: 1; padding: 0.9rem; border: none;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border-radius: 11px; font-family: 'DM Sans', sans-serif;
          font-size: 0.93rem; font-weight: 600; cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 14px var(--saffron-glow); position: relative; overflow: hidden;
        }
        .ds-btn-submit::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%); }
        .ds-btn-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(232,98,26,0.3); }

        .ds-btn-cancel {
          flex: 1; padding: 0.9rem; border: 1.5px solid var(--border-soft);
          background: #FDFAF7; color: var(--muted); border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.93rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .ds-btn-cancel:hover { border-color: var(--muted); color: var(--deep); }
      `}</style>

      <div className="ds-cv-root">
        <div className="ds-cv-inner">

          {/* Toast */}
          {message && (
            <div className={`ds-toast ${msgType}`}>
              {msgType === 'success'
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
              {message}
            </div>
          )}

          {/* Tabs */}
          <div className="ds-tabs">
            <button className={`ds-tab ${view === 'marketplace' ? 'active' : ''}`} onClick={() => setView('marketplace')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Marketplace
            </button>
            <button className={`ds-tab ${view === 'cart' ? 'active' : ''}`} onClick={() => setView('cart')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Cart
              <span className="ds-cart-count">{cart.length}</span>
            </button>
            <button className={`ds-tab ${view === 'orders' ? 'active' : ''}`} onClick={() => setView('orders')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              My Orders
            </button>
          </div>

          {/* ── MARKETPLACE ── */}
          {view === 'marketplace' && (
            <>
              <div className="ds-filter-bar">
                <div className="ds-filter-input-wrap" style={{ minWidth: 180 }}>
                  <svg className="ds-filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" className="ds-filter-input" placeholder="Search products…" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
                </div>
                <div className="ds-filter-input-wrap" style={{ minWidth: 140 }}>
                  <svg className="ds-filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/></svg>
                  <select className="ds-filter-select" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="ds-filter-input-wrap" style={{ minWidth: 130 }}>
                  <svg className="ds-filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <input type="text" className="ds-filter-input" placeholder="Shop / Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
                </div>
                <div className="ds-filter-input-wrap" style={{ minWidth: 110 }}>
                  <svg className="ds-filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <input type="number" className="ds-filter-input" placeholder="Min ₹" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
                </div>
                <div className="ds-filter-input-wrap" style={{ minWidth: 110 }}>
                  <svg className="ds-filter-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <input type="number" className="ds-filter-input" placeholder="Max ₹" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
                </div>
                <button className="ds-filter-refresh" onClick={fetchProducts} title="Refresh">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                </button>
                <span className="ds-results-count">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="ds-empty">
                  <div className="ds-empty-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  </div>
                  <p className="ds-empty-title">No products found</p>
                  <p className="ds-empty-sub">Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <div className="ds-product-grid">
                  {filteredProducts.map((product, i) => (
                    <div key={product._id} className="ds-product-card" style={{ animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.04 + i * 0.03}s both` }}>
                      <div className="ds-product-img-wrap">
                        {product.image
                          ? <img src={product.image} alt={product.name} className="ds-product-img" onError={e => e.target.style.display = 'none'} />
                          : <div className="ds-product-img-placeholder">
                              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C5B8AB" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            </div>
                        }
                        <span className="ds-cat-pill">{product.category || 'General'}</span>
                      </div>
                      <div className="ds-product-body">
                        <p className="ds-product-shop">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                          {product.shopkeeperId?.name || 'Store'}
                        </p>
                        <h5 className="ds-product-name">{product.name}</h5>
                        <p className="ds-product-desc">{product.description}</p>
                        <div className="ds-product-footer">
                          <span className="ds-product-price">₹{product.price}</span>
                          <button className="ds-btn-cart" onClick={() => addToCart(product)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── CART ── */}
          {view === 'cart' && (
            <div className="ds-cart-card">
              <div className="ds-cart-header">
                <h3 className="ds-cart-title">Shopping Cart</h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
              </div>

              {cart.length === 0 ? (
                <div className="ds-empty" style={{ borderRadius: 0, boxShadow: 'none', border: 'none' }}>
                  <div className="ds-empty-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  </div>
                  <p className="ds-empty-title">Your cart is empty</p>
                  <p className="ds-empty-sub">Head to the marketplace and add some products!</p>
                </div>
              ) : (
                <>
                  <div className="ds-table-wrap">
                    <table className="ds-table">
                      <thead>
                        <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th>Action</th></tr>
                      </thead>
                      <tbody>
                        {cart.map(item => (
                          <tr key={item._id}>
                            <td style={{ fontWeight: 500 }}>{item.name}</td>
                            <td>₹{item.price}</td>
                            <td>
                              <div className="ds-qty-ctrl">
                                <button className="ds-qty-btn" onClick={() => updateQuantity(item._id, -1)}>−</button>
                                <span className="ds-qty-val">{item.quantity}</span>
                                <button className="ds-qty-btn" onClick={() => updateQuantity(item._id, 1)}>+</button>
                              </div>
                            </td>
                            <td><span className="ds-subtotal">₹{item.price * item.quantity}</span></td>
                            <td>
                              <button className="ds-btn-remove" onClick={() => removeFromCart(item._id)}>Remove</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="ds-cart-footer">
                    <span className="ds-cart-total">Total: ₹{cartTotal.toLocaleString()}</span>
                    <button className="ds-btn-order" onClick={placeOrder}>
                      Place Order →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── ORDERS ── */}
          {view === 'orders' && (
            <div className="ds-orders-wrap">
              <div className="ds-orders-header">
                <h3 className="ds-orders-title">Order History</h3>
                <p className="ds-orders-sub">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
              </div>

              {orders.length === 0 ? (
                <div className="ds-empty">
                  <div className="ds-empty-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <p className="ds-empty-title">No orders yet</p>
                  <p className="ds-empty-sub">Your order history will appear here once you place an order.</p>
                </div>
              ) : orders.map((order, i) => (
                <div key={order._id} className="ds-order-card" style={{ animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.04 + i * 0.04}s both` }}>
                  <div className="ds-order-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <span className="ds-order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                      <span className="ds-order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span className="ds-status-badge">{order.status}</span>
                  </div>
                  <div className="ds-order-body">
                    <div className="ds-order-items">
                      {order.products.map((p, idx) => (
                        <div key={idx} className="ds-order-item">
                          <span className="ds-order-item-name">
                            <span className="ds-order-item-dot" />
                            {p.productId?.name || 'Item Removed'}
                            <span style={{ color: 'var(--muted)', fontWeight: 400 }}>× {p.quantity}</span>
                          </span>
                          <span className="ds-order-item-price">₹{p.price * p.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="ds-order-footer">
                      <span className="ds-order-total">Total: ₹{order.totalAmount?.toLocaleString()}</span>
                      <button className="ds-btn-review" onClick={() => { setShowReviewForm(order._id); setReviewData({ ...reviewData, orderId: order._id }); }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        Review Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Review Modal ── */}
      {showReviewForm && (
        <div className="ds-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowReviewForm(null); }}>
          <div className="ds-modal">
            <div className="ds-modal-header">
              <h5 className="ds-modal-title">Rate Your Experience</h5>
              <p className="ds-modal-sub">How was your order overall?</p>
            </div>

            {currentReviewOrder?.products?.length > 0 && (
              <div className="ds-modal-items">
                <p className="ds-modal-items-label">Items in this order</p>
                {currentReviewOrder.products.map((p, idx) => (
                  <div key={idx} className="ds-modal-item">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--saffron-light))', flexShrink: 0, display: 'inline-block' }} />
                    {p.productId?.name || 'Item'}
                  </div>
                ))}
              </div>
            )}

            <div className="ds-modal-body">
              <form onSubmit={submitReview}>
                <label className="ds-modal-label">Your Rating</label>
                <div className="ds-star-selector">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button" className="ds-star-btn" onClick={() => setReviewData({ ...reviewData, rating: s })}>
                      <svg viewBox="0 0 24 24"
                        fill={s <= reviewData.rating ? '#F59E0B' : 'none'}
                        stroke={s <= reviewData.rating ? '#F59E0B' : '#DDD0C4'}
                        strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                  ))}
                  <span style={{ fontSize: '0.82rem', color: 'var(--muted)', marginLeft: '0.5rem', alignSelf: 'center' }}>
                    {['', 'Very Poor', 'Poor', 'Average', 'Good', 'Excellent'][reviewData.rating]}
                  </span>
                </div>

                <label className="ds-modal-label">Your Feedback</label>
                <textarea
                  className="ds-modal-textarea"
                  placeholder="Share your experience with this order…"
                  value={reviewData.comment}
                  onChange={e => setReviewData({ ...reviewData, comment: e.target.value })}
                  required
                />

                <div className="ds-modal-actions">
                  <button type="submit" className="ds-btn-submit">Submit Review →</button>
                  <button type="button" className="ds-btn-cancel" onClick={() => setShowReviewForm(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerView;
