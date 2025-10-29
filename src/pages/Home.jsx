import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from '../components/ProductCard.jsx'

export default function Home() {
  const { products } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('all')

  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map(p => p.category))]

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="hero-home">
        <div className="hero-content">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>
            Selamat datang di E-Shop
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '2rem' }}>
            Temukan produk favoritmu dengan harga terbaik.
          </p>

          {/* Search Bar */}
          <div className="hero-search">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="hero-search-select"
            >
              <option value="all">Semua Kategori</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="hero-search-btn">Cari</button>
          </div>

          <Link className="btn-cta" to="/products">Belanja Sekarang</Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '3rem 1rem', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center', color: '#1e293b' }}>
            PROMO & DISKON
          </h2>
          <div className="products-grid">
            {products.slice(0, 6).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
