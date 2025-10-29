export default function SellerReviews() {
  const reviews = [
    {
      id: 1,
      product: 'Sepatu Sneakers Putih',
      buyer: 'Ahmad Fauzi',
      rating: 5,
      comment: 'Barang bagus, sesuai deskripsi. Packing rapi dan pengiriman cepat!',
      date: '22 Okt 2025',
      avatar: '👨'
    },
    {
      id: 2,
      product: 'Tas Ransel Laptop',
      buyer: 'Siti Nurhaliza',
      rating: 4,
      comment: 'Kualitas oke, tapi warna sedikit berbeda dari foto. Overall recommended.',
      date: '21 Okt 2025',
      avatar: '👩'
    },
    {
      id: 3,
      product: 'Jaket Denim Pria',
      buyer: 'Budi Santoso',
      rating: 5,
      comment: 'Mantap! Bahan tebal dan nyaman dipakai. Seller responsif.',
      date: '20 Okt 2025',
      avatar: '👨‍💼'
    },
    {
      id: 4,
      product: 'Celana Jeans Slim Fit',
      buyer: 'Dewi Lestari',
      rating: 5,
      comment: 'Ukuran pas, jahitan rapi. Puas banget belanja di sini!',
      date: '19 Okt 2025',
      avatar: '👩‍💼'
    },
    {
      id: 5,
      product: 'Kemeja Flanel Kotak',
      buyer: 'Eko Prasetyo',
      rating: 4,
      comment: 'Bagus tapi agak kekecilan. Mungkin size chart kurang akurat.',
      date: '18 Okt 2025',
      avatar: '🧑'
    },
  ]

  const stats = {
    averageRating: 4.6,
    totalReviews: reviews.length,
    fiveStar: 4,
    fourStar: 1,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0
  }

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
            {stats.averageRating}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '.25rem', marginBottom: '.5rem' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={star <= Math.round(stats.averageRating) ? '#fbbf24' : '#e5e7eb'} width="24" height="24">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '.9rem' }}>
            Dari {stats.totalReviews} ulasan
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
                  width: `${(count / stats.totalReviews) * 100}%`, 
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
