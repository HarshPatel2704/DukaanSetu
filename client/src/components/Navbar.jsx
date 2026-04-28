import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --saffron: #E8621A;
          --saffron-light: #F7894A;
          --saffron-glow: rgba(232, 98, 26, 0.18);
          --deep: #1A0F00;
          --cream: #FDF6ED;
          --muted: #7A6652;
          --nav-bg: rgba(26, 15, 0, 0.97);
          --nav-border: rgba(232, 98, 26, 0.15);
        }

        .ds-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 4px 32px rgba(0,0,0,0.25);
        }

        /* Thin saffron top bar */
        .ds-nav::before {
          content: '';
          display: block;
          height: 2.5px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B, var(--saffron));
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .ds-nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 62px;
        }

        /* Brand */
        .ds-nav-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .ds-nav-brand-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px var(--saffron-glow);
          flex-shrink: 0;
        }
        .ds-nav-brand-icon svg { width: 18px; height: 18px; fill: white; }
        .ds-nav-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .ds-nav-brand-name span {
          color: var(--saffron-light);
        }

        /* Nav links */
        .ds-nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0; padding: 0;
        }

        .ds-nav-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .ds-nav-link svg { opacity: 0.6; transition: opacity 0.2s; flex-shrink: 0; }
        .ds-nav-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .ds-nav-link:hover svg { opacity: 1; }
        .ds-nav-link.active {
          color: var(--saffron-light);
          background: rgba(232,98,26,0.12);
        }
        .ds-nav-link.active svg { opacity: 1; stroke: var(--saffron-light); }

        /* Divider between nav sections */
        .ds-nav-sep {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.1);
          margin: 0 0.5rem;
          flex-shrink: 0;
        }

        /* Role badge */
        .ds-role-badge {
          display: inline-flex; align-items: center; gap: 0.3rem;
          font-size: 0.72rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.07em;
          padding: 0.2rem 0.55rem;
          border-radius: 20px;
          background: rgba(232,98,26,0.15);
          color: var(--saffron-light);
          border: 1px solid rgba(232,98,26,0.25);
          flex-shrink: 0;
        }

        /* User info */
        .ds-user-info {
          display: flex; align-items: center; gap: 0.75rem;
          flex-shrink: 0;
        }
        .ds-user-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: white;
          flex-shrink: 0;
          box-shadow: 0 2px 8px var(--saffron-glow);
        }
        .ds-user-name {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.85);
          font-weight: 500;
          white-space: nowrap;
        }
        .ds-user-name strong { color: #fff; }

        /* Buttons */
        .ds-btn-logout {
          padding: 0.4rem 0.9rem;
          border: 1.5px solid rgba(232,98,26,0.4);
          background: transparent;
          color: var(--saffron-light);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 0.35rem;
          white-space: nowrap;
        }
        .ds-btn-logout:hover { background: rgba(232,98,26,0.15); border-color: var(--saffron); color: #fff; }

        .ds-btn-login {
          padding: 0.4rem 0.9rem;
          border: 1.5px solid rgba(255,255,255,0.2);
          background: transparent;
          color: rgba(255,255,255,0.8);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .ds-btn-login:hover { border-color: rgba(255,255,255,0.5); color: #fff; background: rgba(255,255,255,0.06); }

        .ds-btn-signup {
          padding: 0.4rem 1rem;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          color: white;
          border: none;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem; font-weight: 600;
          text-decoration: none;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 3px 12px var(--saffron-glow);
          white-space: nowrap;
        }
        .ds-btn-signup:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(232,98,26,0.35); color: white; }

        .ds-auth-group { display: flex; align-items: center; gap: 0.6rem; }

        /* Hamburger for mobile */
        .ds-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 4px;
          background: none;
          border: none;
        }
        .ds-hamburger span {
          display: block; width: 22px; height: 2px;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
          transition: all 0.3s;
        }
        .ds-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .ds-hamburger.open span:nth-child(2) { opacity: 0; }
        .ds-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu */
        .ds-mobile-menu {
          display: none;
          flex-direction: column;
          padding: 0.75rem 1.5rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          gap: 0.25rem;
          animation: mobileSlide 0.25s ease;
        }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ds-mobile-menu.open { display: flex; }
        .ds-mobile-link {
          display: flex; align-items: center; gap: 0.6rem;
          padding: 0.65rem 0.75rem;
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.9rem; font-weight: 500;
          transition: color 0.2s, background 0.2s;
        }
        .ds-mobile-link:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .ds-mobile-link.active { color: var(--saffron-light); background: rgba(232,98,26,0.12); }
        .ds-mobile-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 0.5rem 0; }
        .ds-mobile-actions { display: flex; gap: 0.75rem; padding: 0.25rem 0.75rem 0; }

        @media (max-width: 768px) {
          .ds-nav-links, .ds-nav-sep, .ds-user-info { display: none; }
          .ds-hamburger { display: flex; }
        }
      `}</style>

      <nav className="ds-nav">
        <div className="ds-nav-inner">
          {/* Brand */}
          <Link className="ds-nav-brand" to="/">
            <div className="ds-nav-brand-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H16V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1Zm-9-1a2 2 0 0 1 4 0v1h-4Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2Z"/>
              </svg>
            </div>
            <span className="ds-nav-brand-name">Dukaan<span>Setu</span></span>
          </Link>

          {/* Desktop nav links */}
          <ul className="ds-nav-links">
            <li>
              <Link className={`ds-nav-link ${isActive('/') ? 'active' : ''}`} to="/">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </Link>
            </li>
            {user && (
              <>
                {user.role === 'customer' && (
                  <>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/customer') ? 'active' : ''}`} to="/customer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        Browse
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/cart') ? 'active' : ''}`} to="/cart">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                        Cart
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/orders') ? 'active' : ''}`} to="/orders">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Orders
                      </Link>
                    </li>
                  </>
                )}

                {user.role === 'shopkeeper' && (
                  <>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/shopkeeper') ? 'active' : ''}`} to="/shopkeeper">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/shopkeeper-orders') ? 'active' : ''}`} to="/shopkeeper-orders">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/product-management') ? 'active' : ''}`} to="/product-management">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/feedback') ? 'active' : ''}`} to="/feedback">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        Feedback
                      </Link>
                    </li>
                  </>
                )}

                {user.role === 'admin' && (
                  <>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/admin') ? 'active' : ''}`} to="/admin">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/admin-products') ? 'active' : ''}`} to="/admin-products">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/admin-categories') ? 'active' : ''}`} to="/admin-categories">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link className={`ds-nav-link ${isActive('/admin-users') ? 'active' : ''}`} to="/admin-users">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        Users
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
          {user && <div className="ds-nav-sep" />}

          {/* Desktop right section */}
          <div className="ds-user-info">
            {user ? (
              <>
                <div className="ds-user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="ds-user-name"><strong>{user.name}</strong></span>
                <span className="ds-role-badge">{user.role}</span>
                <button className="ds-btn-logout" onClick={handleLogout}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="ds-auth-group">
                <Link className="ds-btn-login" to="/login">Login</Link>
                <Link className="ds-btn-signup" to="/signup">Sign up →</Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className={`ds-hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`ds-mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link className={`ds-mobile-link ${isActive('/') ? 'active' : ''}`} to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {user?.role === 'customer' && (
            <>
              <Link className={`ds-mobile-link ${isActive('/customer') ? 'active' : ''}`} to="/customer" onClick={() => setMenuOpen(false)}>Browse Products</Link>
              <Link className={`ds-mobile-link ${isActive('/cart') ? 'active' : ''}`} to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
              <Link className={`ds-mobile-link ${isActive('/orders') ? 'active' : ''}`} to="/orders" onClick={() => setMenuOpen(false)}>Order History</Link>
            </>
          )}
          {user?.role === 'shopkeeper' && (
            <>
              <Link className={`ds-mobile-link ${isActive('/shopkeeper') ? 'active' : ''}`} to="/shopkeeper" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link className={`ds-mobile-link ${isActive('/shopkeeper-orders') ? 'active' : ''}`} to="/shopkeeper-orders" onClick={() => setMenuOpen(false)}>Orders</Link>
              <Link className={`ds-mobile-link ${isActive('/product-management') ? 'active' : ''}`} to="/product-management" onClick={() => setMenuOpen(false)}>Product Management</Link>
              <Link className={`ds-mobile-link ${isActive('/feedback') ? 'active' : ''}`} to="/feedback" onClick={() => setMenuOpen(false)}>Feedback Monitoring</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <>
              <Link className={`ds-mobile-link ${isActive('/admin') ? 'active' : ''}`} to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link className={`ds-mobile-link ${isActive('/admin-products') ? 'active' : ''}`} to="/admin-products" onClick={() => setMenuOpen(false)}>Products</Link>
              <Link className={`ds-mobile-link ${isActive('/admin-categories') ? 'active' : ''}`} to="/admin-categories" onClick={() => setMenuOpen(false)}>Categories</Link>
              <Link className={`ds-mobile-link ${isActive('/admin-users') ? 'active' : ''}`} to="/admin-users" onClick={() => setMenuOpen(false)}>Users</Link>
            </>
          )}

          <div className="ds-mobile-divider" />

          {user ? (
            <div style={{ padding: '0.25rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div className="ds-user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 500 }}>{user.name}</span>
                <span className="ds-role-badge">{user.role}</span>
              </div>
              <button className="ds-btn-logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </div>
          ) : (
            <div className="ds-mobile-actions">
              <Link className="ds-btn-login" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className="ds-btn-signup" to="/signup" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;