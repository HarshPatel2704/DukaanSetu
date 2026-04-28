import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const ShopkeeperDashboard = () => {
  const [salesData, setSalesData] = useState({ orders: [], profit: 0 });
  const [activeProducts, setActiveProducts] = useState(0);
  const socketRef = useRef();
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  useEffect(() => {
    fetchSales();
    fetchActiveCount();

    // Initialize socket connection
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored in localStorage

    if (user && user.id) {
      socketRef.current = io('http://localhost:5000');
      
      // Join a room specific to this shopkeeper
      socketRef.current.emit('join', user.id);

      // Listen for new orders
      socketRef.current.on('newOrder', (data) => {
        // Play notification sound
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
        
        // Refresh data
        fetchSales();
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/orders/shopkeeper', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalesData(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchActiveCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/products/shopkeeper', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveProducts(res.data.length);
    } catch (err) { console.error(err); }
  };

  const orders = salesData.orders.slice().reverse();

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
          --shadow-hover: 0 8px 32px rgba(26,15,0,0.11);
        }

        .ds-sk-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem 4rem;
          position: relative;
        }

        .ds-sk-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(232,98,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,98,26,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .ds-sk-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* ── Header ── */
        .ds-sk-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-sk-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700;
          color: var(--deep); letter-spacing: -0.03em;
          margin: 0 0 0.2rem;
        }
        .ds-sk-title span { color: var(--saffron); }
        .ds-sk-subtitle { font-size: 0.85rem; color: var(--muted); margin: 0; }

        .ds-sk-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border-radius: 20px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          box-shadow: 0 4px 14px var(--saffron-glow);
          flex-shrink: 0;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ds-fade { animation: slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        /* ── Stat cards ── */
        .ds-stat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.06s both;
        }
        @media (max-width: 640px) { .ds-stat-grid { grid-template-columns: 1fr; } }

        .ds-stat-card {
          background: var(--card-bg);
          border-radius: 18px;
          padding: 1.75rem 1.5rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          position: relative; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
          text-align: center;
        }
        .ds-stat-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-3px); }

        /* Coloured top bar */
        .ds-stat-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
        }
        .ds-stat-card.saffron::before { background: linear-gradient(90deg, var(--saffron), var(--saffron-light)); }
        .ds-stat-card.green::before   { background: linear-gradient(90deg, #16A34A, #4ADE80); }
        .ds-stat-card.blue::before    { background: linear-gradient(90deg, #2563EB, #60A5FA); }

        /* Decorative background circle */
        .ds-stat-card::after {
          content: ''; position: absolute;
          bottom: -30px; right: -30px;
          width: 110px; height: 110px;
          border-radius: 50%;
          opacity: 0.055;
          pointer-events: none;
        }
        .ds-stat-card.saffron::after { background: var(--saffron); }
        .ds-stat-card.green::after   { background: #16A34A; }
        .ds-stat-card.blue::after    { background: #2563EB; }

        .ds-stat-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.1rem;
        }
        .ds-stat-icon.saffron { background: rgba(232,98,26,0.10); }
        .ds-stat-icon.saffron svg { stroke: var(--saffron); }
        .ds-stat-icon.green   { background: rgba(22,163,74,0.10); }
        .ds-stat-icon.green svg { stroke: #16A34A; }
        .ds-stat-icon.blue    { background: rgba(37,99,235,0.10); }
        .ds-stat-icon.blue svg { stroke: #2563EB; }

        .ds-stat-label {
          font-size: 0.73rem; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.1em; margin-bottom: 0.45rem;
        }
        .ds-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem; font-weight: 700;
          color: var(--deep); line-height: 1;
        }

        /* ── Sales table card ── */
        .ds-card {
          background: var(--card-bg);
          border-radius: 18px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.12s both;
        }
        .ds-card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; justify-content: space-between;
        }
        .ds-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 600;
          color: var(--deep); margin: 0;
        }
        .ds-count-badge {
          display: inline-flex; align-items: center;
          padding: 0.22rem 0.65rem;
          border-radius: 6px;
          font-size: 0.8rem; font-weight: 600;
          background: #F5EDE3; color: var(--muted);
        }

        /* Table */
        .ds-table-wrap { overflow-x: auto; }
        .ds-table { width: 100%; border-collapse: collapse; }
        .ds-table th {
          padding: 0.85rem 1.25rem;
          text-align: left;
          font-size: 0.74rem; font-weight: 600;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
          background: #FDFAF7;
          border-bottom: 1px solid var(--border-soft);
          white-space: nowrap;
        }
        .ds-table td {
          padding: 1rem 1.25rem;
          font-size: 0.9rem; color: var(--deep);
          border-bottom: 1px solid #F5EDE3;
          vertical-align: middle;
        }
        .ds-table tr:last-child td { border-bottom: none; }
        .ds-table tbody tr { transition: background 0.15s; }
        .ds-table tbody tr:hover { background: #FDFAF7; }

        /* Product name with icon dot */
        .ds-product-cell {
          display: flex; align-items: center; gap: 0.7rem;
        }
        .ds-product-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          flex-shrink: 0;
        }

        /* Amount */
        .ds-amount {
          font-family: 'Playfair Display', serif;
          font-weight: 600; color: #16A34A;
          font-size: 0.95rem;
        }

        /* Customer avatar */
        .ds-customer-cell {
          display: flex; align-items: center; gap: 0.6rem;
        }
        .ds-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 0.72rem; font-weight: 700;
          flex-shrink: 0;
        }

        /* Address cell */
        .ds-address {
          font-size: 0.82rem; color: var(--muted);
          max-width: 220px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Empty state */
        .ds-empty {
          padding: 3.5rem 1.5rem;
          text-align: center;
        }
        .ds-empty-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: #F5EDE3;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }
        .ds-empty-icon svg { stroke: var(--muted); opacity: 0.6; }
        .ds-empty-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--deep); margin-bottom: 0.3rem; }
        .ds-empty-sub { font-size: 0.85rem; color: var(--muted); }
      `}</style>

      <div className="ds-sk-root">
        <div className="ds-sk-inner">

          {/* Header */}
          <div className="ds-sk-header">
            <div>
              <h2 className="ds-sk-title">Business <span>Dashboard</span></h2>
              <p className="ds-sk-subtitle">Track your sales, orders & listings at a glance</p>
            </div>
            <div className="ds-sk-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Shopkeeper
            </div>
          </div>

          {/* Stat cards */}
          <div className="ds-stat-grid">
            <div className="ds-stat-card saffron">
              <div className="ds-stat-icon saffron">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <p className="ds-stat-label">Total Profit Earned</p>
              <p className="ds-stat-value">₹{salesData.profit?.toLocaleString()}</p>
            </div>

            <div className="ds-stat-card green">
              <div className="ds-stat-icon green">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="ds-stat-label">Total Orders</p>
              <p className="ds-stat-value">{salesData.orders.length}</p>
            </div>

            <div className="ds-stat-card blue">
              <div className="ds-stat-icon blue">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <p className="ds-stat-label">Active Listings</p>
              <p className="ds-stat-value">{activeProducts}</p>
            </div>
          </div>

          {/* Sales table */}
          <div className="ds-card">
            <div className="ds-card-header">
              <h4 className="ds-card-title">Recent Sales</h4>
              <span className="ds-count-badge">{orders.length} orders</span>
            </div>

            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Customer</th>
                    <th>Delivery Address</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: 0 }}>
                        <div className="ds-empty">
                          <div className="ds-empty-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                              <line x1="3" y1="6" x2="21" y2="6"/>
                              <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                          </div>
                          <p className="ds-empty-title">No sales yet</p>
                          <p className="ds-empty-sub">Your sales will appear here once orders come in.</p>
                        </div>
                      </td>
                    </tr>
                  ) : orders.map(o => (
                    <tr key={o._id}>
                      <td>
                        <div className="ds-product-cell">
                          <span className="ds-product-dot" />
                          <span style={{ fontWeight: 500 }}>
                            {o.products.map(p => p.productId?.name || 'Item').join(', ')}
                          </span>
                        </div>
                      </td>
                      <td><span className="ds-amount">₹{o.totalAmount}</span></td>
                      <td>
                        <div className="ds-customer-cell">
                          <div className="ds-avatar">{o.customerId?.name?.charAt(0).toUpperCase()}</div>
                          <span>{o.customerId?.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="ds-address" title={o.customerId?.address}>
                          {o.customerId?.address || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ShopkeeperDashboard;