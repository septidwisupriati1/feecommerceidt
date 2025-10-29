import { useState } from 'react'
import { TagIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function AdminCategories() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories] = useState([
    { id: 1, name: 'Electronics', slug: 'electronics', productCount: 245, status: 'Active', createdAt: '2024-01-10' },
    { id: 2, name: 'Fashion', slug: 'fashion', productCount: 532, status: 'Active', createdAt: '2024-01-12' },
    { id: 3, name: 'Home & Living', slug: 'home-living', productCount: 189, status: 'Active', createdAt: '2024-01-15' },
    { id: 4, name: 'Sports', slug: 'sports', productCount: 156, status: 'Active', createdAt: '2024-01-18' },
    { id: 5, name: 'Books', slug: 'books', productCount: 423, status: 'Active', createdAt: '2024-01-20' },
    { id: 6, name: 'Toys', slug: 'toys', productCount: 98, status: 'Inactive', createdAt: '2024-02-01' },
  ])

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Kelola Kategori</h1>
        <button className="btn btn-primary">+ Tambah Kategori</button>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <TagIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{categories.length}</div>
            <div className="dashboard-stat-label">Total Kategori</div>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <TagIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{categories.filter(c => c.status === 'Active').length}</div>
            <div className="dashboard-stat-label">Kategori Aktif</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="products-search" style={{ marginTop: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem', width: '100%', padding: '.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }}
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="products-table-container" style={{ marginTop: '1.5rem' }}>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Kategori</th>
              <th>Slug</th>
              <th>Jumlah Produk</th>
              <th>Status</th>
              <th>Dibuat Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td><code style={{ background: '#f3f4f6', padding: '.25rem .5rem', borderRadius: '.25rem', fontSize: '.85rem' }}>{category.slug}</code></td>
                <td>{category.productCount}</td>
                <td>
                  <span className={`badge ${category.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                    {category.status}
                  </span>
                </td>
                <td>{category.createdAt}</td>
                <td>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn-icon-action">
                      <PencilIcon style={{ width: '18px', height: '18px' }} />
                    </button>
                    <button className="btn-icon-action delete">
                      <TrashIcon style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
