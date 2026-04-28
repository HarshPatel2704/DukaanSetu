import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ defaultTab = 'stats' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { setActiveTab(defaultTab); }, [defaultTab]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'stats') fetchStats();
  }, [activeTab]);

  const fetchUsers = async () => {
    try { const res = await axios.get('/api/admin/users', config); setUsers(res.data); } catch (err) { console.error(err); }
  };
  const fetchProducts = async () => {
    try { const res = await axios.get('/api/admin/products', config); setProducts(res.data); } catch (err) { console.error(err); }
  };
  const fetchCategories = async () => {
    try { const res = await axios.get('/api/admin/categories', config); setCategories(res.data); } catch (err) { console.error(err); }
  };
  const fetchStats = async () => {
    try { const res = await axios.get('/api/admin/stats', config); setStats(res.data); } catch (err) { console.error(err); }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) { await axios.delete(`/api/admin/users/${id}`, config); fetchUsers(); }
  };
  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) { await axios.delete(`/api/admin/products/${id}`, config); fetchProducts(); }
  };
  const handleAddCategory = async (e) => {
    e.preventDefault();
    await axios.post('/api/admin/categories', newCategory, config);
    setNewCategory({ name: '', description: '' });
    fetchCategories();
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    await axios.put(`/api/admin/categories/${editingCategory._id}`, editingCategory, config);
    setEditingCategory(null);
    fetchCategories();
  };
  const deleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) { await axios.delete(`/api/admin/categories/${id}`, config); fetchCategories(); }
  };

  const tabs = [
    { id: 'stats', label: 'Overview', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg> },
    { id: 'products', label: 'Products', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
    { id: 'categories', label: 'Categories', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
    { id: 'users', label: 'Users', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  ];

  const roleBadgeStyle = (role) => {
    if (role === 'admin') return { background: 'rgba(232,98,26,0.12)', color: '#E8621A', border: '1px solid rgba(232,98,26,0.3)' };
    if (role === 'shopkeeper') return { background: 'rgba(59,130,246,0.1)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.25)' };
    return { background: 'rgba(122,102,82,0.1)', color: '#7A6652', border: '1px solid rgba(122,102,82,0.2)' };
  };

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
          --border: rgba(232,98,26,0.12);
          --border-soft: #EAE0D5;
          --shadow-card: 0 4px 24px rgba(26,15,0,0.07);
          --shadow-hover: 0 8px 32px rgba(26,15,0,0.11);
        }

        .ds-admin-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem 4rem;
          position: relative;
        }

        .ds-admin-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: linear-gradient(rgba(232,98,26,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(232,98,26,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .ds-admin-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* Header */
        .ds-admin-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-admin-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700;
          color: var(--deep); letter-spacing: -0.03em;
          margin: 0 0 0.2rem;
        }
        .ds-admin-title span { color: var(--saffron); }
        .ds-admin-subtitle { font-size: 0.85rem; color: var(--muted); margin: 0; }

        .ds-admin-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border-radius: 20px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          box-shadow: 0 4px 14px var(--saffron-glow);
        }

        /* Tab bar */
        .ds-tabs {
          display: flex; gap: 0.35rem;
          background: var(--card-bg);
          border-radius: 14px;
          padding: 0.35rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both;
          overflow-x: auto;
        }
        .ds-tab {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 1.1rem;
          border: none; background: transparent;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500;
          color: var(--muted);
          cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .ds-tab svg { opacity: 0.5; transition: opacity 0.2s; }
        .ds-tab:hover { color: var(--deep); background: rgba(232,98,26,0.05); }
        .ds-tab:hover svg { opacity: 0.8; }
        .ds-tab.active {
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white;
          box-shadow: 0 4px 14px var(--saffron-glow);
        }
        .ds-tab.active svg { opacity: 1; stroke: white; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ds-fade { animation: slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        /* Stat cards */
        .ds-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 1.5rem; }
        @media (max-width: 640px) { .ds-stat-grid { grid-template-columns: 1fr; } }

        .ds-stat-card {
          background: var(--card-bg);
          border-radius: 18px;
          padding: 1.6rem 1.5rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          position: relative; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .ds-stat-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }
        .ds-stat-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
        }
        .ds-stat-card.saffron::before { background: linear-gradient(90deg, var(--saffron), var(--saffron-light)); }
        .ds-stat-card.green::before  { background: linear-gradient(90deg, #16A34A, #4ADE80); }
        .ds-stat-card.blue::before   { background: linear-gradient(90deg, #2563EB, #60A5FA); }

        .ds-stat-icon {
          width: 40px; height: 40px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.1rem;
        }
        .ds-stat-icon.saffron { background: rgba(232,98,26,0.1); }
        .ds-stat-icon.saffron svg { stroke: var(--saffron); }
        .ds-stat-icon.green   { background: rgba(22,163,74,0.1); }
        .ds-stat-icon.green svg { stroke: #16A34A; }
        .ds-stat-icon.blue    { background: rgba(37,99,235,0.1); }
        .ds-stat-icon.blue svg { stroke: #2563EB; }

        .ds-stat-label { font-size: 0.78rem; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.4rem; }
        .ds-stat-value { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--deep); line-height: 1; }

        /* Generic card */
        .ds-card {
          background: var(--card-bg);
          border-radius: 18px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          overflow: hidden;
        }
        .ds-card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; justify-content: space-between;
        }
        .ds-card-title-sm {
          font-family: 'Playfair Display', serif;
          font-size: 1.05rem; font-weight: 600;
          color: var(--deep); margin: 0;
        }

        /* Table */
        .ds-table-wrap { overflow-x: auto; }
        .ds-table { width: 100%; border-collapse: collapse; }
        .ds-table th {
          padding: 0.85rem 1.25rem;
          text-align: left;
          font-size: 0.75rem; font-weight: 600;
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

        /* Badges */
        .ds-badge {
          display: inline-flex; align-items: center;
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
          font-size: 0.73rem; font-weight: 600;
          text-transform: capitalize;
        }
        .ds-count-badge {
          display: inline-flex; align-items: center;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-size: 0.8rem; font-weight: 600;
          background: #F5EDE3; color: var(--muted);
        }

        /* Buttons */
        .ds-btn-danger {
          padding: 0.38rem 0.85rem;
          border: 1.5px solid rgba(220,38,38,0.3);
          background: transparent; color: #DC2626;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.3rem;
        }
        .ds-btn-danger:hover { background: rgba(220,38,38,0.07); border-color: #DC2626; }

        .ds-btn-edit {
          padding: 0.38rem 0.85rem;
          border: 1.5px solid var(--border-soft);
          background: transparent; color: var(--muted);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.3rem;
          margin-right: 0.4rem;
        }
        .ds-btn-edit:hover { border-color: var(--saffron); color: var(--saffron); }

        .ds-btn-primary {
          width: 100%; padding: 0.85rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border: none; border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem; font-weight: 600;
          cursor: pointer; transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 14px var(--saffron-glow);
          position: relative; overflow: hidden;
        }
        .ds-btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%); }
        .ds-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(232,98,26,0.3); }

        .ds-btn-link {
          width: 100%; padding: 0.6rem;
          background: none; border: none;
          color: var(--muted); font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; cursor: pointer;
          text-decoration: underline; transition: color 0.2s;
          margin-top: 0.5rem;
        }
        .ds-btn-link:hover { color: var(--saffron); }

        /* Category form card */
        .ds-form-card {
          background: var(--card-bg);
          border-radius: 18px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          position: relative; overflow: hidden;
        }
        .ds-form-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B);
          border-radius: 18px 18px 0 0;
        }

        .ds-form-label { display: block; font-size: 0.78rem; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }

        .ds-input, .ds-textarea-field {
          width: 100%; padding: 0.8rem 1rem;
          border: 1.5px solid var(--border-soft); border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: var(--deep); background: #FDFAF7;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none; box-sizing: border-box;
          margin-bottom: 1rem;
        }
        .ds-textarea-field { resize: none; min-height: 80px; line-height: 1.5; }
        .ds-input::placeholder, .ds-textarea-field::placeholder { color: #C5B8AB; }
        .ds-input:focus, .ds-textarea-field:focus { border-color: var(--saffron); background: #fff; box-shadow: 0 0 0 4px var(--saffron-glow); }

        /* Category grid */
        .ds-cat-grid { display: grid; grid-template-columns: 1fr 1.8fr; gap: 1.5rem; }
        @media (max-width: 768px) { .ds-cat-grid { grid-template-columns: 1fr; } }

        /* Popular products table accent */
        .ds-pop-rank {
          width: 26px; height: 26px; border-radius: 8px;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; font-size: 0.75rem; font-weight: 700;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px var(--saffron-glow);
        }
        .ds-pop-rank.silver { background: linear-gradient(135deg, #9CA3AF, #D1D5DB); box-shadow: none; }
        .ds-pop-rank.bronze { background: linear-gradient(135deg, #B45309, #D97706); box-shadow: none; }

        .ds-price { font-family: 'Playfair Display', serif; font-weight: 600; color: var(--deep); }
      `}</style>

      <div className="ds-admin-root">
        <div className="ds-admin-inner">

          {/* Header */}
          <div className="ds-admin-header">
            <div>
              <h2 className="ds-admin-title">Admin <span>Control Center</span></h2>
              <p className="ds-admin-subtitle">Manage your marketplace from one place</p>
            </div>
            <div className="ds-admin-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin
            </div>
          </div>

          {/* Tabs */}
          <div className="ds-tabs">
            {tabs.map(t => (
              <button key={t.id} className={`ds-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* ── STATS ── */}
          {activeTab === 'stats' && stats && (
            <div className="ds-fade">
              <div className="ds-stat-grid">
                <div className="ds-stat-card saffron">
                  <div className="ds-stat-icon saffron">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <p className="ds-stat-label">Total Sales</p>
                  <p className="ds-stat-value">₹{stats.totalSales?.toLocaleString()}</p>
                </div>
                <div className="ds-stat-card green">
                  <div className="ds-stat-icon green">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </div>
                  <p className="ds-stat-label">Total Orders</p>
                  <p className="ds-stat-value">{stats.totalOrders?.toLocaleString()}</p>
                </div>
                <div className="ds-stat-card blue">
                  <div className="ds-stat-icon blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <p className="ds-stat-label">Active Users</p>
                  <p className="ds-stat-value">{stats.activeUsers?.toLocaleString()}</p>
                </div>
              </div>

              <div className="ds-card">
                <div className="ds-card-header">
                  <h5 className="ds-card-title-sm">Popular Products</h5>
                  <span className="ds-count-badge">{stats.popularProducts?.length} items</span>
                </div>
                <div className="ds-table-wrap">
                  <table className="ds-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Units Sold</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.popularProducts?.map((p, i) => (
                        <tr key={p._id}>
                          <td>
                            <span className={`ds-pop-rank ${i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>{i + 1}</span>
                          </td>
                          <td style={{ fontWeight: 500 }}>{p.productInfo.name}</td>
                          <td><span className="ds-count-badge">{p.count} units</span></td>
                          <td><span className="ds-price">₹{p.productInfo.price}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div className="ds-card ds-fade">
              <div className="ds-card-header">
                <h5 className="ds-card-title-sm">All Products</h5>
                <span className="ds-count-badge">{products.length} total</span>
              </div>
              <div className="ds-table-wrap">
                <table className="ds-table">
                  <thead>
                    <tr><th>Name</th><th>Category</th><th>Price</th><th>Shopkeeper</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td style={{ fontWeight: 500 }}>{p.name}</td>
                        <td>
                          <span className="ds-badge" style={{ background: 'rgba(232,98,26,0.08)', color: 'var(--saffron)', border: '1px solid rgba(232,98,26,0.2)' }}>{p.category}</span>
                        </td>
                        <td><span className="ds-price">₹{p.price}</span></td>
                        <td style={{ color: 'var(--muted)' }}>{p.shopkeeperId?.name}</td>
                        <td>
                          <button className="ds-btn-danger" onClick={() => deleteProduct(p._id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CATEGORIES ── */}
          {activeTab === 'categories' && (
            <div className="ds-cat-grid ds-fade">
              <div>
                <div className="ds-form-card">
                  <h5 className="ds-card-title-sm" style={{ marginBottom: '1.25rem' }}>
                    {editingCategory ? 'Edit Category' : 'Add Category'}
                  </h5>
                  <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
                    <label className="ds-form-label">Category Name</label>
                    <input
                      type="text"
                      className="ds-input"
                      placeholder="e.g. Electronics"
                      value={editingCategory ? editingCategory.name : newCategory.name}
                      onChange={e => editingCategory
                        ? setEditingCategory({ ...editingCategory, name: e.target.value })
                        : setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                    />
                    <label className="ds-form-label">Description</label>
                    <textarea
                      className="ds-textarea-field"
                      placeholder="Short description…"
                      value={editingCategory ? editingCategory.description : newCategory.description}
                      onChange={e => editingCategory
                        ? setEditingCategory({ ...editingCategory, description: e.target.value })
                        : setNewCategory({ ...newCategory, description: e.target.value })}
                    />
                    <button type="submit" className="ds-btn-primary">
                      {editingCategory ? 'Update Category' : 'Add Category →'}
                    </button>
                    {editingCategory && (
                      <button type="button" className="ds-btn-link" onClick={() => setEditingCategory(null)}>Cancel</button>
                    )}
                  </form>
                </div>
              </div>

              <div className="ds-card">
                <div className="ds-card-header">
                  <h5 className="ds-card-title-sm">All Categories</h5>
                  <span className="ds-count-badge">{categories.length} total</span>
                </div>
                <div className="ds-table-wrap">
                  <table className="ds-table">
                    <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                    <tbody>
                      {categories.map(c => (
                        <tr key={c._id}>
                          <td style={{ fontWeight: 600 }}>{c.name}</td>
                          <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{c.description}</td>
                          <td>
                            <button className="ds-btn-edit" onClick={() => setEditingCategory(c)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              Edit
                            </button>
                            <button className="ds-btn-danger" onClick={() => deleteCategory(c._id)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="ds-card ds-fade">
              <div className="ds-card-header">
                <h5 className="ds-card-title-sm">User Management</h5>
                <span className="ds-count-badge">{users.length} accounts</span>
              </div>
              <div className="ds-table-wrap">
                <table className="ds-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--saffron), var(--saffron-light))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                            }}>{u.name?.charAt(0).toUpperCase()}</div>
                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                        <td>
                          <span className="ds-badge" style={roleBadgeStyle(u.role)}>{u.role}</span>
                        </td>
                        <td>
                          {u.role !== 'admin' && (
                            <button className="ds-btn-danger" onClick={() => deleteUser(u._id)}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;