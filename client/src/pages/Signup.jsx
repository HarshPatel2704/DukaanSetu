import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ handleLogin }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer', secretCode: '', address: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/signup`, formData);
      localStorage.setItem('token', res.data.token);
      handleLogin(res.data.user);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  const roleIcons = {
    customer: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    shopkeeper: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    admin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --saffron: #E8621A;
          --saffron-light: #F7894A;
          --saffron-glow: rgba(232, 98, 26, 0.18);
          --cream: #FDF6ED;
          --deep: #1A0F00;
          --muted: #7A6652;
          --card-bg: #FFFFFF;
          --border: rgba(232, 98, 26, 0.15);
          --shadow: 0 32px 80px rgba(26, 15, 0, 0.12);
        }

        .ds-su-root {
          min-height: 100vh;
          background: var(--cream);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2.5rem 1.5rem;
        }

        .ds-blob { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
        .ds-blob-1 { width: 520px; height: 520px; background: radial-gradient(circle, rgba(232,98,26,0.13) 0%, transparent 70%); top: -180px; right: -120px; animation: floatBlob 8s ease-in-out infinite; }
        .ds-blob-2 { width: 380px; height: 380px; background: radial-gradient(circle, rgba(247,137,74,0.10) 0%, transparent 70%); bottom: -100px; left: -80px; animation: floatBlob 10s ease-in-out infinite reverse; }
        .ds-blob-3 { width: 200px; height: 200px; background: radial-gradient(circle, rgba(232,98,26,0.08) 0%, transparent 70%); top: 40%; left: 60%; animation: floatBlob 12s ease-in-out infinite 2s; }

        @keyframes floatBlob {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(20px,-15px) scale(1.04); }
          66% { transform: translate(-10px,10px) scale(0.97); }
        }

        .ds-su-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: linear-gradient(rgba(232,98,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,98,26,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
        }

        .ds-su-wrapper {
          position: relative; z-index: 1;
          width: 100%; max-width: 500px;
          animation: slideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ds-brand { text-align: center; margin-bottom: 1.75rem; }

        .ds-brand-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 52px; height: 52px;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          border-radius: 15px; margin-bottom: 0.85rem;
          box-shadow: 0 8px 24px var(--saffron-glow);
          animation: iconPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        @keyframes iconPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        .ds-brand-icon svg { width: 26px; height: 26px; fill: white; }
        .ds-brand-name { font-family: 'Playfair Display', serif; font-size: 1.65rem; font-weight: 700; color: var(--deep); letter-spacing: -0.02em; display: block; }
        .ds-brand-tagline { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.12em; text-transform: uppercase; font-weight: 500; margin-top: 0.25rem; display: block; }

        /* Card */
        .ds-card {
          background: var(--card-bg);
          border-radius: 24px;
          padding: 2.25rem 2.25rem 2rem;
          box-shadow: var(--shadow), 0 0 0 1px var(--border);
          position: relative; overflow: hidden;
        }
        .ds-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B);
          border-radius: 24px 24px 0 0;
        }

        .ds-card-title { font-family: 'Playfair Display', serif; font-size: 1.45rem; font-weight: 600; color: var(--deep); margin: 0 0 0.25rem; letter-spacing: -0.02em; }
        .ds-card-sub { font-size: 0.875rem; color: var(--muted); margin: 0 0 1.75rem; }

        /* Two-column grid for name + email */
        .ds-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 480px) { .ds-grid-2 { grid-template-columns: 1fr; } }

        /* Error */
        .ds-error {
          background: #FFF1EC; border: 1px solid rgba(232,98,26,0.3);
          border-radius: 10px; padding: 0.7rem 1rem;
          color: #C0440E; font-size: 0.85rem; font-weight: 500;
          margin-bottom: 1.4rem; display: flex; align-items: center; gap: 0.5rem;
          animation: shake 0.4s ease;
        }
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }

        /* Fields */
        .ds-field { margin-bottom: 1.2rem; animation: fadeIn 0.5s ease both; }
        .ds-field:nth-child(1){animation-delay:0.05s} .ds-field:nth-child(2){animation-delay:0.10s}
        .ds-field:nth-child(3){animation-delay:0.15s} .ds-field:nth-child(4){animation-delay:0.20s}
        .ds-field:nth-child(5){animation-delay:0.25s} .ds-field:nth-child(6){animation-delay:0.30s}

        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        .ds-label { display: block; font-size: 0.78rem; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem; }

        .ds-input-wrap { position: relative; }
        .ds-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); opacity: 0.55; pointer-events: none; display: flex; }
        .ds-textarea-icon { top: 14px; transform: none; }

        .ds-input, .ds-textarea, .ds-select {
          width: 100%; padding: 0.82rem 1rem 0.82rem 2.65rem;
          border: 1.5px solid #EAE0D5; border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.92rem;
          color: var(--deep); background: #FDFAF7;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none; box-sizing: border-box; -webkit-appearance: none;
        }
        .ds-textarea { resize: none; min-height: 76px; line-height: 1.5; }
        .ds-select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A6652' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 2.5rem; }

        .ds-input::placeholder, .ds-textarea::placeholder { color: #C5B8AB; }
        .ds-input:focus, .ds-textarea:focus, .ds-select:focus {
          border-color: var(--saffron); background: #fff;
          box-shadow: 0 0 0 4px var(--saffron-glow);
        }

        /* Role selector cards */
        .ds-role-group { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; }
        .ds-role-card {
          border: 1.5px solid #EAE0D5; border-radius: 11px;
          padding: 0.75rem 0.5rem; text-align: center; cursor: pointer;
          background: #FDFAF7; transition: all 0.2s;
          display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
        }
        .ds-role-card:hover { border-color: var(--saffron-light); background: #FFF8F3; }
        .ds-role-card.active {
          border-color: var(--saffron); background: #FFF3EB;
          box-shadow: 0 0 0 3px var(--saffron-glow);
        }
        .ds-role-card-icon { width: 30px; height: 30px; border-radius: 8px; background: #F0E8DF; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .ds-role-card.active .ds-role-card-icon { background: linear-gradient(135deg, var(--saffron), var(--saffron-light)); }
        .ds-role-card.active .ds-role-card-icon svg { stroke: white; }
        .ds-role-card-icon svg { stroke: var(--muted); }
        .ds-role-card-label { font-size: 0.75rem; font-weight: 500; color: var(--muted); text-transform: capitalize; }
        .ds-role-card.active .ds-role-card-label { color: var(--saffron); font-weight: 600; }

        /* Secret code field */
        .ds-secret-wrap {
          background: #FFF8F3; border: 1.5px solid rgba(232,98,26,0.25);
          border-radius: 12px; padding: 1rem 1.1rem;
          margin-bottom: 1.2rem;
          animation: fadeIn 0.35s ease both;
        }
        .ds-secret-label { font-size: 0.78rem; font-weight: 600; color: var(--saffron); text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.55rem; }
        .ds-secret-hint { font-size: 0.77rem; color: var(--muted); margin-top: 0.45rem; display: flex; align-items: center; gap: 0.3rem; }

        /* Button */
        .ds-btn {
          width: 100%; padding: 1rem;
          background: linear-gradient(135deg, var(--saffron) 0%, var(--saffron-light) 100%);
          color: white; border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 6px 24px var(--saffron-glow);
          letter-spacing: 0.01em; margin-top: 0.5rem;
          animation: fadeIn 0.5s ease 0.35s both;
        }
        .ds-btn::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%); pointer-events: none; }
        .ds-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(232,98,26,0.35); }
        .ds-btn:active { transform: translateY(0); }

        /* Trust + login link */
        .ds-trust { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-top: 1.75rem; padding-top: 1.4rem; border-top: 1px solid #EAE0D5; animation: fadeIn 0.5s ease 0.45s both; }
        .ds-trust-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.74rem; color: #A89480; font-weight: 500; }
        .ds-trust-item svg { width: 13px; height: 13px; fill: var(--saffron); opacity: 0.8; }

        .ds-login-link { text-align: center; font-size: 0.875rem; color: var(--muted); margin-top: 1.4rem; animation: fadeIn 0.5s ease 0.5s both; }
        .ds-login-link a { color: var(--saffron); font-weight: 600; text-decoration: none; transition: opacity 0.2s; }
        .ds-login-link a:hover { opacity: 0.75; }
      `}</style>

      <div className="ds-su-root">
        <div className="ds-blob ds-blob-1" />
        <div className="ds-blob ds-blob-2" />
        <div className="ds-blob ds-blob-3" />

        <div className="ds-su-wrapper">
          {/* Brand */}
          <div className="ds-brand">
            <div className="ds-brand-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H16V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1Zm-9-1a2 2 0 0 1 4 0v1h-4Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2Z"/>
              </svg>
            </div>
            <span className="ds-brand-name">DukaanSetu</span>
            <span className="ds-brand-tagline">Your marketplace bridge</span>
          </div>

          <div className="ds-card">
            <p className="ds-card-title">Create your account</p>
            <p className="ds-card-sub">Join thousands of buyers and sellers on DukaanSetu</p>

            {error && (
              <div className="ds-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              {/* Name + Email row */}
              <div className="ds-grid-2">
                <div className="ds-field">
                  <label className="ds-label">Full Name</label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input type="text" name="name" className="ds-input" placeholder="Ravi Kumar" onChange={onChange} required />
                  </div>
                </div>

                <div className="ds-field">
                  <label className="ds-label">Email</label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </span>
                    <input type="email" name="email" className="ds-input" placeholder="you@example.com" onChange={onChange} required />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="ds-field">
                <label className="ds-label">Password</label>
                <div className="ds-input-wrap">
                  <span className="ds-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input type="password" name="password" className="ds-input" placeholder="Create a strong password" onChange={onChange} required />
                </div>
              </div>

              {/* Address */}
              <div className="ds-field">
                <label className="ds-label">Delivery Address</label>
                <div className="ds-input-wrap">
                  <span className="ds-input-icon ds-textarea-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <textarea name="address" className="ds-textarea" placeholder="Street, City, Pin Code" onChange={onChange} required />
                </div>
              </div>

              {/* Role selector */}
              <div className="ds-field">
                <label className="ds-label">I am a</label>
                <div className="ds-role-group">
                  {['customer', 'shopkeeper', 'admin'].map((r) => (
                    <div
                      key={r}
                      className={`ds-role-card ${formData.role === r ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, role: r, secretCode: '' })}
                    >
                      <div className="ds-role-card-icon">{roleIcons[r]}</div>
                      <span className="ds-role-card-label">{r}</span>
                    </div>
                  ))}
                </div>
                {/* Hidden input to keep form value in sync */}
                <input type="hidden" name="role" value={formData.role} />
              </div>

              {/* Secret code — only for shopkeeper/admin */}
              {(formData.role === 'shopkeeper' || formData.role === 'admin') && (
                <div className="ds-secret-wrap">
                  <label className="ds-secret-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Secret Code — required for {formData.role}
                  </label>
                  <div className="ds-input-wrap">
                    <span className="ds-input-icon">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input type="text" name="secretCode" className="ds-input" placeholder="Enter your access code" onChange={onChange} required />
                  </div>
                  <p className="ds-secret-hint">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    {/* Enter <strong>"8899"</strong> to verify your {formData.role} role. */}
                  </p>
                </div>
              )}

              <button type="submit" className="ds-btn">Create Account →</button>
            </form>

            <div className="ds-trust">
              <span className="ds-trust-item">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure signup
              </span>
              <span className="ds-trust-item">
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 14.5v-5l-2-2 1.5-1.5 2.5 2.5V16.5h-2zm1-9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>
                256-bit SSL
              </span>
              <span className="ds-trust-item">
                <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Verified
              </span>
            </div>
          </div>

          <div className="ds-login-link">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
