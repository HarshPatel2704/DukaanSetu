import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '', category: 'General' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/shopkeeper`, { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/categories`);
      setCategories(res.data);
    } catch (err) { console.error(err); }
  };

  const onAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`, newProduct, { headers: { Authorization: `Bearer ${token}` } });
      setMessage('Product added successfully!');
      setNewProduct({ name: '', price: '', description: '', image: '', category: 'General' });
      fetchProducts();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) { console.error(err); }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchProducts();
      } catch (err) { console.error(err); }
    }
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
          --border-soft: #EAE0D5;
          --shadow-card: 0 4px 24px rgba(26,15,0,0.07);
          --shadow-hover: 0 8px 32px rgba(26,15,0,0.11);
        }

        .ds-pm-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem 4rem;
          position: relative;
        }
        .ds-pm-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(232,98,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,98,26,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .ds-pm-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        /* Header */
        .ds-pm-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-pm-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700;
          color: var(--deep); letter-spacing: -0.03em; margin: 0 0 0.2rem;
        }
        .ds-pm-title span { color: var(--saffron); }
        .ds-pm-subtitle { font-size: 0.85rem; color: var(--muted); margin: 0; }
        .ds-pm-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border-radius: 20px;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          box-shadow: 0 4px 14px var(--saffron-glow); flex-shrink: 0;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Layout grid */
        .ds-pm-grid {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 860px) { .ds-pm-grid { grid-template-columns: 1fr; } }

        /* Form card */
        .ds-form-card {
          background: var(--card-bg);
          border-radius: 18px;
          padding: 1.75rem 1.6rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          position: relative; overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.05s both;
        }
        .ds-form-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B);
          border-radius: 18px 18px 0 0;
        }
        .ds-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 600;
          color: var(--deep); margin: 0 0 1.35rem;
        }

        /* Success message */
        .ds-success {
          background: rgba(22,163,74,0.08);
          border: 1px solid rgba(22,163,74,0.25);
          border-radius: 10px;
          padding: 0.65rem 1rem;
          color: #15803D;
          font-size: 0.83rem; font-weight: 500;
          margin-bottom: 1.2rem;
          display: flex; align-items: center; gap: 0.5rem;
          animation: slideUp 0.3s ease both;
        }

        /* Form fields */
        .ds-field { margin-bottom: 1.1rem; }
        .ds-label {
          display: block; font-size: 0.75rem; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 0.45rem;
        }
        .ds-input-wrap { position: relative; }
        .ds-input-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); opacity: 0.5; pointer-events: none;
          display: flex;
        }
        .ds-textarea-icon { top: 13px; transform: none; }

        .ds-input, .ds-textarea-f, .ds-select {
          width: 100%; padding: 0.78rem 0.95rem 0.78rem 2.55rem;
          border: 1.5px solid var(--border-soft); border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          color: var(--deep); background: #FDFAF7;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none; box-sizing: border-box;
        }
        .ds-textarea-f { resize: none; min-height: 88px; line-height: 1.55; }
        .ds-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A6652' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          background-color: #FDFAF7; padding-right: 2.2rem;
          -webkit-appearance: none;
        }
        .ds-input::placeholder, .ds-textarea-f::placeholder { color: #C5B8AB; }
        .ds-input:focus, .ds-textarea-f:focus, .ds-select:focus {
          border-color: var(--saffron); background: #fff;
          box-shadow: 0 0 0 4px var(--saffron-glow);
        }

        /* Image preview strip */
        .ds-img-preview {
          margin-top: 0.5rem;
          border-radius: 8px; overflow: hidden;
          border: 1.5px dashed var(--border-soft);
          height: 80px; display: flex; align-items: center; justify-content: center;
          background: #FDFAF7;
          transition: border-color 0.2s;
        }
        .ds-img-preview img { width: 100%; height: 100%; object-fit: cover; }
        .ds-img-preview-empty {
          display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
          color: #C5B8AB; font-size: 0.75rem;
        }

        /* Add button */
        .ds-btn-primary {
          width: 100%; padding: 0.9rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border: none; border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.93rem; font-weight: 600;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 14px var(--saffron-glow);
          margin-top: 0.35rem;
        }
        .ds-btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%); }
        .ds-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 22px rgba(232,98,26,0.3); }

        /* Inventory card */
        .ds-inv-card {
          background: var(--card-bg);
          border-radius: 18px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both;
        }
        .ds-inv-header {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; justify-content: space-between;
        }
        .ds-inv-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-weight: 600; color: var(--deep); margin: 0;
        }
        .ds-count-badge {
          display: inline-flex; align-items: center;
          padding: 0.22rem 0.65rem; border-radius: 6px;
          font-size: 0.8rem; font-weight: 600;
          background: #F5EDE3; color: var(--muted);
        }

        /* Table */
        .ds-table-wrap { overflow-x: auto; }
        .ds-table { width: 100%; border-collapse: collapse; }
        .ds-table th {
          padding: 0.8rem 1.2rem;
          text-align: left; font-size: 0.73rem; font-weight: 600;
          color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
          background: #FDFAF7; border-bottom: 1px solid var(--border-soft);
          white-space: nowrap;
        }
        .ds-table td {
          padding: 0.9rem 1.2rem;
          font-size: 0.9rem; color: var(--deep);
          border-bottom: 1px solid #F5EDE3; vertical-align: middle;
        }
        .ds-table tr:last-child td { border-bottom: none; }
        .ds-table tbody tr { transition: background 0.15s; }
        .ds-table tbody tr:hover { background: #FDFAF7; }

        /* Product image in table */
        .ds-prod-img {
          width: 42px; height: 42px; border-radius: 10px;
          object-fit: cover;
          border: 1.5px solid var(--border-soft);
          background: #F5EDE3;
        }
        .ds-prod-img-placeholder {
          width: 42px; height: 42px; border-radius: 10px;
          background: #F5EDE3; border: 1.5px solid var(--border-soft);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Product name cell */
        .ds-prod-cell { display: flex; align-items: center; gap: 0.75rem; }
        .ds-prod-name { font-weight: 500; display: block; }
        .ds-prod-desc {
          font-size: 0.78rem; color: var(--muted);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 180px; display: block;
        }

        .ds-price { font-family: 'Playfair Display', serif; font-weight: 600; color: var(--deep); }

        /* Category badge */
        .ds-cat-badge {
          display: inline-flex; align-items: center;
          padding: 0.22rem 0.65rem; border-radius: 20px;
          font-size: 0.73rem; font-weight: 600;
          background: rgba(232,98,26,0.08);
          color: var(--saffron);
          border: 1px solid rgba(232,98,26,0.2);
        }

        /* Action buttons */
        .ds-btn-edit {
          padding: 0.36rem 0.8rem;
          border: 1.5px solid var(--border-soft);
          background: transparent; color: var(--muted);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.3rem;
          margin-right: 0.4rem;
        }
        .ds-btn-edit:hover { border-color: var(--saffron); color: var(--saffron); }

        .ds-btn-danger {
          padding: 0.36rem 0.8rem;
          border: 1.5px solid rgba(220,38,38,0.28);
          background: transparent; color: #DC2626;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.3rem;
        }
        .ds-btn-danger:hover { background: rgba(220,38,38,0.06); border-color: #DC2626; }

        /* Empty state */
        .ds-empty {
          padding: 3.5rem 1.5rem; text-align: center;
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

      <div className="ds-pm-root">
        <div className="ds-pm-inner">

          {/* Header */}
          <div className="ds-pm-header">
            <div>
              <h2 className="ds-pm-title">Product <span>Management</span></h2>
              <p className="ds-pm-subtitle">Add, update, and manage your store inventory</p>
            </div>
            <div className="ds-pm-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Inventory
            </div>
          </div>

          <div className="ds-pm-grid">

            {/* ── Add Product Form ── */}
            <div className="ds-form-card">
              <h4 className="ds-form-title">Add New Product</h4>

              {message && (
                <div className="ds-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {message}
                </div>
              )}

              <form onSubmit={onAddProduct}>
                <div className="ds-field">
                  <label className="ds-label">Product Name</label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                    </span>
                    <input type="text" className="ds-input" placeholder="e.g. Handmade Kurta" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                  </div>
                </div>

                <div className="ds-field">
                  <label className="ds-label">Price (₹)</label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </span>
                    <input type="number" className="ds-input" placeholder="0" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                  </div>
                </div>

                <div className="ds-field">
                  <label className="ds-label">Category</label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
                      </svg>
                    </span>
                    <select className="ds-select" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} required>
                      <option value="General">General</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="ds-field">
                  <label className="ds-label">Image URL</label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </span>
                    <input type="text" className="ds-input" placeholder="https://..." value={newProduct.image} onChange={e => setNewProduct({ ...newProduct, image: e.target.value })} />
                  </div>
                  {/* Image preview */}
                  <div className="ds-img-preview">
                    {newProduct.image
                      ? <img src={newProduct.image} alt="preview" onError={e => { e.target.style.display = 'none'; }} />
                      : <div className="ds-img-preview-empty">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <span>Preview</span>
                        </div>
                    }
                  </div>
                </div>

                <div className="ds-field">
                  <label className="ds-label">Description</label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon ds-textarea-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                      </svg>
                    </span>
                    <textarea className="ds-textarea-f" rows="3" placeholder="Brief product description…" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} required />
                  </div>
                </div>

                <button type="submit" className="ds-btn-primary">Add Product →</button>
              </form>
            </div>

            {/* ── Inventory Table ── */}
            <div className="ds-inv-card">
              <div className="ds-inv-header">
                <h4 className="ds-inv-title">Your Inventory</h4>
                <span className="ds-count-badge">{products.length} listings</span>
              </div>

              <div className="ds-table-wrap">
                <table className="ds-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ padding: 0 }}>
                          <div className="ds-empty">
                            <div className="ds-empty-icon">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                              </svg>
                            </div>
                            <p className="ds-empty-title">No products yet</p>
                            <p className="ds-empty-sub">Add your first product using the form on the left.</p>
                          </div>
                        </td>
                      </tr>
                    ) : products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div className="ds-prod-cell">
                            {p.image
                              ? <img src={p.image} alt={p.name} className="ds-prod-img" onError={e => { e.target.style.display='none'; }} />
                              : <div className="ds-prod-img-placeholder">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
                                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                                  </svg>
                                </div>
                            }
                            <div>
                              <span className="ds-prod-name">{p.name}</span>
                              {p.description && <span className="ds-prod-desc">{p.description}</span>}
                            </div>
                          </div>
                        </td>
                        <td><span className="ds-cat-badge">{p.category || 'General'}</span></td>
                        <td><span className="ds-price">₹{p.price}</span></td>
                        <td>
                          <button className="ds-btn-edit" onClick={() => navigate(`/edit-product/${p._id}`)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                          <button className="ds-btn-danger" onClick={() => deleteProduct(p._id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            </svg>
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
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
