import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ handleLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      handleLogin(res.data.user);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    }
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

        .ds-login-root {
          min-height: 100vh;
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        /* Decorative background blobs */
        .ds-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .ds-blob-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, rgba(232,98,26,0.13) 0%, transparent 70%);
          top: -180px; right: -120px;
          animation: floatBlob 8s ease-in-out infinite;
        }
        .ds-blob-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(247,137,74,0.10) 0%, transparent 70%);
          bottom: -100px; left: -80px;
          animation: floatBlob 10s ease-in-out infinite reverse;
        }
        .ds-blob-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(232,98,26,0.08) 0%, transparent 70%);
          top: 40%; left: 60%;
          animation: floatBlob 12s ease-in-out infinite 2s;
        }

        @keyframes floatBlob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -15px) scale(1.04); }
          66% { transform: translate(-10px, 10px) scale(0.97); }
        }

        /* Subtle grid pattern */
        .ds-login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(232,98,26,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,98,26,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
        }

        .ds-card-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 460px;
          animation: slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Brand mark above card */
        .ds-brand {
          text-align: center;
          margin-bottom: 2rem;
        }

        .ds-brand-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 56px; height: 56px;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          border-radius: 16px;
          margin-bottom: 1rem;
          box-shadow: 0 8px 24px var(--saffron-glow);
          animation: iconPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }

        @keyframes iconPop {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }

        .ds-brand-icon svg {
          width: 28px; height: 28px; fill: white;
        }

        .ds-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--deep);
          letter-spacing: -0.02em;
          line-height: 1;
          display: block;
        }

        .ds-brand-tagline {
          font-size: 0.8rem;
          color: var(--muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          margin-top: 0.3rem;
          display: block;
        }

        /* Card */
        .ds-card {
          background: var(--card-bg);
          border-radius: 24px;
          padding: 2.5rem 2.25rem;
          box-shadow: var(--shadow), 0 0 0 1px var(--border);
          position: relative;
          overflow: hidden;
        }

        .ds-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B);
          border-radius: 24px 24px 0 0;
        }

        .ds-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.55rem;
          font-weight: 600;
          color: var(--deep);
          margin: 0 0 0.3rem;
          letter-spacing: -0.02em;
        }

        .ds-card-sub {
          font-size: 0.875rem;
          color: var(--muted);
          margin: 0 0 2rem;
          font-weight: 400;
        }

        /* Error */
        .ds-error {
          background: #FFF1EC;
          border: 1px solid rgba(232,98,26,0.3);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #C0440E;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-5px); }
          75%      { transform: translateX(5px); }
        }

        /* Form fields */
        .ds-field {
          margin-bottom: 1.4rem;
          animation: fadeIn 0.5s ease both;
        }
        .ds-field:nth-child(1) { animation-delay: 0.1s; }
        .ds-field:nth-child(2) { animation-delay: 0.2s; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ds-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.55rem;
        }

        .ds-input-wrap {
          position: relative;
        }

        .ds-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--muted);
          opacity: 0.6;
          pointer-events: none;
          transition: color 0.2s, opacity 0.2s;
        }

        .ds-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          border: 1.5px solid #EAE0D5;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: var(--deep);
          background: #FDFAF7;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .ds-input::placeholder { color: #C5B8AB; }

        .ds-input:focus {
          border-color: var(--saffron);
          background: #FFFFFF;
          box-shadow: 0 0 0 4px var(--saffron-glow);
        }

        .ds-input:focus + .ds-focus-bar { width: 100%; }

        /* Forgot password link */
        .ds-forgot {
          display: block;
          text-align: right;
          font-size: 0.8rem;
          color: var(--saffron);
          text-decoration: none;
          margin-top: -0.8rem;
          margin-bottom: 1.8rem;
          font-weight: 500;
          transition: opacity 0.2s;
        }
        .ds-forgot:hover { opacity: 0.75; }

        /* Submit button */
        .ds-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--saffron) 0%, var(--saffron-light) 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 6px 24px var(--saffron-glow);
          letter-spacing: 0.01em;
          animation: fadeIn 0.5s ease 0.3s both;
        }

        .ds-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .ds-btn::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.5s, height 0.5s, opacity 0.5s;
          opacity: 0;
        }

        .ds-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(232,98,26,0.35); }
        .ds-btn:active { transform: translateY(0); }
        .ds-btn:active::after { width: 300px; height: 300px; opacity: 0; }

        /* Divider */
        .ds-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.75rem 0;
          color: #D5C9BE;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
        }
        .ds-divider::before, .ds-divider::after {
          content: ''; flex: 1;
          height: 1px;
          background: #EAE0D5;
        }

        /* Sign up footer */
        .ds-signup {
          text-align: center;
          font-size: 0.875rem;
          color: var(--muted);
          animation: fadeIn 0.5s ease 0.4s both;
        }
        .ds-signup a {
          color: var(--saffron);
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .ds-signup a:hover { opacity: 0.75; }

        /* Trust badges */
        .ds-trust {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #EAE0D5;
          animation: fadeIn 0.5s ease 0.5s both;
        }
        .ds-trust-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: #A89480;
          font-weight: 500;
        }
        .ds-trust-item svg {
          width: 14px; height: 14px;
          fill: var(--saffron);
          opacity: 0.8;
        }
      `}</style>

      <div className="ds-login-root">
        {/* Background blobs */}
        <div className="ds-blob ds-blob-1" />
        <div className="ds-blob ds-blob-2" />
        <div className="ds-blob ds-blob-3" />

        <div className="ds-card-wrapper">
          {/* Brand mark */}
          <div className="ds-brand">
            <div className="ds-brand-icon">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H16V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1Zm-9-1a2 2 0 0 1 4 0v1h-4Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2Z"/>
              </svg>
            </div>
            <span className="ds-brand-name">DukaanSetu</span>
            <span className="ds-brand-tagline">Your marketplace bridge</span>
          </div>

          {/* Card */}
          <div className="ds-card">
            <p className="ds-card-title">Welcome back</p>
            <p className="ds-card-sub">Sign in to continue to your store</p>

            {error && (
              <div className="ds-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="ds-field">
                <label className="ds-label">Email address</label>
                <div className="ds-input-wrap">
                  <span className="ds-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="ds-input"
                    placeholder="you@example.com"
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div className="ds-field">
                <label className="ds-label">Password</label>
                <div className="ds-input-wrap">
                  <span className="ds-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="ds-input"
                    placeholder="Enter your password"
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <a href="#" className="ds-forgot">Forgot password?</a>

              <button type="submit" className="ds-btn">Sign In →</button>
            </form>

            <div className="ds-trust">
              <span className="ds-trust-item">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Secure login
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

          <div className="ds-signup" style={{ marginTop: '1.5rem' }}>
            New to DukaanSetu? <a href="/signup">Create an account</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
