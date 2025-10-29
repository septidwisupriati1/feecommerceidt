import ProductCard from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import { useState } from 'react'

export default function Products() {
  const { products } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  // Extract unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))]

  // Filter products
  const filtered = products.filter(p => {
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory
    const matchMin = !minPrice || p.price >= parseFloat(minPrice)
    const matchMax = !maxPrice || p.price <= parseFloat(maxPrice)
    return matchSearch && matchCategory && matchMin && matchMax
  })

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="container">
        {/* Search Bar Section */}
        <div className="catalog-search">
          <input
            type="text"
            placeholder="Masukkan Kata Kunci"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="catalog-search-input"
          />
          <button className="catalog-search-btn">Cari</button>
        </div>

        {/* Main Layout: Sidebar + Products */}
        <div className="catalog-layout">
          {/* Sidebar Filters */}
          <aside className="catalog-sidebar">
            <div className="filter-section">
              <h3 className="filter-title">Kategori</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">Semua Kategori</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <h3 className="filter-title">Harga</h3>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Harga Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="price-input"
                />
                <input
                  type="number"
                  placeholder="Harga Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="price-input"
                />
              </div>
              <button
                className="filter-apply-btn"
                onClick={() => {/* Filters already applied via state */}}
              >
                Filter
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="catalog-products">
            <div className="products-grid">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                Tidak ada produk yang cocok dengan filter Anda.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
