import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/admin/categories`)
        ]);
        setProducts(prodRes.data.slice(0, 8)); 
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

        :root {
          --brand-primary: #FF5A36;
          --brand-primary-hover: #E04826;
          --brand-dark: #0F172A;
          --brand-light: #F8FAFC;
          --surface: #FFFFFF;
          --text-main: #334155;
          --text-heading: #0F172A;
          --text-muted: #64748B;
          --border-color: #E2E8F0;
          --transition-smooth: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.04), 0 4px 6px -2px rgba(15, 23, 42, 0.02);
        }

        .ds-home {
          font-family: 'Inter', sans-serif;
          color: var(--text-main);
          background: var(--brand-light);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* --- Professional Minimalist Hero --- */
        .ds-hero {
          position: relative;
          padding: 9rem 2rem 8rem;
          background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
          color: white;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .ds-hero-grid {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          pointer-events: none;
        }

        .ds-hero-container {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .ds-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 90, 54, 0.1);
          border: 1px solid rgba(255, 90, 54, 0.2);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 2rem;
          color: #FF7A5C;
        }

        .ds-hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          color: #FFFFFF;
        }

        .ds-hero-title span {
          color: var(--brand-primary);
        }

        .ds-hero-subtitle {
          font-size: 1.15rem;
          color: #94A3B8;
          margin-bottom: 3rem;
          line-height: 1.6;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
        }

        .ds-hero-btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .ds-btn {
          padding: 0.85rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: var(--transition-smooth);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .ds-btn-primary {
          background: var(--brand-primary);
          color: white;
          border: 1px solid var(--brand-primary);
        }

        .ds-btn-primary:hover {
          background: var(--brand-primary-hover);
          border-color: var(--brand-primary-hover);
          transform: translateY(-1px);
        }

        .ds-btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .ds-btn-outline:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }

        /* --- Sections Layout --- */
        .ds-section {
          padding: 5rem 2rem;
          max-width: 1240px;
          margin: 0 auto;
        }

        .ds-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1rem;
        }

        .ds-section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-heading);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .ds-link-all {
          color: var(--brand-primary);
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: var(--transition-smooth);
        }

        .ds-link-all:hover {
          color: var(--brand-primary-hover);
          transform: translateX(3px);
        }

        /* --- Category Pills --- */
        .ds-cat-scroll {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding: 0.25rem 0 1rem;
          scrollbar-width: none;
        }
        
        .ds-cat-scroll::-webkit-scrollbar {
          display: none;
        }

        .ds-cat-pill {
          flex: 0 0 auto;
          padding: 0.65rem 1.25rem;
          background: var(--surface);
          border-radius: 6px;
          border: 1px solid var(--border-color);
          text-decoration: none;
          color: var(--text-main);
          font-weight: 500;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-sm);
        }

        .ds-cat-pill:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
          transform: translateY(-1px);
        }

        /* --- Professional Product Cards --- */
        .ds-prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 2rem;
        }

        .ds-prod-card {
          background: var(--surface);
          border-radius: 12px;
          padding: 0.85rem;
          transition: var(--transition-smooth);
          cursor: pointer;
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }

        .ds-prod-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: #CBD5E1;
        }

        .ds-prod-img-wrapper {
          width: 100%;
          height: 240px;
          border-radius: 8px;
          overflow: hidden;
          background: #F1F5F9;
          position: relative;
          margin-bottom: 1rem;
        }

        .ds-prod-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .ds-prod-card:hover .ds-prod-img-wrapper img {
          transform: scale(1.03);
        }

        .ds-prod-badge {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 600;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .ds-prod-info {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .ds-prod-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-heading);
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ds-prod-meta {
          margin-bottom: 1rem;
        }

        .ds-prod-shop {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .ds-prod-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-color);
          margin-top: auto;
        }

        .ds-prod-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-heading);
        }

        .ds-prod-action {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: var(--brand-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-heading);
          transition: var(--transition-smooth);
          border: 1px solid var(--border-color);
        }

        .ds-prod-card:hover .ds-prod-action {
          background: var(--brand-primary);
          color: white;
          border-color: var(--brand-primary);
        }

        /* --- Corporate Feature Grid --- */
        .ds-roles-wrapper {
          padding: 6rem 2rem;
          background: #FFFFFF;
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
        }

        .ds-bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          max-width: 1240px;
          margin: 0 auto;
        }

        .ds-bento-card {
          padding: 1.5rem 0;
        }

        .ds-bento-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .ds-bento-card:nth-child(1) .ds-bento-icon { background: #EFF6FF; color: #2563EB; }
        .ds-bento-card:nth-child(2) .ds-bento-icon { background: #FFFBEB; color: #D97706; }
        .ds-bento-card:nth-child(3) .ds-bento-icon { background: #F0FDF4; color: #16A34A; }

        .ds-bento-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-heading);
        }

        .ds-bento-desc {
          color: var(--text-muted);
          line-height: 1.5;
          font-size: 0.925rem;
        }

        /* --- Professional Skeleton Animation --- */
        .ds-skeleton {
          background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
          background-size: 200% 100%;
          animation: loading-shimmer 1.5s infinite;
          border-radius: 6px;
        }

        @keyframes loading-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* --- Footer --- */
        .ds-footer {
          background: #0F172A;
          color: #94A3B8;
          padding: 5rem 2rem 3rem;
        }

        .ds-footer-content {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1E293B;
          padding-bottom: 3rem;
        }

        .ds-footer-logo {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          text-decoration: none;
          letter-spacing: -0.02em;
        }

        .ds-footer-logo span { color: var(--brand-primary); }

        .ds-footer-links {
          display: flex;
          gap: 2.5rem;
        }

        .ds-footer-link {
          color: #94A3B8;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .ds-footer-link:hover {
          color: white;
        }

        .ds-footer-bottom {
          max-width: 1240px;
          margin: 0 auto;
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #64748B;
        }

        @media (max-width: 992px) {
          .ds-bento-grid { grid-template-columns: 1fr; gap: 1rem; }
          .ds-footer-content { flex-direction: column; gap: 2rem; text-align: center; }
          .ds-footer-links { flex-direction: column; gap: 1rem; }
          .ds-footer-bottom { flex-direction: column; align-items: center; gap: 1rem; }
        }

        @media (max-width: 768px) {
          .ds-hero { padding: 7rem 1.5rem 5rem; }
          .ds-section { padding: 3.5rem 1.5rem; }
        }
      `}</style>

      <div className="ds-home">
        
        {/* SaaS-Style Clean Hero Section */}
        <section className="ds-hero">
          <div className="ds-hero-grid" />
          <div className="ds-hero-container">
            <div className="ds-hero-badge">
              Localized Digital Infrastructure
            </div>
            <h1 className="ds-hero-title">
              Your Neighborhood Shops. <br /><span>Digitally Connected.</span>
            </h1>
            <p className="ds-hero-subtitle">
              DukaanSetu provides the digital commerce layer for local micro-economies, connecting community-trusted brick & mortar stores with modern consumer experiences.
            </p>
            <div className="ds-hero-btns">
              <Link to="/signup" className="ds-btn ds-btn-primary">
                Explore Marketplace
              </Link>
              <Link to="/signup" className="ds-btn ds-btn-outline">
                Merchant Onboarding
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Carousel Section */}
        <section className="ds-section">
          <div className="ds-section-header">
            <h2 className="ds-section-title">Browse Industries</h2>
          </div>
          <div className="ds-cat-scroll">
            {categories.map(cat => (
              <Link key={cat._id} to="/customer" className="ds-cat-pill">
                {cat.name}
              </Link>
            ))}
            {!loading && categories.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No dynamic categories populated.</p>}
          </div>
        </section>

        {/* Featured Live Products */}
        <section className="ds-section" style={{ paddingTop: '0' }}>
          <div className="ds-section-header">
            <h2 className="ds-section-title">Verified Merchants Near You</h2>
            <Link to="/customer" className="ds-link-all">
              View Catalog
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
          
          {loading ? (
            <div className="ds-prod-grid">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="ds-prod-card" style={{ cursor: 'default' }}>
                  <div className="ds-prod-img-wrapper ds-skeleton" />
                  <div className="ds-skeleton" style={{ height: '1.2rem', width: '70%', marginBottom: '0.5rem' }} />
                  <div className="ds-skeleton" style={{ height: '0.9rem', width: '40%', marginBottom: '1.5rem' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="ds-skeleton" style={{ height: '1.5rem', width: '30%' }} />
                    <div className="ds-skeleton" style={{ height: '32px', width: '32px', borderRadius: '6px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ds-prod-grid">
              {products.map(prod => (
                <div key={prod._id} className="ds-prod-card" onClick={() => navigate('/customer')}>
                  <div className="ds-prod-img-wrapper">
                    <span className="ds-prod-badge">{prod.category || 'General'}</span>
                    <img src={prod.image || 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=600&q=80'} alt={prod.name} />
                  </div>
                  
                  <div className="ds-prod-info">
                    <span className="ds-prod-name">{prod.name}</span>
                    <div className="ds-prod-meta">
                      <span className="ds-prod-shop">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {prod.shopkeeperId?.name || 'Local Merchant'}
                      </span>
                    </div>
                    
                    <div className="ds-prod-footer">
                      <span className="ds-prod-price">₹{prod.price}</span>
                      <div className="ds-prod-action">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div style={{ textAlignment: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>No inventory streams currently online in your location.</p>
            </div>
          )}
        </section>

        {/* B2B & B2C Core Architecture Pillars */}
        <div className="ds-roles-wrapper">
          <div className="ds-bento-grid">
            <div className="ds-bento-card">
              <div className="ds-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <h3 className="ds-bento-title">Consumer Convenience</h3>
              <p className="ds-bento-desc">Access neighborhood supply pipelines instantly. Browse physical storefront availability digital-first with lightning fast delivery integrations.</p>
            </div>
            
            <div className="ds-bento-card">
              <div className="ds-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              </div>
              <h3 className="ds-bento-title">Merchant Cloud Infrastructure</h3>
              <p className="ds-bento-desc">Empowering local vendors with live stock inventory adjustments, detailed order funnels, and data management options to scale out operations.</p>
            </div>
            
            <div className="ds-bento-card">
              <div className="ds-bento-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <h3 className="ds-bento-title">Transactional Integrity</h3>
              <p className="ds-bento-desc">Ensuring reliable distributed platform mechanics. Encrypted handshakes protect both localized retailers and buying end-users natively.</p>
            </div>
          </div>
        </div>

        {/* Clean Corporate Footer */}
        <footer className="ds-footer">
          <div className="ds-footer-content">
            <Link to="/" className="ds-footer-logo">Dukaan<span>Setu</span></Link>
            <div className="ds-footer-links">
              <Link to="/login" className="ds-footer-link">Portal Login</Link>
              <Link to="/signup" className="ds-footer-link">Merchant Inquiries</Link>
              <Link to="/customer" className="ds-footer-link">Marketplace Catalog</Link>
            </div>
          </div>
          <div className="ds-footer-bottom">
            <p>© 2026 DukaanSetu Networks Inc. All rights reserved.</p>
            <p>Architected for Sustainable Micro-Economies.</p>
          </div>
        </footer>
        
      </div>
    </>
  );
};

export default Home;  
