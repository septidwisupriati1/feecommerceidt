import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StorePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('products')

  // Mock data toko
  const store = {
    id: 1,
    name: 'Pusat Bakat Coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    description: 'Kami menyediakan berbagai macam kopi berkualitas tinggi dari berbagai daerah di Indonesia. Produk 100% original dan fresh.',
    rating: 4.8,
    totalReviews: 234,
    totalProducts: 45,
    followers: 1200,
    joined: 'Bergabung sejak 2023',
    location: 'Jakarta, Indonesia',
    responseRate: 95,
    responseTime: '< 1 jam',
    whatsapp: '6281234567890'
  }

  // Mock products dari toko ini
  const products = [
    {
      id: 1,
      title: 'Kopi Arabica Premium',
      price: 85000,
      sold: 450,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300'
    },
    {
      id: 2,
      title: 'Kopi Robusta Original',
      price: 65000,
      sold: 320,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300'
    },
    {
      id: 3,
      title: 'Kopi Luwak Special',
      price: 250000,
      sold: 150,
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300'
    },
    {
      id: 4,
      title: 'Kopi Gayo Premium',
      price: 95000,
      sold: 280,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=300'
    },
    {
      id: 5,
      title: 'Kopi Toraja Original',
      price: 120000,
      sold: 200,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300'
    },
    {
      id: 6,
      title: 'Kopi Aceh Blend',
      price: 75000,
      sold: 350,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300'
    }
  ]

  // Mock reviews
  const reviews = [
    {
      id: 1,
      userName: 'Ahmad Rizki',
      rating: 5,
      date: '2 hari lalu',
      comment: 'Kopi nya enak banget! Pengiriman cepat dan packing rapi. Seller responsif. Recommended!',
      product: 'Kopi Arabica Premium'
    },
    {
      id: 2,
      userName: 'Siti Nurhaliza',
      rating: 5,
      date: '5 hari lalu',
      comment: 'Sudah langganan disini. Kualitas selalu terjaga dan harga reasonable.',
      product: 'Kopi Gayo Premium'
    },
    {
      id: 3,
      userName: 'Budi Santoso',
      rating: 4,
      date: '1 minggu lalu',
      comment: 'Produk original, pengiriman agak lama tapi worth it!',
      product: 'Kopi Luwak Special'
    },
    {
      id: 4,
      userName: 'Diana Putri',
      rating: 5,
      date: '2 minggu lalu',
      comment: 'Terbaik! Kopi nya fresh dan wangi. Pasti repeat order!',
      product: 'Kopi Toraja Original'
    }
  ]

  const handleContactSeller = () => {
    const message = encodeURIComponent(
      `Halo ${store.name},\n\nSaya tertarik dengan produk di toko Anda. Boleh tanya-tanya?`
    )
    window.open(`https://wa.me/${store.whatsapp}?text=${message}`, '_blank')
  }

  const handleFollowStore = () => {
    alert('Fitur follow toko akan segera tersedia!')
  }

  return (
    <div className="store-page">
      {/* Store Header */}
      <div className="store-header">
        <div className="container">
          <div className="store-header-content">
            <div className="store-info-main">
              <div className="store-avatar">
                {store.image ? (
                  <img src={store.image} alt={store.name} />
                ) : (
                  <div className="store-avatar-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 3.129 3h1.742a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1 4.14 0l1.19-1.19A1.5 1.5 0 0 1 13.51 3h1.741a1.5 1.5 0 0 1 1.061.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="store-details">
                <h1>{store.name}</h1>
                <p className="store-description">{store.description}</p>
                
                <div className="store-meta">
                  <div className="store-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    {store.location}
                  </div>
                  <div className="store-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {store.joined}
                  </div>
                </div>

                <div className="store-actions-mobile">
                  <button className="btn" onClick={handleContactSeller}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    Chat Penjual
                  </button>
                  <button className="btn-secondary" onClick={handleFollowStore}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Ikuti
                  </button>
                </div>
              </div>
            </div>

            <div className="store-stats-card">
              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-icon-small" style={{background: '#dbeafe', color: '#2563eb'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-value-small">{store.rating}</div>
                    <div className="stat-label-small">Rating</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon-small" style={{background: '#dcfce7', color: '#16a34a'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-value-small">{store.totalProducts}</div>
                    <div className="stat-label-small">Produk</div>
                  </div>
                </div>
              </div>

              <div className="stat-row">
                <div className="stat-item">
                  <div className="stat-icon-small" style={{background: '#fef3c7', color: '#d97706'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-value-small">{store.followers}</div>
                    <div className="stat-label-small">Pengikut</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon-small" style={{background: '#e9d5ff', color: '#9333ea'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="stat-value-small">{store.responseTime}</div>
                    <div className="stat-label-small">Respon</div>
                  </div>
                </div>
              </div>

              <div className="store-actions-desktop">
                <button className="btn" onClick={handleContactSeller}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                  Chat Penjual
                </button>
                <button className="btn-secondary" onClick={handleFollowStore}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Ikuti
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="store-tabs">
        <div className="container">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Produk
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Ulasan ({store.totalReviews})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="store-content">
        <div className="container">
          {activeTab === 'products' && (
            <div className="products-grid">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="product-card"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className="product-image">
                    <img src={product.image} alt={product.title} />
                  </div>
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <div className="product-price">Rp {product.price.toLocaleString('id-ID')}</div>
                    <div className="product-meta">
                      <div className="product-rating">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                        {product.rating}
                      </div>
                      <div className="product-sold">{product.sold} terjual</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="reviewer-name">{review.userName}</div>
                        <div className="review-date">{review.date}</div>
                      </div>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          width="16" 
                          height="16"
                          style={{color: i < review.rating ? '#fbbf24' : '#e5e7eb'}}
                        >
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <div className="review-product">Produk: {review.product}</div>
                  <div className="review-comment">{review.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
