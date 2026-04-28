import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackMonitoring = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/reviews/shopkeeper', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const reversed = reviews.slice().reverse();

  // Compute average rating
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));

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
          --star-gold: #F59E0B;
          --star-empty: #DDD0C4;
        }

        .ds-fb-root {
          min-height: 100vh;
          background: var(--cream);
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem 4rem;
          position: relative;
        }
        .ds-fb-root::before {
          content: ''; position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(232,98,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232,98,26,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .ds-fb-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

        /* Header */
        .ds-fb-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ds-fb-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.9rem; font-weight: 700;
          color: var(--deep); letter-spacing: -0.03em; margin: 0 0 0.2rem;
        }
        .ds-fb-title span { color: var(--saffron); }
        .ds-fb-subtitle { font-size: 0.85rem; color: var(--muted); margin: 0; }
        .ds-fb-badge {
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

        /* Summary row */
        .ds-summary-row {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.06s both;
        }
        @media (max-width: 640px) { .ds-summary-row { grid-template-columns: 1fr; } }

        /* Average rating card */
        .ds-avg-card {
          background: var(--card-bg);
          border-radius: 18px;
          padding: 1.75rem 1.5rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .ds-avg-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light), #FFBA6B);
        }
        .ds-avg-number {
          font-family: 'Playfair Display', serif;
          font-size: 3.2rem; font-weight: 700;
          color: var(--deep); line-height: 1; margin-bottom: 0.3rem;
        }
        .ds-avg-stars { display: flex; justify-content: center; gap: 3px; margin-bottom: 0.5rem; }
        .ds-avg-stars svg { width: 18px; height: 18px; }
        .ds-avg-label { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 500; }

        /* Rating breakdown */
        .ds-breakdown-card {
          background: var(--card-bg);
          border-radius: 18px;
          padding: 1.5rem 1.75rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          display: flex; flex-direction: column; justify-content: center; gap: 0.6rem;
        }
        .ds-breakdown-row { display: flex; align-items: center; gap: 0.75rem; }
        .ds-breakdown-label { font-size: 0.8rem; font-weight: 500; color: var(--muted); width: 28px; text-align: right; flex-shrink: 0; }
        .ds-breakdown-bar-bg {
          flex: 1; height: 7px; border-radius: 99px;
          background: #F0E8DF; overflow: hidden;
        }
        .ds-breakdown-bar {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, var(--saffron), var(--saffron-light));
          transition: width 0.6s cubic-bezier(0.22,1,0.36,1);
        }
        .ds-breakdown-count { font-size: 0.78rem; color: var(--muted); width: 22px; flex-shrink: 0; }

        /* Reviews grid */
        .ds-reviews-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.1rem;
          animation: slideUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.12s both;
        }
        @media (max-width: 680px) { .ds-reviews-grid { grid-template-columns: 1fr; } }

        /* Review card */
        .ds-review-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 1.35rem 1.4rem;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
          position: relative; overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .ds-review-card:hover { box-shadow: var(--shadow-hover); transform: translateY(-2px); }

        /* Colour accent on left edge based on rating */
        .ds-review-card::before {
          content: ''; position: absolute;
          left: 0; top: 0; bottom: 0; width: 3px;
          border-radius: 16px 0 0 16px;
        }
        .ds-review-card.r5::before, .ds-review-card.r4::before { background: linear-gradient(180deg, var(--saffron), var(--saffron-light)); }
        .ds-review-card.r3::before { background: linear-gradient(180deg, #F59E0B, #FCD34D); }
        .ds-review-card.r2::before, .ds-review-card.r1::before { background: linear-gradient(180deg, #DC2626, #F87171); }

        /* Card top row */
        .ds-review-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; }
        .ds-review-product {
          font-weight: 600; font-size: 0.9rem; color: var(--deep);
          display: flex; align-items: center; gap: 0.45rem;
        }
        .ds-review-product-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          flex-shrink: 0;
        }

        /* Stars */
        .ds-stars { display: flex; gap: 2px; flex-shrink: 0; }
        .ds-stars svg { width: 14px; height: 14px; }

        /* Quote */
        .ds-review-quote {
          font-size: 0.875rem; color: #5A4535;
          font-style: italic; line-height: 1.6;
          position: relative; padding-left: 1rem;
        }
        .ds-review-quote::before {
          content: '"';
          position: absolute; left: 0; top: -4px;
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; color: var(--saffron); opacity: 0.35;
          font-style: normal; line-height: 1;
        }

        /* Customer footer */
        .ds-review-footer {
          display: flex; align-items: center; gap: 0.6rem;
          padding-top: 0.6rem;
          border-top: 1px solid #F5EDE3;
        }
        .ds-review-avatar {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, var(--saffron), var(--saffron-light));
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
        }
        .ds-review-customer { font-size: 0.8rem; color: var(--muted); font-weight: 500; }

        /* Empty state */
        .ds-empty {
          grid-column: 1 / -1;
          padding: 4rem 1.5rem; text-align: center;
          background: var(--card-bg);
          border-radius: 18px;
          box-shadow: var(--shadow-card), 0 0 0 1px var(--border-soft);
        }
        .ds-empty-icon {
          width: 60px; height: 60px; border-radius: 18px;
          background: #F5EDE3;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
        }
        .ds-empty-icon svg { stroke: var(--muted); opacity: 0.55; }
        .ds-empty-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--deep); margin-bottom: 0.35rem; }
        .ds-empty-sub { font-size: 0.85rem; color: var(--muted); }
      `}</style>

      <div className="ds-fb-root">
        <div className="ds-fb-inner">

          {/* Header */}
          <div className="ds-fb-header">
            <div>
              <h2 className="ds-fb-title">Feedback <span>Monitoring</span></h2>
              <p className="ds-fb-subtitle">See what your customers are saying about your products</p>
            </div>
            <div className="ds-fb-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Reviews
            </div>
          </div>

          {/* Summary — only when there are reviews */}
          {reviews.length > 0 && (
            <div className="ds-summary-row">
              {/* Average score */}
              <div className="ds-avg-card">
                <p className="ds-avg-number">{avgRating}</p>
                <div className="ds-avg-stars">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} viewBox="0 0 24 24" fill={s <= Math.round(avgRating) ? 'var(--star-gold)' : 'none'} stroke={s <= Math.round(avgRating) ? 'var(--star-gold)' : 'var(--star-empty)'} strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
                <p className="ds-avg-label">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
              </div>

              {/* Rating breakdown */}
              <div className="ds-breakdown-card">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="ds-breakdown-row">
                    <span className="ds-breakdown-label">{star}★</span>
                    <div className="ds-breakdown-bar-bg">
                      <div className="ds-breakdown-bar" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }} />
                    </div>
                    <span className="ds-breakdown-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews grid */}
          <div className="ds-reviews-grid">
            {reversed.length === 0 ? (
              <div className="ds-empty">
                <div className="ds-empty-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <p className="ds-empty-title">No reviews yet</p>
                <p className="ds-empty-sub">Customer feedback will appear here once your products receive reviews.</p>
              </div>
            ) : reversed.map((r, i) => (
              <div
                key={r._id}
                className={`ds-review-card r${r.rating}`}
                style={{ animation: `slideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${0.05 + i * 0.04}s both` }}
              >
                <div className="ds-review-top">
                  <span className="ds-review-product">
                    <span className="ds-review-product-dot" />
                    Order: #{r.orderId?._id?.slice(-8).toUpperCase() || 'N/A'}
                  </span>
                  <div className="ds-stars">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} viewBox="0 0 24 24" fill={s <= r.rating ? 'var(--star-gold)' : 'none'} stroke={s <= r.rating ? 'var(--star-gold)' : 'var(--star-empty)'} strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="ds-review-quote">{r.comment}</p>

                {r.orderId?.products && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted)', background: '#FDFAF7', padding: '0.5rem', borderRadius: '8px' }}>
                    <strong>Items:</strong> {r.orderId.products.map(p => p.productId?.name || 'Item').join(', ')}
                  </div>
                )}

                <div className="ds-review-footer">
                  <div className="ds-review-avatar">{r.customerId?.name?.charAt(0).toUpperCase()}</div>
                  <span className="ds-review-customer">{r.customerId?.name}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default FeedbackMonitoring;