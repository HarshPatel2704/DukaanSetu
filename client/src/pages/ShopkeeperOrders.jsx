import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderCard = ({ order, i, updateStatus, updating }) => {
  const isDelivered = order.status === 'delivered';
  return (
    <div
      className={`ds-order-card ${isDelivered ? 'delivered' : 'pending'}`}
      style={{ animation: `slideUp 0.45s cubic-bezier(0.22,1,0.36,1) ${0.06 + i * 0.05}s both` }}
    >
      {/* Order header */}
      <div className="ds-order-header">
        <div className="ds-order-header-left">
          <span className="ds-order-id">
            Order <strong>#{order._id?.slice(-8).toUpperCase()}</strong>
          </span>
          <span className="ds-order-date">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' · '}
            {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className={`ds-status-badge ${isDelivered ? 'delivered' : 'pending'}`}>
            {isDelivered ? '✓ Delivered' : '⏳ Pending'}
          </span>
          <button
            className={`ds-toggle-btn ${isDelivered ? 'to-pending' : 'to-delivered'}`}
            onClick={() => updateStatus(order._id, order.status || 'pending')}
            disabled={updating === order._id}
          >
            {updating === order._id
              ? <span className="ds-btn-spinner" />
              : isDelivered
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            }
            Mark as {isDelivered ? 'Pending' : 'Delivered'}
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="ds-order-body">
        {/* Customer panel */}
        <div className="ds-customer-panel">
          <p className="ds-panel-label">Customer Details</p>
          <div className="ds-customer-row">
            <div className="ds-avatar">{order.customerId?.name?.charAt(0).toUpperCase()}</div>
            <span className="ds-customer-name">{order.customerId?.name}</span>
          </div>
          <div className="ds-address-block">
            <p className="ds-address-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              Delivery Address
            </p>
            <p className="ds-address-text">{order.customerId?.address || 'No address provided'}</p>
          </div>
        </div>

        {/* Products panel */}
        <div className="ds-products-panel">
          <p className="ds-panel-label">Products Ordered</p>
          <div style={{ overflowX: 'auto' }}>
            <table className="ds-inner-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((p, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="ds-item-name">
                        <span className="ds-item-dot" />
                        {p.productId?.name || <em style={{ color: 'var(--muted)', fontWeight: 400 }}>Item Removed</em>}
                      </span>
                    </td>
                    <td><span className="ds-qty-chip">{p.quantity}</span></td>
                    <td>₹{p.price}</td>
                    <td><span className="ds-subtotal">₹{p.price * p.quantity}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="ds-earnings-row">
            <span className="ds-earnings-label">Earnings from this order</span>
            <span className="ds-earnings-val">₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShopkeeperOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders/shopkeeper', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, currentStatus) => {
    setUpdating(orderId);
    console.log(`Updating order ${orderId}. Current status: ${currentStatus}`);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }
      const nextStatus = (currentStatus === 'pending' || !currentStatus) ? 'delivered' : 'pending';
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update response:", res.data);
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err.response?.data || err.message);
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#7A6652' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #EAE0D5', borderTopColor: '#E8621A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: '0.9rem' }}>Loading orders…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const delivered = orders.filter(o => o.status === 'delivered').length;
  const pending = orders.length - delivered;

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
          --shadow-hover: 0 10px 32px rgba(26,15,0,0.11);
        }

        .ds-so-root {
          min-height: 100vh; background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem 4rem;
          position: relative;
        }
        .ds-so-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(232,98,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,98,26,0.03) 1px, transparent 1px);
          background-size: 48px 48px; pointer-events: none; z-index: 0;
        }
        .ds-so-inner { max-width: 1000px; margin: 0 auto; position: relative; z-index: 1; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Header ── */
        .ds-so-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 1.75rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-so-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700;
          color: var(--deep); letter-spacing: -0.03em; margin: 0 0 0.2rem;
        }
        .ds-so-title span { color: var(--saffron); }
        .ds-so-subtitle { font-size: 0.85rem; color: var(--muted); margin: 0; }
        .ds-so-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border-radius: 20px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          box-shadow: 0 4px 14px var(--saffron-glow); flex-shrink: 0;
        }

        /* ── Summary pills ── */
        .ds-summary-row {
          display: flex; gap: 0.85rem; margin-bottom: 1.75rem; flex-wrap: wrap;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both;
        }
        .ds-summary-pill {
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.55rem 1.1rem;
          background: var(--card-bg); border-radius: 30px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          font-size: 0.85rem; font-weight: 500;
        }
        .ds-summary-pill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .ds-summary-pill-val { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1rem; }

        /* ── Order cards ── */
        .ds-order-card {
          background: var(--card-bg); border-radius: 18px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          overflow: hidden; margin-bottom: 1.25rem;
          transition: box-shadow 0.2s;
        }
        .ds-order-card:hover { box-shadow: var(--shadow-hover); }

        /* Status left-edge bar */
        .ds-order-card.delivered { border-left: 3px solid #16A34A; }
        .ds-order-card.pending   { border-left: 3px solid #F59E0B; }

        /* Card header */
        .ds-order-header {
          padding: 1rem 1.4rem;
          background: #FDFAF7; border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .ds-order-header-left { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .ds-order-id { font-size: 0.78rem; color: var(--muted); font-weight: 500; }
        .ds-order-id strong { font-family: monospace; color: var(--deep); font-size: 0.85rem; }
        .ds-order-date { font-size: 0.78rem; color: var(--muted); display: flex; align-items: center; gap: 0.3rem; }

        /* Status badge */
        .ds-status-badge {
          padding: 0.28rem 0.8rem; border-radius: 20px;
          font-size: 0.74rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em;
        }
        .ds-status-badge.delivered { background: rgba(22,163,74,0.1); color: #15803D; border: 1px solid rgba(22,163,74,0.22); }
        .ds-status-badge.pending   { background: rgba(245,158,11,0.1); color: #B45309; border: 1px solid rgba(245,158,11,0.25); }

        /* Toggle button */
        .ds-toggle-btn {
          padding: 0.42rem 1rem; border-radius: 9px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.4rem;
        }
        .ds-toggle-btn.to-delivered {
          border: 1.5px solid rgba(22,163,74,0.35); background: transparent; color: #16A34A;
        }
        .ds-toggle-btn.to-delivered:hover { background: rgba(22,163,74,0.07); border-color: #16A34A; }
        .ds-toggle-btn.to-pending {
          border: 1.5px solid rgba(245,158,11,0.35); background: transparent; color: #B45309;
        }
        .ds-toggle-btn.to-pending:hover { background: rgba(245,158,11,0.07); border-color: #B45309; }
        .ds-toggle-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Spinner inside button */
        .ds-btn-spinner {
          width: 12px; height: 12px; border: 2px solid currentColor;
          border-top-color: transparent; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Card body two-col layout */
        .ds-order-body {
          display: grid; grid-template-columns: 220px 1fr;
          gap: 0; padding: 0;
        }
        @media (max-width: 640px) { .ds-order-body { grid-template-columns: 1fr; } }

        /* Customer panel */
        .ds-customer-panel {
          padding: 1.3rem 1.4rem;
          border-right: 1px solid var(--border-soft);
        }
        @media (max-width: 640px) { .ds-customer-panel { border-right: none; border-bottom: 1px solid var(--border-soft); } }

        .ds-panel-label {
          font-size: 0.7rem; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.9rem;
        }
        .ds-customer-row { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.9rem; }
        .ds-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 0.82rem; font-weight: 700; flex-shrink: 0;
          box-shadow: 0 3px 10px var(--saffron-glow);
        }
        .ds-customer-name { font-weight: 600; font-size: 0.9rem; color: var(--deep); }

        .ds-address-block {
          background: #FDFAF7; border: 1px solid var(--border-soft);
          border-radius: 9px; padding: 0.65rem 0.8rem;
        }
        .ds-address-label { font-size: 0.7rem; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.3rem; }
        .ds-address-text { font-size: 0.83rem; color: var(--deep); line-height: 1.5; }

        /* Products panel */
        .ds-products-panel { padding: 1.3rem 1.4rem; }

        /* Inner table */
        .ds-inner-table { width: 100%; border-collapse: collapse; }
        .ds-inner-table th {
          padding: 0.6rem 0.75rem; text-align: left;
          font-size: 0.7rem; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.08em;
          background: #FDFAF7; border-bottom: 1px solid var(--border-soft);
        }
        .ds-inner-table th:not(:first-child) { text-align: right; }
        .ds-inner-table td {
          padding: 0.7rem 0.75rem; font-size: 0.875rem;
          color: var(--deep); border-bottom: 1px solid #F5EDE3; vertical-align: middle;
        }
        .ds-inner-table td:not(:first-child) { text-align: right; }
        .ds-inner-table tr:last-child td { border-bottom: none; }
        .ds-inner-table tbody tr { transition: background 0.15s; }
        .ds-inner-table tbody tr:hover { background: #FDFAF7; }

        .ds-item-name { display: flex; align-items: center; gap: 0.45rem; }
        .ds-item-dot { width: 6px; height: 6px; border-radius: 50%; background: linear-gradient(135deg, var(--saffron), var(--saffron-light)); flex-shrink: 0; }
        .ds-qty-chip {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 6px;
          background: #F5EDE3; color: var(--muted);
          font-size: 0.78rem; font-weight: 700;
        }
        .ds-subtotal { font-family: 'Playfair Display', serif; font-weight: 600; font-size: 0.9rem; }

        /* Earnings footer */
        .ds-earnings-row {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 0.75rem; padding: 0.85rem 0.75rem 0;
          border-top: 1px solid var(--border-soft); margin-top: 0.25rem;
        }
        .ds-earnings-label { font-size: 0.82rem; font-weight: 600; color: var(--muted); }
        .ds-earnings-val {
          font-family: 'Playfair Display', serif; font-size: 1.15rem; font-weight: 700;
          color: #16A34A;
        }

        /* Empty state */
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
      `}</style>

      <div className="ds-so-root">
        <div className="ds-so-inner">

          {/* Header */}
          <div className="ds-so-header">
            <div>
              <h2 className="ds-so-title">Customer <span>Orders</span></h2>
              <p className="ds-so-subtitle">Manage and fulfil incoming orders from your store</p>
            </div>
            <div className="ds-so-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Orders
            </div>
          </div>

          {/* Summary pills */}
          {orders.length > 0 && (
            <div className="ds-summary-row">
              <div className="ds-summary-pill">
                <span className="ds-summary-pill-dot" style={{ background: 'var(--saffron)' }} />
                <span style={{ color: 'var(--muted)' }}>Total</span>
                <span className="ds-summary-pill-val">{orders.length}</span>
              </div>
              <div className="ds-summary-pill">
                <span className="ds-summary-pill-dot" style={{ background: '#16A34A' }} />
                <span style={{ color: 'var(--muted)' }}>Delivered</span>
                <span className="ds-summary-pill-val" style={{ color: '#16A34A' }}>{delivered}</span>
              </div>
              <div className="ds-summary-pill">
                <span className="ds-summary-pill-dot" style={{ background: '#F59E0B' }} />
                <span style={{ color: 'var(--muted)' }}>Pending</span>
                <span className="ds-summary-pill-val" style={{ color: '#B45309' }}>{pending}</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {orders.length === 0 ? (
            <div className="ds-empty" style={{ animation: 'slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div className="ds-empty-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <p className="ds-empty-title">No orders received yet</p>
              <p className="ds-empty-sub">When customers buy your products, their orders will appear here.</p>
            </div>
          ) : (
            <>
              {/* Pending Orders Section */}
              {orders.filter(o => o.status !== 'delivered').length > 0 && (
                <>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#B45309', margin: '2rem 0 1rem' }}>Pending Orders</h3>
                  {orders.filter(o => o.status !== 'delivered').map((order, i) => (
                    <OrderCard key={order._id} order={order} i={i} updateStatus={updateStatus} updating={updating} />
                  ))}
                </>
              )}

              {/* Delivered Orders Section */}
              {orders.filter(o => o.status === 'delivered').length > 0 && (
                <>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#15803D', margin: '3rem 0 1rem' }}>Delivered Orders</h3>
                  {orders.filter(o => o.status === 'delivered').map((order, i) => (
                    <OrderCard key={order._id} order={order} i={i} updateStatus={updateStatus} updating={updating} />
                  ))}
                </>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default ShopkeeperOrders;