export default function SellerShop() {
  const shopData = {
    name: 'Fashion Store Jakarta',
    rating: 4.8,
    totalReviews: 245,
    totalProducts: 127,
    totalSold: 1543,
    joinDate: 'Januari 2024',
    responseRate: 98,
    responseTime: '< 1 jam',
    followers: 3420
  }

  const topProducts = [
    { id: 1, name: 'Sepatu Sneakers Putih', sold: 245, image: '👟', revenue: 110250000 },
    { id: 2, name: 'Tas Ransel Laptop', sold: 189, image: '🎒', revenue: 52920000 },
    { id: 3, name: 'Jaket Denim Pria', sold: 156, image: '🧥', revenue: 54600000 },
    { id: 4, name: 'Celana Jeans Slim Fit', sold: 142, image: '👖', revenue: 31240000 },
  ]

  return (
    <div style={{ padding: '2rem 0' }}>
      <h1 style={{ marginBottom: '2rem' }}>Toko Saya</h1>

      {/* Shop Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        borderRadius: '.8rem',
        padding: '2rem',
        marginBottom: '2rem',
        color: '#fff',
        boxShadow: '0 8px 20px rgba(59, 130, 246, .25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,.15)'
              }}>
                🏪
              </div>
              <div>
                <h2 style={{ margin: 0, marginBottom: '.5rem', fontSize: '1.8rem' }}>{shopData.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <div style={{ display: 'flex', gap: '.15rem' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= Math.round(shopData.rating) ? '#fbbf24' : '#fff'} width="18" height="18">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '.95rem', opacity: .95 }}>
                    {shopData.rating} ({shopData.totalReviews} ulasan)
                  </span>
                </div>
              </div>
            </div>
            <p style={{ margin: 0, opacity: .9, lineHeight: 1.6 }}>
              Toko fashion terpercaya sejak {shopData.joinDate}. Menjual berbagai produk fashion berkualitas dengan harga terjangkau.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', minWidth: '300px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{shopData.totalProducts}</div>
              <div style={{ fontSize: '.9rem', opacity: .9 }}>Produk</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{shopData.totalSold}</div>
              <div style={{ fontSize: '.9rem', opacity: .9 }}>Terjual</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{shopData.followers}</div>
              <div style={{ fontSize: '.9rem', opacity: .9 }}>Pengikut</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{shopData.responseRate}%</div>
              <div style={{ fontSize: '.9rem', opacity: .9 }}>Response Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Performance Stats */}
        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24" style={{ color: 'var(--primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Performa Toko
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '.6rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                <span style={{ fontSize: '.9rem', color: 'var(--muted)' }}>Response Rate</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>{shopData.responseRate}%</span>
              </div>
              <div style={{ height: '6px', background: '#e5e7eb', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${shopData.responseRate}%`, height: '100%', background: '#16a34a' }} />
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '.6rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '.9rem', color: 'var(--muted)', marginBottom: '.25rem' }}>Response Time</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>{shopData.responseTime}</div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg)', borderRadius: '.6rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '.9rem', color: 'var(--muted)', marginBottom: '.25rem' }}>Member Sejak</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{shopData.joinDate}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border)',
          borderRadius: '.8rem',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24" style={{ color: 'var(--primary)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
            </svg>
            Aksi Cepat
          </h3>

          <div style={{ display: 'grid', gap: '.75rem' }}>
            {[
              { label: 'Tambah Produk Baru', icon: '➕', link: '/seller/products' },
              { label: 'Lihat Ulasan', icon: '⭐', link: '/seller/reviews' },
              { label: 'Edit Info Toko', icon: '✏️', link: '/seller/settings' },
              { label: 'Lihat Performa', icon: '📊', link: '/seller' },
            ].map((action, idx) => (
              <a
                key={idx}
                href={action.link}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '.6rem',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  transition: 'all .2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f7ff'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg)'}
              >
                <div style={{ fontSize: '1.5rem' }}>{action.icon}</div>
                <div style={{ fontWeight: 600 }}>{action.label}</div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div style={{
        background: 'var(--surface-strong)',
        border: '1px solid var(--border)',
        borderRadius: '.8rem',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Produk Terlaris</h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {topProducts.map((product, idx) => (
            <div key={product.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, .2)'
                }}>
                  {product.image}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '.25rem' }}>#{idx + 1} {product.name}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
                    {product.sold} terjual • Rp {product.revenue.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              <div style={{
                padding: '.4rem .8rem',
                background: '#dcfce7',
                color: '#16a34a',
                borderRadius: '.5rem',
                fontSize: '.85rem',
                fontWeight: 600
              }}>
                Top {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
