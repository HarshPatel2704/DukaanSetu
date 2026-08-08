import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const useInView = (ref, threshold = 0.12) => {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
};

const useCountUp = (target, inView, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, inView, duration]);
  return value;
};

const Stat = ({ icon, end, suffix = '', label, inView }) => {
  const value = useCountUp(end, inView);
  return (
    <div className="ds-stat">
      <div className="ds-stat-icon">{icon}</div>
      <p className="ds-stat-value">{value.toLocaleString()}{suffix}</p>
      <p className="ds-stat-label">{label}</p>
    </div>
  );
};

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      ref={ref}
      className={`ds-reveal ${inView ? 'in-view' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, 0.3);

  const API_URL = 'http://localhost:5000/api';

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
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        :root {
          --indigo: #3E3A9E;
          --indigo-light: #5B57C2;
          --coral: #FF6B6B;
          --coral-soft: #FFE8E8;
          --cream: #FCFBF9;
          --cream-2: #F6F3FF;
          --surface: #FFFFFF;
          --ink: #181430;
          --text-dim: #4B4870;
          --text-muted: #8C88AD;
          --border: #E9E6F4;
          --border-strong: #D2CCE9;
          --glow: rgba(62, 58, 158, 0.3);
          --shadow-sm: 0 2px 10px rgba(24, 20, 48, 0.06);
          --shadow-md: 0 12px 32px -6px rgba(24, 20, 48, 0.14);
          --shadow-lg: 0 26px 60px -12px rgba(24, 20, 48, 0.18);
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ds-home {
          background: var(--cream);
          color: var(--text-dim);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .ds-home a { text-decoration: none; }

        .ds-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s var(--ease), transform 0.8s var(--ease);
        }
        .ds-reveal.in-view { opacity: 1; transform: translateY(0); }

        /* ═══════════════ HERO ═══════════════ */
        .ds-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 7rem 2rem 5rem;
          background:
            radial-gradient(ellipse 900px 520px at 80% 20%, rgba(62, 58, 158, 0.12), transparent 60%),
            radial-gradient(ellipse 600px 420px at 8% 90%, rgba(255, 107, 107, 0.10), transparent 60%),
            linear-gradient(180deg, #EFECFB 0%, var(--cream) 100%);
        }

        .ds-hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(62, 58, 158, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(62, 58, 158, 0.05) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 75% 70% at 55% 40%, black 35%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse 75% 70% at 55% 40%, black 35%, transparent 78%);
          pointer-events: none;
        }

        .ds-hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }
        .ds-hero-glow-1 { width: 460px; height: 460px; background: rgba(62, 58, 158, 0.16); top: -140px; left: -120px; }
        .ds-hero-glow-2 { width: 380px; height: 380px; background: rgba(255, 107, 107, 0.16); bottom: -120px; right: 8%; }

        .ds-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1240px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 3.5rem;
          align-items: center;
        }

        .ds-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 1.1rem;
          border-radius: 100px;
          border: 1px solid rgba(62, 58, 158, 0.3);
          background: var(--surface);
          box-shadow: var(--shadow-sm);
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--indigo);
          margin-bottom: 1.75rem;
          animation: heroFadeDown 0.8s var(--ease) 0.1s both;
        }
        .ds-hero-badge .dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--indigo);
          box-shadow: 0 0 0 4px rgba(62, 58, 158, 0.14);
          animation: pulseDot 2s ease-in-out infinite;
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .ds-hero-title {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(2.5rem, 5.2vw, 4.2rem);
          line-height: 1.08;
          letter-spacing: -0.02em;
          margin: 0 0 1.5rem;
          color: var(--ink);
          animation: heroFadeDown 0.8s var(--ease) 0.22s both;
        }
        .ds-hero-title .grad {
          background: linear-gradient(100deg, var(--indigo) 0%, var(--coral) 110%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        .ds-hero-title .underline {
          position: relative;
          white-space: nowrap;
        }
        .ds-hero-title .underline::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0.06em;
          height: 0.13em;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--indigo), transparent 85%);
          opacity: 0.35;
        }

        .ds-hero-sub {
          font-size: 1.08rem;
          line-height: 1.7;
          color: var(--text-dim);
          max-width: 520px;
          margin: 0 0 2.25rem;
          animation: heroFadeDown 0.8s var(--ease) 0.34s both;
        }

        .ds-hero-btns {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 2.75rem;
          animation: heroFadeDown 0.8s var(--ease) 0.46s both;
        }

        .ds-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
          padding: 1rem 2.1rem;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), background 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .ds-btn svg { transition: transform 0.2s var(--ease); }
        .ds-btn:hover svg { transform: translateX(4px); }

        .ds-btn-primary {
          background: linear-gradient(135deg, var(--indigo) 0%, var(--indigo-light) 100%);
          color: #fff;
          box-shadow: 0 10px 30px rgba(62, 58, 158, 0.35);
        }
        .ds-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 42px rgba(62, 58, 158, 0.45); }

        .ds-btn-ghost {
          background: var(--surface);
          color: var(--ink);
          border: 1px solid var(--border-strong);
          box-shadow: var(--shadow-sm);
        }
        .ds-btn-ghost:hover { transform: translateY(-3px); border-color: var(--indigo); color: var(--indigo); box-shadow: var(--shadow-md); }

        .ds-hero-proof {
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: heroFadeDown 0.8s var(--ease) 0.58s both;
        }
        .ds-avatar-stack { display: flex; }
        .ds-avatar-stack span {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 2px solid var(--surface);
          margin-left: -10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 700; color: #fff;
          background: linear-gradient(135deg, var(--indigo), var(--indigo-light));
          box-shadow: 0 2px 8px rgba(24,20,48,0.14);
        }
        .ds-avatar-stack span:first-child { margin-left: 0; }
        .ds-avatar-stack span:nth-child(2) { background: linear-gradient(135deg, #FF5A5A, #FF8A8A); }
        .ds-avatar-stack span:nth-child(3) { background: linear-gradient(135deg, #6D28D9, #8B5CF6); }
        .ds-avatar-stack span:nth-child(4) { background: linear-gradient(135deg, #DB2777, #F472B6); }
        .ds-hero-proof p { margin: 0; font-size: 0.82rem; color: var(--text-muted); }
        .ds-hero-proof strong { color: var(--ink); }
        .ds-hero-proof .stars { color: var(--coral); letter-spacing: 2px; font-size: 0.8rem; }

        /* Hero product showcase (CSS, no 3D) */
        .ds-hero-visual {
          position: relative;
          animation: heroFadeUp 1s var(--ease) 0.3s both;
        }
        .ds-hero-visual::before {
          content: '';
          position: absolute;
          inset: 10% 6%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(62, 58, 158, 0.16), transparent 65%);
          filter: blur(40px);
          z-index: 0;
        }

        .ds-showcase {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.25fr 1fr;
          gap: 1rem;
        }
        .ds-showcase-main {
          position: relative;
          border-radius: 26px;
          overflow: hidden;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          background: #fff;
        }
        .ds-showcase-main img {
          width: 100%;
          height: 380px;
          object-fit: cover;
          display: block;
        }
        .ds-showcase-tag {
          position: absolute;
          top: 1rem; left: 1rem;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(6px);
          padding: 0.4rem 0.9rem;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--indigo);
          box-shadow: var(--shadow-sm);
        }
        .ds-showcase-card {
          position: absolute;
          left: 1rem; right: 1rem; bottom: 1rem;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 1.1rem 1.2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 12px 34px rgba(24, 20, 48, 0.16);
        }
        .ds-showcase-card strong { font-size: 1rem; color: var(--ink); display: block; margin-bottom: 0.15rem; }
        .ds-showcase-card small { font-size: 0.75rem; color: var(--text-muted); }
        .ds-showcase-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--coral);
        }

        .ds-showcase-side {
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 1rem;
        }
        .ds-showcase-mini {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 0.9rem;
          box-shadow: var(--shadow-md);
          transition: transform 0.25s var(--ease), box-shadow 0.25s;
        }
        .ds-showcase-mini:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .ds-showcase-mini img {
          width: 62px; height: 62px;
          border-radius: 13px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .ds-showcase-mini strong { font-size: 0.85rem; color: var(--ink); display: block; margin-bottom: 0.2rem; }
        .ds-showcase-mini small { font-size: 0.8rem; color: var(--coral); font-weight: 700; }

        .ds-float-chip {
          position: absolute;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.75rem 1.1rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: var(--shadow-md);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--ink);
          animation: floatY 5s ease-in-out infinite;
        }
        .ds-float-chip .chip-icon {
          width: 32px; height: 32px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #fff;
        }
        .ds-float-chip small { display: block; color: var(--text-muted); font-size: 0.66rem; font-weight: 500; }
        .chip-1 { top: 8%; left: -20px; animation-delay: 0s; }
        .chip-2 { bottom: 10%; right: -14px; animation-delay: 1.4s; }
        .chip-3 { top: 38%; right: -24px; animation-delay: 2.6s; }
        .chip-green { background: linear-gradient(135deg, #16A34A, #22C55E); box-shadow: 0 0 16px rgba(34,197,94,0.35); }
        .chip-coral { background: linear-gradient(135deg, #FF6B6B, #FF9A9A); box-shadow: 0 0 16px rgba(255,107,107,0.4); }
        .chip-blue { background: linear-gradient(135deg, var(--indigo), var(--indigo-light)); box-shadow: 0 0 16px rgba(62,58,158,0.4); }

        @keyframes heroFadeDown {
          from { opacity: 0; transform: translateY(-18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* ═══════════════ MARQUEE ═══════════════ */
        .ds-marquee {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          padding: 1.1rem 0;
          overflow: hidden;
          position: relative;
        }
        .ds-marquee::before, .ds-marquee::after {
          content: '';
          position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2;
          pointer-events: none;
        }
        .ds-marquee::before { left: 0; background: linear-gradient(90deg, var(--surface), transparent); }
        .ds-marquee::after { right: 0; background: linear-gradient(-90deg, var(--surface), transparent); }
        .ds-marquee-track {
          display: flex;
          gap: 3.5rem;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .ds-marquee:hover .ds-marquee-track { animation-play-state: paused; }
        .ds-marquee-track span {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: var(--border-strong);
          white-space: nowrap;
          transition: color 0.3s;
        }
        .ds-marquee-track span svg { color: var(--indigo-light); }
        .ds-marquee-track span:hover { color: var(--indigo); }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* ═══════════════ SECTION SHELL ═══════════════ */
        .ds-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 6rem 2rem;
        }
        .ds-section-head {
          max-width: 620px;
          margin-bottom: 3.5rem;
        }
        .ds-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--indigo);
          margin-bottom: 1rem;
        }
        .ds-eyebrow::before {
          content: '';
          width: 26px; height: 2px;
          background: linear-gradient(90deg, var(--indigo), var(--coral));
          border-radius: 2px;
        }
        .ds-section-title {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(1.85rem, 3.2vw, 2.6rem);
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 1rem;
          color: var(--ink);
        }
        .ds-section-title .grad {
          background: linear-gradient(100deg, var(--indigo), var(--coral));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ds-section-sub {
          font-size: 1rem;
          color: var(--text-dim);
          line-height: 1.65;
          margin: 0;
        }

        /* ═══════════════ STATS ═══════════════ */
        .ds-stats-band {
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .ds-stats {
          max-width: 1240px;
          margin: 0 auto;
          padding: 3.5rem 2rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        .ds-stat { text-align: center; }
        .ds-stat-icon {
          width: 54px; height: 54px;
          margin: 0 auto 1rem;
          border-radius: 16px;
          background: #EDEBFB;
          border: 1px solid rgba(62, 58, 158, 0.16);
          display: flex; align-items: center; justify-content: center;
          color: var(--indigo);
        }
        .ds-stat-value {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: var(--ink);
          margin: 0 0 0.2rem;
          line-height: 1;
        }
        .ds-stat-label { font-size: 0.8rem; color: var(--text-muted); margin: 0; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }

        /* ═══════════════ CATEGORIES ═══════════════ */
        .ds-cat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.1rem;
        }
        .ds-cat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.15rem 1.3rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          transition: transform 0.25s var(--ease), border-color 0.25s, box-shadow 0.25s;
          color: var(--ink);
        }
        .ds-cat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(62, 58, 158, 0.4);
          box-shadow: var(--shadow-md);
        }
        .ds-cat-icon {
          width: 46px; height: 46px;
          flex-shrink: 0;
          border-radius: 14px;
          background: #EDEBFB;
          display: flex; align-items: center; justify-content: center;
          color: var(--indigo);
          font-size: 1.3rem;
        }
        .ds-cat-card strong { font-size: 0.95rem; font-weight: 700; display: block; margin-bottom: 0.15rem; }
        .ds-cat-card small { font-size: 0.75rem; color: var(--text-muted); }
        .ds-cat-card .arrow { margin-left: auto; color: var(--text-muted); transition: transform 0.25s, color 0.25s; }
        .ds-cat-card:hover .arrow { transform: translateX(4px); color: var(--indigo); }

        /* ═══════════════ PRODUCTS ═══════════════ */
        .ds-prod-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .ds-prod-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 0.9rem;
          cursor: pointer;
          transition: transform 0.3s var(--ease), box-shadow 0.3s, border-color 0.3s;
          display: flex;
          flex-direction: column;
        }
        .ds-prod-card:hover {
          transform: translateY(-8px);
          border-color: transparent;
          box-shadow: var(--shadow-lg);
        }
        .ds-prod-img-wrap {
          position: relative;
          height: 200px;
          border-radius: 16px;
          overflow: hidden;
          background: #EFEDFB;
          margin-bottom: 1.1rem;
        }
        .ds-prod-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s var(--ease);
        }
        .ds-prod-card:hover .ds-prod-img-wrap img { transform: scale(1.06); }
        .ds-prod-badge {
          position: absolute;
          top: 0.8rem; left: 0.8rem;
          z-index: 2;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(6px);
          color: var(--indigo);
          font-size: 0.64rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.32rem 0.7rem;
          border-radius: 50px;
          box-shadow: var(--shadow-sm);
        }
        .ds-prod-info { display: flex; flex-direction: column; flex: 1; padding: 0 0.2rem; }
        .ds-prod-shop {
          display: flex; align-items: center; gap: 0.35rem;
          font-size: 0.73rem; color: var(--text-muted); margin-bottom: 0.4rem;
        }
        .ds-prod-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.08rem; font-weight: 700;
          color: var(--ink);
          margin: 0 0 0.75rem;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ds-prod-footer {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: auto;
          padding-top: 0.9rem;
          border-top: 1px solid var(--border);
        }
        .ds-prod-price { font-size: 1.25rem; font-weight: 800; color: var(--coral); }
        .ds-prod-price small { font-size: 0.72rem; color: var(--text-muted); font-weight: 500; }
        .ds-prod-add {
          width: 38px; height: 38px;
          border-radius: 12px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--indigo);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.25s var(--ease);
        }
        .ds-prod-card:hover .ds-prod-add {
          background: linear-gradient(135deg, var(--indigo), var(--indigo-light));
          border-color: transparent;
          color: #fff;
          box-shadow: 0 8px 20px rgba(62, 58, 158, 0.35);
        }

        .ds-skeleton {
          background: linear-gradient(90deg, #ECEBF7 25%, #E0DEF1 50%, #ECEBF7 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .ds-view-all {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          margin-top: 2.75rem;
          padding: 0.95rem 1.9rem;
          border-radius: 14px;
          border: 1px solid var(--border-strong);
          color: var(--indigo);
          font-weight: 600;
          font-size: 0.9rem;
          background: var(--surface);
          transition: all 0.25s var(--ease);
        }
        .ds-view-all:hover { border-color: var(--indigo); transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .ds-center { text-align: center; }

        /* ═══════════════ HOW IT WORKS ═══════════════ */
        .ds-steps-bg {
          background:
            radial-gradient(ellipse 800px 400px at 50% 0%, rgba(62, 58, 158, 0.06), transparent 60%),
            var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .ds-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .ds-step {
          position: relative;
          padding: 2.2rem 1.8rem;
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 24px;
          transition: transform 0.3s var(--ease), border-color 0.3s, box-shadow 0.3s;
          overflow: hidden;
        }
        .ds-step:hover { transform: translateY(-6px); border-color: rgba(62,58,158,0.35); box-shadow: var(--shadow-md); }
        .ds-step-num {
          position: absolute;
          top: 0.5rem; right: 1.4rem;
          font-family: 'Playfair Display', serif;
          font-size: 4.5rem;
          font-weight: 800;
          color: #E3E0F5;
          line-height: 1;
          pointer-events: none;
        }
        .ds-step-icon {
          width: 52px; height: 52px;
          border-radius: 15px;
          background: linear-gradient(135deg, var(--indigo), var(--indigo-light));
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          margin-bottom: 1.4rem;
          box-shadow: 0 10px 26px rgba(62, 58, 158, 0.3);
        }
        .ds-step h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 0.6rem;
          color: var(--ink);
        }
        .ds-step p { font-size: 0.92rem; color: var(--text-dim); line-height: 1.65; margin: 0; }

        /* ═══════════════ FEATURES ═══════════════ */
        .ds-feature-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr 1fr;
          grid-template-rows: auto auto;
          gap: 1.5rem;
        }
        .ds-feature {
          padding: 2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          transition: transform 0.3s var(--ease), border-color 0.3s, box-shadow 0.3s;
        }
        .ds-feature:hover { transform: translateY(-5px); border-color: rgba(62,58,158,0.3); box-shadow: var(--shadow-md); }
        .ds-feature-featured { grid-row: span 2; }
        .ds-feature-icon {
          width: 46px; height: 46px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.3rem;
        }
        .ds-feature-icon.tint-1 { background: #EDEBFB; color: var(--indigo); }
        .ds-feature-icon.tint-2 { background: #FFE9E9; color: var(--coral); }
        .ds-feature-icon.tint-3 { background: #F0EBFF; color: #7C3AED; }
        .ds-feature h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 0.6rem;
          color: var(--ink);
        }
        .ds-feature p { font-size: 0.92rem; color: var(--text-dim); line-height: 1.65; margin: 0; }
        .ds-feature-featured .ds-feature-big {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--indigo);
          margin: 1.2rem 0 0.6rem;
          line-height: 1.25;
        }
        .ds-feature-list { list-style: none; margin: 1.4rem 0 0; padding: 0; }
        .ds-feature-list li {
          display: flex; align-items: center; gap: 0.6rem;
          font-size: 0.9rem; color: var(--text-dim);
          padding: 0.55rem 0;
          border-top: 1px solid var(--border);
        }
        .ds-feature-list li svg { color: var(--indigo); flex-shrink: 0; }

        /* ═══════════════ TESTIMONIALS ═══════════════ */
        .ds-testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .ds-testi {
          padding: 2rem 1.9rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s var(--ease), box-shadow 0.3s;
        }
        .ds-testi:hover { transform: translateY(-5px); box-shadow: var(--shadow-md); }
        .ds-testi-stars { color: var(--coral); letter-spacing: 3px; font-size: 0.85rem; margin-bottom: 1.1rem; }
        .ds-testi p.quote {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          line-height: 1.65;
          color: var(--ink);
          margin: 0 0 1.6rem;
          flex: 1;
        }
        .ds-testi-author { display: flex; align-items: center; gap: 0.85rem; }
        .ds-testi-author .av {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 700; font-size: 0.9rem;
        }
        .ds-testi-author .av.a1 { background: linear-gradient(135deg, var(--indigo), var(--indigo-light)); }
        .ds-testi-author .av.a2 { background: linear-gradient(135deg, #BE185D, #F472B6); }
        .ds-testi-author .av.a3 { background: linear-gradient(135deg, #FF6B6B, #FF9A9A); }
        .ds-testi-author strong { display: block; font-size: 0.9rem; color: var(--ink); }
        .ds-testi-author small { color: var(--text-muted); font-size: 0.75rem; }

        /* ═══════════════ CTA ═══════════════ */
        .ds-cta-wrap { padding: 0 2rem; }
        .ds-cta {
          max-width: 1240px;
          margin: 0 auto 6rem;
          position: relative;
          overflow: hidden;
          border-radius: 32px;
          padding: 4.5rem 3rem;
          text-align: center;
          color: #fff;
          background:
            radial-gradient(ellipse 500px 260px at 20% 20%, rgba(255, 154, 154, 0.28), transparent 60%),
            radial-gradient(ellipse 500px 260px at 80% 80%, rgba(62, 58, 158, 0.4), transparent 60%),
            linear-gradient(135deg, #241F6E 0%, #3E3A9E 100%);
          box-shadow: 0 30px 80px rgba(62, 58, 158, 0.45);
        }
        .ds-cta::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(ellipse at center, black, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, black, transparent 75%);
        }
        .ds-cta h2 {
          position: relative; z-index: 1;
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.9rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 auto 1rem;
          max-width: 640px;
        }
        .ds-cta h2 .grad {
          background: linear-gradient(100deg, #FFB3B3, #FF8A8A);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .ds-cta p {
          position: relative; z-index: 1;
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.05rem;
          max-width: 480px;
          margin: 0 auto 2.2rem;
        }
        .ds-cta-btns {
          position: relative; z-index: 1;
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
        }
        .ds-cta .ds-btn-primary {
          background: #fff;
          color: #3E3A9E;
          box-shadow: 0 12px 34px rgba(0, 0, 0, 0.2);
        }
        .ds-cta .ds-btn-primary:hover { box-shadow: 0 16px 44px rgba(0, 0, 0, 0.28); }
        .ds-cta .ds-btn-ghost {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
          color: #fff;
          box-shadow: none;
        }
        .ds-cta .ds-btn-ghost:hover { background: rgba(255, 255, 255, 0.2); border-color: #fff; color: #fff; }

        /* ═══════════════ FOOTER ═══════════════ */
        .ds-footer {
          background: #181430;
          padding: 4.5rem 2rem 2.5rem;
        }
        .ds-footer-top {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
          gap: 3rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .ds-footer-brand .logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #fff;
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.1rem;
        }
        .ds-footer-brand .logo span { color: var(--coral); }
        .ds-footer-brand p { color: #8C88AD; font-size: 0.9rem; line-height: 1.7; max-width: 320px; margin: 0 0 1.5rem; }
        .ds-socials { display: flex; gap: 0.7rem; }
        .ds-socials a {
          width: 38px; height: 38px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          display: flex; align-items: center; justify-content: center;
          color: #8C88AD;
          transition: all 0.25s var(--ease);
        }
        .ds-socials a:hover { background: var(--indigo); border-color: var(--indigo); color: #fff; transform: translateY(-3px); box-shadow: 0 10px 22px rgba(62,58,158,0.3); }
        .ds-footer h5 {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: #fff;
          margin: 0 0 1.3rem;
        }
        .ds-footer-col a {
          display: block;
          color: #8C88AD;
          font-size: 0.9rem;
          padding: 0.38rem 0;
          transition: color 0.2s, transform 0.2s;
        }
        .ds-footer-col a:hover { color: var(--coral); transform: translateX(4px); }
        .ds-footer-note { font-size: 0.8rem; color: #8C88AD; line-height: 1.7; }
        .ds-footer-note a { color: var(--coral); }
        .ds-footer-bottom {
          max-width: 1240px;
          margin: 0 auto;
          padding-top: 1.8rem;
          display: flex; justify-content: space-between; align-items: center;
          gap: 1rem; flex-wrap: wrap;
          font-size: 0.8rem; color: #6E6A93;
        }
        .ds-footer-bottom .made { display: flex; align-items: center; gap: 0.4rem; }
        .ds-footer-bottom .made svg { color: #FF8A8A; }

        /* ═══════════════ RESPONSIVE ═══════════════ */
        @media (max-width: 1080px) {
          .ds-hero-inner { grid-template-columns: 1fr; text-align: center; gap: 4rem; }
          .ds-hero-sub { margin-left: auto; margin-right: auto; }
          .ds-hero-btns, .ds-hero-proof { justify-content: center; }
          .ds-hero-visual { max-width: 640px; margin: 0 auto; }
          .ds-hero { padding-top: 8rem; }
          .ds-cat-grid { grid-template-columns: repeat(2, 1fr); }
          .ds-prod-grid { grid-template-columns: repeat(2, 1fr); }
          .ds-feature-grid { grid-template-columns: 1fr 1fr; }
          .ds-feature-featured { grid-row: auto; grid-column: span 2; }
        }

        @media (max-width: 860px) {
          .ds-stats { grid-template-columns: repeat(2, 1fr); gap: 2.5rem 1rem; }
          .ds-steps, .ds-testi-grid { grid-template-columns: 1fr; }
          .ds-footer-top { grid-template-columns: 1fr 1fr; }
        }

        @media (max-width: 600px) {
          .ds-hero { padding: 6rem 1.25rem 4rem; }
          .ds-section { padding: 4rem 1.25rem; }
          .ds-cat-grid, .ds-prod-grid, .ds-feature-grid { grid-template-columns: 1fr; }
          .ds-feature-featured { grid-column: auto; }
          .ds-showcase { grid-template-columns: 1fr; }
          .ds-showcase-side { grid-template-rows: none; grid-template-columns: 1fr 1fr; }
          .ds-showcase-main img { height: 280px; }
          .chip-1 { left: 0; }
          .chip-2, .chip-3 { right: 0; }
          .ds-cta { padding: 3.5rem 1.5rem; margin-bottom: 4rem; }
          .ds-footer-top { grid-template-columns: 1fr; gap: 2.5rem; }
          .ds-footer-bottom { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="ds-home">

        {/* ─────────────── HERO ─────────────── */}
        <section className="ds-hero">
          <div className="ds-hero-grid" />
          <div className="ds-hero-glow ds-hero-glow-1" />
          <div className="ds-hero-glow ds-hero-glow-2" />

          <div className="ds-hero-inner">
            <div>
              <span className="ds-hero-badge">
                <span className="dot" />
                Local Commerce, Digitally Bridged
              </span>
              <h1 className="ds-hero-title">
                Your Neighborhood Shops,{' '}
                <span className="underline">One Dukaan</span>
                <br />
                <span className="grad">Setu Away.</span>
              </h1>
              <p className="ds-hero-sub">
                DukaanSetu connects trusted brick-and-mortar stores with modern
                shoppers. Browse real neighborhood inventory, order in seconds,
                and keep local economies thriving — all from one platform.
              </p>

              <div className="ds-hero-btns">
                <Link to="/signup" className="ds-btn ds-btn-primary">
                  Shop Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </Link>
                <Link to="/signup" className="ds-btn ds-btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Start Selling
                </Link>
              </div>

              <div className="ds-hero-proof">
                <div className="ds-avatar-stack">
                  <span>R</span><span>S</span><span>P</span><span>M</span>
                </div>
                <p>
                  <span className="stars">★★★★★</span><br />
                  Trusted by <strong>2,000+ shopkeepers</strong> &amp; shoppers
                </p>
              </div>
            </div>

            <div className="ds-hero-visual">
              <div className="ds-showcase">
                <div className="ds-showcase-main">
                  <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop" alt="Fresh grocery basket" />
                  <span className="ds-showcase-tag">From your kirana store</span>
                  <div className="ds-showcase-card">
                    <span>
                      <strong>Fresh Grocery Basket</strong>
                      <small>Green Market · Pune</small>
                    </span>
                    <span className="ds-showcase-price">₹249</span>
                  </div>
                </div>
                <div className="ds-showcase-side">
                  <div className="ds-showcase-mini">
                    <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop" alt="Spices" />
                    <span>
                      <strong>Masala Combo</strong>
                      <small>₹120</small>
                    </span>
                  </div>
                  <div className="ds-showcase-mini">
                    <img src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&auto=format&fit=crop" alt="Fresh dairy" />
                    <span>
                      <strong>Daily Dairy Pack</strong>
                      <small>₹85</small>
                    </span>
                  </div>
                </div>
              </div>

              <div className="ds-float-chip chip-1">
                <span className="chip-icon chip-green">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span><small>Order Delivered</small><b>Just now</b></span>
              </div>

              <div className="ds-float-chip chip-2">
                <span className="chip-icon chip-coral">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </span>
                <span><small>Customer Rating</small><b>4.9 / 5</b></span>
              </div>

              <div className="ds-float-chip chip-3">
                <span className="chip-icon chip-blue">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="5 12 3 12 3 20 15 20 15 12 19 12"/><path d="M3 12v-3h18v3"/><path d="M13 9V4H5v5"/></svg>
                </span>
                <span><small>Delivery</small><b>Under 30 min</b></span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── MARQUEE ─────────────── */}
        <div className="ds-marquee">
          <div className="ds-marquee-track">
            {[0, 1].map((rep) => (
              <React.Fragment key={rep}>
                {['Kirana & Grocery', 'Pharmacy & Wellness', 'Electronics', 'Fresh Produce', 'Stationery', 'Fashion & Apparel', 'Home Essentials', 'Local Bakeries'].map((item) => (
                  <span key={`${rep}-${item}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    {item}
                  </span>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ─────────────── STATS ─────────────── */}
        <div className="ds-stats-band">
          <div className="ds-stats" ref={statsRef}>
            <Stat
              inView={statsInView}
              end={2000}
              suffix="+"
              label="Local Shopkeepers"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            />
            <Stat
              inView={statsInView}
              end={15000}
              suffix="+"
              label="Products Listed"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
            />
            <Stat
              inView={statsInView}
              end={85000}
              suffix="+"
              label="Orders Fulfilled"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
            />
            <Stat
              inView={statsInView}
              end={40}
              suffix="+"
              label="Cities Served"
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
            />
          </div>
        </div>

        {/* ─────────────── CATEGORIES ─────────────── */}
        <section className="ds-section">
          <Reveal>
            <div className="ds-section-head">
              <span className="ds-eyebrow">Browse By Category</span>
              <h2 className="ds-section-title">Everything Your <span className="grad">Neighborhood</span> Needs</h2>
              <p className="ds-section-sub">From daily essentials to specialty finds — discover what local shops near you have in stock.</p>
            </div>
          </Reveal>

          <div className="ds-cat-grid">
            {[
              { icon: '🛒', name: 'Kirana & Grocery', count: 'Daily essentials' },
              { icon: '💊', name: 'Pharmacy', count: 'Wellness & health' },
              { icon: '🔌', name: 'Electronics', count: 'Gadgets & more' },
              { icon: '🥦', name: 'Fresh Produce', count: 'Farm to table' },
              { icon: '📚', name: 'Stationery', count: 'Study & office' },
              { icon: '👕', name: 'Fashion', count: 'Apparel & styles' },
              { icon: '🏠', name: 'Home Essentials', count: 'Everyday comfort' },
              { icon: '🥖', name: 'Bakeries', count: 'Baked fresh daily' }
            ].map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <Link to="/customer" className="ds-cat-card">
                  <span className="ds-cat-icon">{c.icon}</span>
                  <span>
                    <strong>{c.name}</strong>
                    <small>{c.count}</small>
                  </span>
                  <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─────────────── FEATURED PRODUCTS ─────────────── */}
        <section className="ds-section" style={{ paddingTop: 0 }}>
          <Reveal>
            <div className="ds-section-head">
              <span className="ds-eyebrow">Fresh From Local Shops</span>
              <h2 className="ds-section-title">Verified Merchants, <span className="grad">Live Inventory</span></h2>
              <p className="ds-section-sub">Real stock, real prices, real neighborhood sellers. These listings update the moment a shopkeeper posts them.</p>
            </div>
          </Reveal>

          {loading ? (
            <div className="ds-prod-grid">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="ds-prod-card" style={{ cursor: 'default' }}>
                  <div className="ds-prod-img-wrap ds-skeleton" style={{ border: 'none' }} />
                  <div className="ds-skeleton" style={{ height: '1.1rem', width: '75%', marginBottom: '0.6rem' }} />
                  <div className="ds-skeleton" style={{ height: '0.8rem', width: '45%', marginBottom: '1.4rem' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="ds-skeleton" style={{ height: '1.4rem', width: '30%' }} />
                    <div className="ds-skeleton" style={{ height: '38px', width: '38px', borderRadius: '12px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              background: 'var(--surface)',
              borderRadius: '24px', border: '1px dashed var(--border-strong)'
            }}>
              <p style={{ color: 'var(--text-dim)', margin: 0, fontSize: '0.95rem' }}>
                No live inventory in your location yet — be the first shop to go live!
              </p>
            </div>
          ) : (
            <div className="ds-prod-grid">
              {products.map((prod, i) => (
                <Reveal key={prod._id} delay={(i % 4) * 70}>
                  <Link to="/customer" className="ds-prod-card">
                    <div className="ds-prod-img-wrap">
                      <span className="ds-prod-badge">{prod.category || 'Local'}</span>
                      <img src={prod.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop'} alt={prod.name} loading="lazy" />
                    </div>
                    <div className="ds-prod-info">
                      <span className="ds-prod-shop">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                        {prod.shopkeeperId?.name || 'Local Merchant'}
                      </span>
                      <h4 className="ds-prod-name">{prod.name}</h4>
                      <div className="ds-prod-footer">
                        <span className="ds-prod-price"><small>₹</small>{prod.price}</span>
                        <span className="ds-prod-add">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          <div className="ds-center">
            <Link to="/customer" className="ds-view-all">
              View Full Catalog
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </section>

        {/* ─────────────── HOW IT WORKS ─────────────── */}
        <div className="ds-steps-bg">
          <section className="ds-section">
            <Reveal>
              <div className="ds-section-head">
                <span className="ds-eyebrow">How It Works</span>
                <h2 className="ds-section-title">Local Commerce, <span className="grad">Made Effortless</span></h2>
                <p className="ds-section-sub">Three simple steps connect shoppers with the shops they already trust.</p>
              </div>
            </Reveal>

            <div className="ds-steps">
              {[
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
                  title: 'Create Your Free Account',
                  desc: 'Sign up in under a minute as a shopper or shopkeeper. Verify your role and you are ready to explore the local marketplace.'
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
                  title: 'Browse & Order Instantly',
                  desc: 'Search real neighborhood inventory, filter by price, category and location, and check out with a single tap.'
                },
                {
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
                  title: 'Track Until Your Doorstep',
                  desc: 'Follow order status live as your shopkeeper packs and dispatches. Rate your experience and help your neighborhood grow.'
                }
              ].map((s, i) => (
                <Reveal key={s.title} delay={i * 120}>
                  <div className="ds-step">
                    <span className="ds-step-num">0{i + 1}</span>
                    <div className="ds-step-icon">{s.icon}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* ─────────────── FEATURES ─────────────── */}
        <section className="ds-section">
          <Reveal>
            <div className="ds-section-head">
              <span className="ds-eyebrow">Built For Everyone</span>
              <h2 className="ds-section-title">A Complete <span className="grad">Commerce Ecosystem</span></h2>
              <p className="ds-section-sub">Purpose-built tools for every side of the local economy.</p>
            </div>
          </Reveal>

          <div className="ds-feature-grid">
            <Reveal className="ds-feature ds-feature-featured">
              <div className="ds-feature-icon tint-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span className="ds-eyebrow">For Shopkeepers</span>
              <h3>Grow Your Dukaan With Real Tools</h3>
              <p className="ds-feature-big">List once. Sell to your whole neighborhood. Watch sales roll in.</p>
              <p>Take your trusted physical store online with a dashboard built for busy shop owners — no technical knowledge needed.</p>
              <ul className="ds-feature-list">
                <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>One-tap product listing with AI-generated descriptions</li>
                <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Live order alerts with delivery status tracking</li>
                <li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Real-time profit, sales and inventory analytics</li>
              </ul>
            </Reveal>

            <Reveal delay={100} className="ds-feature">
              <div className="ds-feature-icon tint-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
              <h3>Smart Discovery</h3>
              <p>Filter by category, price, and location to find exactly what your neighborhood offers — fast.</p>
            </Reveal>

            <Reveal delay={180} className="ds-feature">
              <div className="ds-feature-icon tint-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3>Secure Transactions</h3>
              <p>Every order and payment is protected end-to-end, keeping both shoppers and sellers safe.</p>
            </Reveal>

            <Reveal delay={140} className="ds-feature">
              <div className="ds-feature-icon tint-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <h3>Trusted Reviews</h3>
              <p>Honest feedback from real customers helps every shop build a reputation worth shopping with.</p>
            </Reveal>

            <Reveal delay={220} className="ds-feature">
              <div className="ds-feature-icon tint-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="3" y1="20" x2="21" y2="20"/></svg>
              </div>
              <h3>Platform Analytics</h3>
              <p>Admins get a live pulse on sales, popular products and growth across the entire marketplace.</p>
            </Reveal>
          </div>
        </section>

        {/* ─────────────── TESTIMONIALS ─────────────── */}
        <section className="ds-section" style={{ paddingTop: 0 }}>
          <Reveal>
            <div className="ds-section-head">
              <span className="ds-eyebrow">Loved By The Community</span>
              <h2 className="ds-section-title">Shopkeepers &amp; Shoppers <span className="grad">Share The Love</span></h2>
            </div>
          </Reveal>

          <div className="ds-testi-grid">
            {[
              {
                av: 'a1', initial: 'R',
                name: 'Ramesh Gupta', role: 'Kirana Store Owner, Pune',
                quote: 'My regulars used to call me for delivery. Now they order through DukaanSetu and I get every order notified instantly. Business has grown 3x in six months.'
              },
              {
                av: 'a2', initial: 'P',
                name: 'Priya Sharma', role: 'Customer, Delhi',
                quote: 'I can finally buy fresh groceries from the shop I trust, without leaving home. The tracking is so smooth and delivery is always on time.'
              },
              {
                av: 'a3', initial: 'A',
                name: 'Arun Verma', role: 'Electronics Shop Owner, Jaipur',
                quote: 'The dashboard shows me exactly what is selling. I restock smarter and my profit analytics are crystal clear. This is the future of local retail.'
              }
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="ds-testi">
                  <div className="ds-testi-stars">★★★★★</div>
                  <p className="quote">"{t.quote}"</p>
                  <div className="ds-testi-author">
                    <span className={`av ${t.av}`}>{t.initial}</span>
                    <span>
                      <strong>{t.name}</strong>
                      <small>{t.role}</small>
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─────────────── CTA ─────────────── */}
        <div className="ds-cta-wrap">
          <Reveal>
            <div className="ds-cta">
              <h2>Ready to bring your <span className="grad">dukaan online?</span></h2>
              <p>Join the movement connecting local shops with modern shoppers — free to start, forever local.</p>
              <div className="ds-cta-btns">
                <Link to="/signup" className="ds-btn ds-btn-primary">
                  Get Started Free
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
                <Link to="/login" className="ds-btn ds-btn-ghost">Sign In To Your Store</Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ─────────────── FOOTER ─────────────── */}
        <footer className="ds-footer">
          <div className="ds-footer-top">
            <div className="ds-footer-brand">
              <Link to="/" className="logo">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M19 7H16V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1Zm-9-1a2 2 0 0 1 4 0v1h-4Zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2Z" fill="#FF6B6B"/>
                </svg>
                Dukaan<span>Setu</span>
              </Link>
              <p>The digital bridge between neighborhood shopkeepers and modern shoppers. Built for local economies, powered by trust.</p>
              <div className="ds-socials">
                <a href="#" aria-label="Twitter"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23 4.8a10 10 0 0 1-2.8.8 4.9 4.9 0 0 0 2.2-2.7 10 10 0 0 1-3.1 1.2 4.9 4.9 0 0 0-8.4 4.5A13.9 13.9 0 0 1 1.6 3.5a4.9 4.9 0 0 0 1.5 6.5 4.9 4.9 0 0 1-2.2-.6v.1a4.9 4.9 0 0 0 3.9 4.8 4.9 4.9 0 0 1-2.2.1 4.9 4.9 0 0 0 4.6 3.4A9.8 9.8 0 0 1 0 19.6 13.9 13.9 0 0 0 7.5 21.5c9.1 0 14-7.5 14-14v-.6A10 10 0 0 0 23 4.8z"/></svg></a>
                <a href="#" aria-label="Instagram"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
                <a href="#" aria-label="LinkedIn"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.4h-3.5v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.5V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.1 2.3 4.1 5.3v6.3zM5.2 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zM7 20.4H3.5V9H7v11.4zM21.6 0H2.4A2.4 2.4 0 0 0 0 2.4v19.2A2.4 2.4 0 0 0 2.4 24h19.2a2.4 2.4 0 0 0 2.4-2.4V2.4A2.4 2.4 0 0 0 21.6 0z"/></svg></a>
                <a href="#" aria-label="YouTube"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12c0 2 .2 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.3-1.9.5-3.8.5-5.8s-.2-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg></a>
              </div>
            </div>

            <div className="ds-footer-col">
              <h5>Platform</h5>
              <Link to="/customer">Marketplace</Link>
              <Link to="/signup">Start Selling</Link>
              <Link to="/login">Shopkeeper Portal</Link>
              <Link to="/login">Admin Console</Link>
            </div>

            <div className="ds-footer-col">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">How It Works</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>

            <div className="ds-footer-col">
              <h5>Get In Touch</h5>
              <p className="ds-footer-note">
                Have a question or want to onboard your store? We reply within 24 hours.
                <br /><br />
                <a href="mailto:hello@dukaansetu.in">hello@dukaansetu.in</a>
              </p>
            </div>
          </div>

          <div className="ds-footer-bottom">
            <p>© 2026 DukaanSetu Networks. All rights reserved.</p>
            <span className="made">
              Made with
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
              for local economies
            </span>
          </div>
        </footer>

      </div>
    </>
  );
};

export default Home;
