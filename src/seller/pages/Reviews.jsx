import React, { useEffect, useState } from 'react';
import sellerReviewAPI from '../../services/sellerReviewAPI';
import sellerProductAPI from '../../services/sellerProductAPI';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

export default function SellerReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get seller's products
        const prodRes = await sellerProductAPI.getProducts({ page: 1, limit: 100 });
        if (!prodRes || !prodRes.success) throw new Error(prodRes?.message || 'Gagal mengambil produk penjual');

        const products = prodRes.data?.products || prodRes.data || [];

        // For each product, fetch product reviews (public endpoint)
        const reviewsByProduct = await Promise.all(products.map(async (p) => {
          try {
            const resp = await fetch(`${API_BASE_URL}/products/${p.product_id}/reviews?page=1&limit=20`, { method: 'GET' });
            if (!resp.ok) return [];
            const json = await resp.json();
            const productFromResponse = json.data?.product || {};
            const productName = productFromResponse?.name || p.name || p.product_name || productFromResponse?.product_name || `Product ${p.product_id}`;

            return (json.data?.reviews || json.data || []).map(r => ({
              review_id: r.review_id || r.reviewId || r.id,
              product_name: productName,
              reviewer_name: r.reviewer_name || r.reviewer || r.user_fullname || r.user?.full_name || r.buyer?.name || 'Anonymous',
              reviewer_picture: r.reviewer_picture || r.reviewer?.picture || r.user?.avatar || null,
              rating: r.rating,
              review_text: r.review_text || r.comment,
              created_at: r.created_at
            }));
          } catch (e) {
            return [];
          }
        }));

        const merged = reviewsByProduct.flat();

        const mapped = merged.map(r => ({
          id: r.review_id,
          product: r.product_name,
          buyer: r.reviewer_name,
          rating: r.rating,
          comment: r.review_text,
          date: sellerReviewAPI.formatDate ? sellerReviewAPI.formatDate(r.created_at) : new Date(r.created_at).toLocaleDateString('id-ID'),
          avatar: r.reviewer_picture ? '🖼️' : ((r.reviewer_name && r.reviewer_name.charAt(0)) || '👤')
        }));

        if (mounted) setReviews(mapped);

        // Try to compute basic stats locally if server stats endpoint not available
        const total = mapped.length;
        const breakdown = [0,0,0,0,0,0];
        mapped.forEach(m => { if (m.rating >=1 && m.rating<=5) breakdown[m.rating]++; });
        if (mounted) setStats({
          averageRating: total ? (mapped.reduce((s, it) => s + (it.rating||0), 0) / total).toFixed(1) : 0,
          totalReviews: total,
          fiveStar: breakdown[5],
          fourStar: breakdown[4],
          threeStar: breakdown[3],
          twoStar: breakdown[2],
          oneStar: breakdown[1]
        });
      } catch (err) {
        console.error(err);
        if (mounted) setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Ulasan Produk</h1>

      {/* Rating Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '2rem',
          boxShadow: 'var(--shadow)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '.5rem' }}>
            {loading ? '—' : stats.averageRating}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.25rem', marginBottom: '.5rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= Math.round(stats.averageRating) ? '#fbbf24' : '#e5e7eb'} width="24" height="24">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
            Dari {loading ? '—' : stats.totalReviews} ulasan
          </div>
        </div>

        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem' }}>Detail Rating</h3>
          {[
            { stars: 5, count: stats.fiveStar },
            { stars: 4, count: stats.fourStar },
            { stars: 3, count: stats.threeStar },
            { stars: 2, count: stats.twoStar },
            { stars: 1, count: stats.oneStar },
          ].map(({ stars, count }) => (
            <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem' }}>
              <div style={{ fontSize: '.85rem', minWidth: '50px' }}>{stars} Bintang</div>
              <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${stats.totalReviews ? (count / stats.totalReviews) * 100 : 0}%`,
                  height: '100%',
                  background: '#fbbf24'
                }} />
              </div>
              <div style={{ fontSize: '.85rem', minWidth: '30px', textAlign: 'right', color: 'var(--muted)' }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div style={{
        background: 'var(--surface-strong)',
        border: '1px solid var(--border)',
        borderRadius: '.8rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Semua Ulasan</h2>

        {loading && <div style={{ padding: '1rem' }}>Memuat ulasan...</div>}
        {error && <div style={{ padding: '1rem', color: 'red' }}>Error: {error}</div>}

        <div style={{ display: 'grid', gap: '1rem' }}>
          {reviews.map(review => (
            <div key={review.id} style={{
              padding: '1.25rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '.6rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                  }}>
                    {review.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{review.buyer}</div>
                    <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{review.date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.15rem' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= review.rating ? '#fbbf24' : '#e5e7eb'} width="18" height="18">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
              </div>

              <div style={{
                padding: '.75rem',
                background: '#fff',
                borderRadius: '.5rem',
                marginBottom: '.75rem',
                border: '1px solid var(--border)'
              }}>
                <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--muted)', marginBottom: '.25rem' }}>
                  Produk: {review.product}
                </div>
              </div>

              <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.6 }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
