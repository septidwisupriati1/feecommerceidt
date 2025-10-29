import { useState } from 'react'
import { CubeIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products] = useState([
    { id: 1, name: 'Laptop Gaming', seller: 'Tech Store', category: 'Electronics', price: 'Rp 15.000.000', stock: 25, status: 'Active' },
    { id: 2, name: 'Smartphone', seller: 'Mobile Shop', category: 'Electronics', price: 'Rp 8.000.000', stock: 50, status: 'Active' },
    { id: 3, name: 'T-Shirt', seller: 'Fashion Store', category: 'Clothing', price: 'Rp 150.000', stock: 100, status: 'Active' },
    { id: 4, name: 'Running Shoes', seller: 'Sport Shop', category: 'Sports', price: 'Rp 1.200.000', stock: 0, status: 'Out of Stock' },
  ])

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.seller.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Manage Products</h1>
        <button className="btn btn-primary">+ Add Product</button>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <CubeIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{products.length}</div>
            <div className="dashboard-stat-label">Total Products</div>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <CubeIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{products.filter(p => p.status === 'Active').length}</div>
            <div className="dashboard-stat-label">Active Products</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="products-search" style={{ marginTop: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem', width: '100%', padding: '.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container" style={{ marginTop: '1.5rem' }}>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Seller</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.seller}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`badge ${product.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn-icon-action">
                      <EyeIcon style={{ width: '18px', height: '18px' }} />
                    </button>
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
