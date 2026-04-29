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
        setProducts(prodRes.data.slice(0, 8)); // Show first 8 products as featured
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
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --brand-primary: #FF5A36;
          --brand-dark: #0B0F19;
          --brand-light: #F8FAFC;
          --surface: #FFFFFF;
          --text-main: #1E293B;
          --text-muted: #64748B;
          --border-color: #E2E8F0;
          --transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ds-home {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: var(--text-main);
          background: var(--brand-light);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* --- Hero Section --- */
        .ds-hero {
          position: relative;
          padding: 8rem 2rem 6rem;
          background: var(--brand-dark);
          color: white;
          text-align: center;
          overflow: hidden;
        }

        .ds-hero::before, .ds-hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
        }

        .ds-hero::before {
          background: rgba(255, 90, 54, 0.3);
          width: 600px;
          height: 600px;
          top: -200px;
          left: -100px;
        }

        .ds-hero::after {
          background: rgba(67, 97, 238, 0.2);
          width: 500px;
          height: 500px;
          bottom: -200px;
          right: -100px;
        }

        .ds-hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          animation: fadeUp 1s ease-out forwards;
        }

        .ds-hero-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 2rem;
          color: var(--brand-primary);
        }

        .ds-hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.05;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .ds-hero-title span {
          background: linear-gradient(135deg, #FF5A36 0%, #FF8A36 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ds-hero-subtitle {
          font-size: 1.25rem;
          color: #94A3B8;
          margin-bottom: 3rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .ds-hero-btns {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .ds-btn {
          padding: 1.1rem 2.5rem;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .ds-btn-primary {
          background: var(--brand-primary);
          color: white;
          border: 2px solid var(--brand-primary);
          box-shadow: 0 10px 25px -5px rgba(255, 90, 54, 0.4);
        }

        .ds-btn-primary:hover {
          background: transparent;
          color: var(--brand-primary);
          transform: translateY(-3px);
          box-shadow: 0 15px 35px -5px rgba(255, 90, 54, 0.5);
        }

        .ds-btn-outline {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .ds-btn-outline:hover {
          background: white;
          color: var(--brand-dark);
          transform: translateY(-3px);
        }

        /* --- Section Defaults --- */
        .ds-section {
          padding: 6rem 2rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        .ds-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }

        .ds-section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--brand-dark);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .ds-link-all {
          color: var(--text-main);
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }

        .ds-link-all:hover {
          color: var(--brand-primary);
          gap: 0.8rem;
        }

        /* --- Categories Scroll --- */
        .ds-cat-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 1rem 0 2rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .ds-cat-scroll::-webkit-scrollbar {
          display: none;
        }

        .ds-cat-pill {
          flex: 0 0 auto;
          padding: 1rem 2rem;
          background: var(--surface);
          border-radius: 50px;
          border: 1px solid var(--border-color);
          text-decoration: none;
          color: var(--text-main);
          font-weight: 600;
          transition: var(--transition);
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .ds-cat-pill:hover {
          background: var(--brand-dark);
          color: white;
          border-color: var(--brand-dark);
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08);
        }

        /* --- Product Grid --- */
        .ds-prod-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2.5rem;
        }

        .ds-prod-card {
          background: var(--surface);
          border-radius: 24px;
          padding: 1rem;
          transition: var(--transition);
          cursor: pointer;
          border: 1px solid var(--border-color);
        }

        .ds-prod-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border-color: transparent;
        }

        .ds-prod-img-wrapper {
          width: 100%;
          height: 260px;
          border-radius: 16px;
          overflow: hidden;
          background: #F1F5F9;
          position: relative;
          margin-bottom: 1.5rem;
        }

        .ds-prod-img-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .ds-prod-card:hover .ds-prod-img-wrapper img {
          transform: scale(1.05);
        }

        .ds-prod-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--brand-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ds-prod-info {
          padding: 0 0.5rem;
        }

        .ds-prod-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--brand-dark);
          margin-bottom: 0.5rem;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ds-prod-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .ds-prod-shop {
          font-size: 0.875rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .ds-prod-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px dashed var(--border-color);
        }

        .ds-prod-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--brand-dark);
          font-family: 'Outfit', sans-serif;
        }

        .ds-prod-action {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--brand-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-dark);
          transition: var(--transition);
        }

        .ds-prod-card:hover .ds-prod-action {
          background: var(--brand-primary);
          color: white;
          transform: rotate(-45deg);
        }

        /* --- Roles/Features (Bento Grid) --- */
        .ds-roles-wrapper {
          padding: 6rem 2rem;
          background: var(--surface);
        }

        .ds-bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        .ds-bento-card {
          padding: 3rem;
          border-radius: 32px;
          background: var(--brand-light);
          border: 1px solid var(--border-color);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        .ds-bento-card:hover {
          transform: translateY(-5px);
          background: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
        }

        .ds-bento-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .ds-bento-card:nth-child(1) .ds-bento-icon { background: #E0F2FE; color: #0284C7; }
        .ds-bento-card:nth-child(2) .ds-bento-icon { background: #FEF3C7; color: #D97706; }
        .ds-bento-card:nth-child(3) .ds-bento-icon { background: #DCFCE7; color: #16A34A; }

        .ds-bento-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--brand-dark);
        }

        .ds-bento-desc {
          color: var(--text-muted);
          line-height: 1.6;
          font-size: 1.05rem;
        }

        /* --- Footer --- */
        .ds-footer {
          background: var(--brand-dark);
          color: white;
          padding: 6rem 2rem 3rem;
          text-align: center;
        }

        .ds-footer-logo {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          display: inline-block;
          letter-spacing: -0.02em;
        }

        .ds-footer-logo span { color: var(--brand-primary); }

        .ds-footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .ds-footer-link {
          color: #94A3B8;
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
        }

        .ds-footer-link:hover {
          color: white;
        }

        .ds-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 3rem;
          color: #64748B;
          font-size: 0.875rem;
        }

        /* Animations & Media Queries */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .ds-bento-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .ds-hero { padding: 6rem 1.5rem 4rem; }
          .ds-section { padding: 4rem 1.5rem; }
          .ds-section-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        }
      `}</style>

      <div className="ds-home">
        
        {/* Hero Section */}
        <section className="ds-hero">
          <div className="ds-hero-content">
            <div className="ds-hero-badge">Welcome to the future of local commerce</div>
            <h1 className="ds-hero-title">Your Neighborhood Shops, <span>Now Digital.</span></h1>
            <p className="ds-hero-subtitle">
              DukaanSetu brings your favorite community stores directly to your fingertips. 
              Discover local gems, shop seamlessly, and support your local economy.
            </p>
            <div className="ds-hero-btns">
              <Link to="/signup" className="ds-btn ds-btn-primary">
                Start Shopping
              </Link>
              <Link to="/signup" className="ds-btn ds-btn-outline">
                Register as Shopkeeper
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="ds-section">
          <div className="ds-section-header">
            <h2 className="ds-section-title">Explore Categories</h2>
          </div>
          <div className="ds-cat-scroll">
            {categories.map(cat => (
              <Link key={cat._id} to="/customer" className="ds-cat-pill">
                {cat.name}
              </Link>
            ))}
            {categories.length === 0 && <p style={{color: 'var(--text-muted)'}}>No categories available yet.</p>}
          </div>
        </section>

        {/* Featured Products */}
        <section className="ds-section" style={{ paddingTop: '2rem' }}>
          <div className="ds-section-header">
            <h2 className="ds-section-title">Trending Near You</h2>
            <Link to="/customer" className="ds-link-all">
              View Entire Collection 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          
          {loading ? (
            <div style={{textAlign: 'center', padding: '4rem', color: 'var(--text-muted)'}}>
              Loading curated products...
            </div>
          ) : (
            <div className="ds-prod-grid">
              {products.map(prod => (
                <div key={prod._id} className="ds-prod-card" onClick={() => navigate('/customer')}>
                  <div className="ds-prod-img-wrapper">
                    <span className="ds-prod-badge">{prod.category || 'General'}</span>
                    <img src={prod.image || 'https://via.placeholder.com/400x400?text=Product'} alt={prod.name} />
                  </div>
                  
                  <div className="ds-prod-info">
                    <span className="ds-prod-name">{prod.name}</span>
                    <div className="ds-prod-meta">
                      <span className="ds-prod-shop">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        {prod.shopkeeperId?.name || 'Local Store'}
                      </span>
                    </div>
                    
                    <div className="ds-prod-footer">
                      <span className="ds-prod-price">₹{prod.price}</span>
                      <div className="ds-prod-action">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><line x1="12" y1="5" x2="12" y2="19"></line></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && products.length === 0 && (
            <div style={{textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px', border: '1px dashed var(--border-color)'}}>
              <h3 style={{fontFamily: 'Outfit', color: 'var(--brand-dark)'}}>Empty Shelves</h3>
              <p style={{color: 'var(--text-muted)'}}>No products have been listed yet. Be the first to add something!</p>
            </div>
          )}
        </section>

        {/* Roles / How it works (Bento Layout) */}
        <div className="ds-roles-wrapper">
          <div className="ds-bento-grid">
            <div className="ds-bento-card">
              <div className="ds-bento-icon">🛍️</div>
              <h3 className="ds-bento-title">For Customers</h3>
              <p className="ds-bento-desc">Experience the convenience of modern e-commerce with the trust of your local neighborhood stores. Browse, cart, and get it fast.</p>
            </div>
            
            <div className="ds-bento-card">
              <div className="ds-bento-icon">🏪</div>
              <h3 className="ds-bento-title">For Shopkeepers</h3>
              <p className="ds-bento-desc">Take your physical store online in minutes. Manage inventory dynamically, expand your reach, and watch your daily sales grow.</p>
            </div>
            
            <div className="ds-bento-card">
              <div className="ds-bento-icon">🛡️</div>
              <h3 className="ds-bento-title">Secure Platform</h3>
              <p className="ds-bento-desc">Built with state-of-the-art security ensuring fair trade, verified local sellers, and a seamless payment experience for all users.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="ds-footer">
          <div className="ds-footer-logo">Dukaan<span>Setu</span></div>
          <div className="ds-footer-links">
            <Link to="/login" className="ds-footer-link">Login to Portal</Link>
            <Link to="/signup" className="ds-footer-link">Create Account</Link>
            <Link to="/customer" className="ds-footer-link">Browse Shops</Link>
          </div>
          <div className="ds-footer-bottom">
            <p>© 2026 DukaanSetu Marketplace. Empowering local businesses.</p>
          </div>
        </footer>
        
      </div>
    </>
  );
};

export default Home;
