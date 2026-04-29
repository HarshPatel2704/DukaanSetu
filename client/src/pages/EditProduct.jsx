import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/categories`);
        setCategories(res.data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();

    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, config);
        if (res.data) {
          setFormData({
            name: res.data.name || '',
            price: res.data.price || '',
            description: res.data.description || '',
            image: res.data.image || '',
            category: res.data.category || 'General'
          });
        } else {
          showMsg('Product not found in database.', 'error');
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
        showMsg(`Error loading product: ${errorMsg}`, 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== 'undefined') fetchProduct();
    else { showMsg('Invalid Product ID.', 'error'); setLoading(false); }
  }, [id]);

  const showMsg = (text, type = 'success') => { setMessage(text); setMsgType(type); };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'image') setImgError(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { showMsg('Session expired. Please login again.', 'error'); setSaving(false); return; }
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
      });
      showMsg('Product updated successfully! Redirecting…', 'success');
      setTimeout(() => navigate('/shopkeeper'), 2000);
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to update product', 'error');
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", color: '#7A6652' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid #EAE0D5', borderTopColor: '#E8621A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
        <p style={{ fontSize: '0.9rem' }}>Loading product details…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
          --saffron-glow: rgba(232,98,26,0.15);
          --cream: #FDF6ED;
          --deep: #1A0F00;
          --muted: #7A6652;
          --card-bg: #FFFFFF;
          --border-soft: #EAE0D5;
          --shadow-card: 0 4px 24px rgba(26,15,0,0.07);
          --shadow-hover: 0 12px 36px rgba(26,15,0,0.11);
        }

        .ds-ep-root {
          min-height: 100vh; background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem 4rem;
          position: relative;
        }
        .ds-ep-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(232,98,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,98,26,0.03) 1px, transparent 1px);
          background-size: 48px 48px; pointer-events: none; z-index: 0;
        }

        /* blobs */
        .ds-blob { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        .ds-blob-1 { width: 420px; height: 420px; background: radial-gradient(circle, rgba(232,98,26,0.10) 0%, transparent 70%); top: -140px; right: -100px; animation: floatBlob 8s ease-in-out infinite; }
        .ds-blob-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(247,137,74,0.08) 0%, transparent 70%); bottom: -80px; left: -60px; animation: floatBlob 11s ease-in-out infinite reverse; }
        @keyframes floatBlob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(16px,-12px) scale(1.04)} 66%{transform:translate(-8px,8px) scale(0.97)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }

        .ds-ep-inner {
          max-width: 560px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* ── Header ── */
        .ds-ep-header {
          text-align: center; margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-ep-brand-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 50px; height: 50px; border-radius: 14px;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          box-shadow: 0 6px 20px var(--saffron-glow); margin-bottom: 0.9rem;
        }
        .ds-ep-brand-icon svg { width: 24px; height: 24px; fill: white; }
        .ds-ep-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem; font-weight: 700;
          color: var(--deep); letter-spacing: -0.03em; margin: 0 0 0.2rem;
        }
        .ds-ep-title span { color: var(--saffron); }
        .ds-ep-subtitle { font-size: 0.85rem; color: var(--muted); margin: 0; }

        /* ── Alert ── */
        .ds-alert {
          border-radius: 12px; padding: 0.75rem 1.1rem;
          font-size: 0.875rem; font-weight: 500;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 0.55rem;
          animation: slideUp 0.3s ease both;
        }
        .ds-alert.success { background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.25); color: #15803D; }
        .ds-alert.error   { background: #FFF1EC; border: 1px solid rgba(232,98,26,0.3); color: #C0440E; animation: shake 0.4s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }

        /* ── Card ── */
        .ds-ep-card {
          background: var(--card-bg); border-radius: 22px;
          padding: 2rem 2rem 2.25rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          position: relative; overflow: hidden;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.08s both;
        }
        .ds-ep-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B);
          border-radius: 22px 22px 0 0;
        }

        /* ── Image preview ── */
        .ds-img-preview-wrap {
          border-radius: 14px; overflow: hidden;
          border: 1.5px dashed var(--border-soft);
          background: #FDFAF7; margin-bottom: 1.75rem;
          height: 200px; position: relative;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s;
        }
        .ds-img-preview-wrap:hover { border-color: var(--saffron-light); }
        .ds-img-preview { width: 100%; height: 100%; object-fit: contain; }
        .ds-img-placeholder {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          color: #C5B8AB;
        }
        .ds-img-placeholder span { font-size: 0.78rem; }
        .ds-img-preview-label {
          position: absolute; top: 10px; left: 12px;
          font-size: 0.7rem; font-weight: 600; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.08em;
          background: rgba(255,255,255,0.9); padding: 0.2rem 0.55rem;
          border-radius: 20px; border: 1px solid var(--border-soft);
        }

        /* ── Form fields ── */
        .ds-field { margin-bottom: 1.25rem; }
        .ds-label {
          display: block; font-size: 0.75rem; font-weight: 600;
          color: var(--muted); text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 0.48rem;
        }
        .ds-input-wrap { position: relative; }
        .ds-input-icon {
          position: absolute; left: 12px; top: 50%;
          transform: translateY(-50%);
          stroke: var(--muted); opacity: 0.5; pointer-events: none; display: flex;
        }
        .ds-textarea-icon { top: 13px; transform: none; }

        .ds-input, .ds-textarea-f, .ds-select {
          width: 100%; padding: 0.82rem 1rem 0.82rem 2.6rem;
          border: 1.5px solid var(--border-soft); border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
          color: var(--deep); background: #FDFAF7;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; box-sizing: border-box;
        }
        .ds-textarea-f { resize: none; min-height: 100px; line-height: 1.6; }
        .ds-select {
          cursor: pointer; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A6652' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
          background-color: #FDFAF7; padding-right: 2.2rem;
        }
        .ds-input::placeholder, .ds-textarea-f::placeholder { color: #C5B8AB; }
        .ds-input:focus, .ds-textarea-f:focus, .ds-select:focus {
          border-color: var(--saffron); background: #fff;
          box-shadow: 0 0 0 4px var(--saffron-glow);
        }

        /* Two-column row for price + category */
        .ds-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .ds-two-col { grid-template-columns: 1fr; } }

        /* ── Action buttons ── */
        .ds-actions { display: flex; gap: 0.85rem; margin-top: 1.75rem; }

        .ds-btn-save {
          flex: 1; padding: 0.95rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white; border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 5px 18px var(--saffron-glow);
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .ds-btn-save::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%); }
        .ds-btn-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(232,98,26,0.32); }
        .ds-btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

        .ds-btn-cancel {
          padding: 0.95rem 1.5rem;
          border: 1.5px solid var(--border-soft);
          background: #FDFAF7; color: var(--muted);
          border-radius: 12px; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .ds-btn-cancel:hover { border-color: var(--muted); color: var(--deep); }

        .ds-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.5);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite; flex-shrink: 0;
        }
      `}</style>

      <div className="ds-ep-root">
        <div className="ds-blob ds-blob-1" />
        <div className="ds-blob ds-blob-2" />

        <div className="ds-ep-inner">

          {/* Header */}
          <div className="ds-ep-header">
            <div className="ds-ep-brand-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H16V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1Zm-9-1a2 2 0 0 1 4 0v1h-4Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2Z"/>
              </svg>
            </div>
            <h2 className="ds-ep-title">Edit <span>Product</span></h2>
            <p className="ds-ep-subtitle">Update your product details below</p>
          </div>

          {/* Alert */}
          {message && (
            <div className={`ds-alert ${msgType}`}>
              {msgType === 'success'
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              }
              {message}
            </div>
          )}

          {/* Card */}
          <div className="ds-ep-card">

            {/* Image preview */}
            <div className="ds-img-preview-wrap">
              <span className="ds-img-preview-label">Preview</span>
              {formData.image && !imgError
                ? <img
                    src={formData.image}
                    alt="Product preview"
                    className="ds-img-preview"
                    onError={() => setImgError(true)}
                  />
                : <div className="ds-img-placeholder">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>{imgError ? 'Image failed to load' : 'No image URL provided'}</span>
                  </div>
              }
            </div>

            <form onSubmit={onSubmit}>

              {/* Name */}
              <div className="ds-field">
                <label className="ds-label">Product Name</label>
                <div className="ds-input-wrap">
                  <svg className="ds-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  <input
                    type="text" name="name" className="ds-input"
                    placeholder="e.g. Handmade Silk Kurta"
                    value={formData.name} onChange={onChange} required
                  />
                </div>
              </div>

              {/* Price + Category row */}
              <div className="ds-two-col">
                <div className="ds-field">
                  <label className="ds-label">Price (₹)</label>
                  <div className="ds-input-wrap">
                    <svg className="ds-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    <input
                      type="number" name="price" className="ds-input"
                      placeholder="0" value={formData.price} onChange={onChange} required
                    />
                  </div>
                </div>

                <div className="ds-field">
                  <label className="ds-label">Category</label>
                  <div className="ds-input-wrap">
                    <svg className="ds-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/>
                    </svg>
                    <select name="category" className="ds-select" value={formData.category} onChange={onChange} required>
                      <option value="General">General</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="ds-field">
                <label className="ds-label">Image URL</label>
                <div className="ds-input-wrap">
                  <svg className="ds-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <input
                    type="text" name="image" className="ds-input"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image} onChange={onChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="ds-field">
                <label className="ds-label">Description</label>
                <div className="ds-input-wrap">
                  <svg className="ds-input-icon ds-textarea-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
                  </svg>
                  <textarea
                    name="description" className="ds-textarea-f" rows="4"
                    placeholder="Describe your product…"
                    value={formData.description} onChange={onChange} required
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="ds-actions">
                <button type="submit" className="ds-btn-save" disabled={saving}>
                  {saving
                    ? <><span className="ds-spinner" /> Saving…</>
                    : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
                  }
                </button>
                <button type="button" className="ds-btn-cancel" onClick={() => navigate('/shopkeeper')}>
                  Cancel
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default EditProduct;
