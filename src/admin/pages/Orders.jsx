import { useState } from 'react'
import { ShoppingCartIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline'

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [orders] = useState([
    { id: 1, customer: 'John Doe', product: 'Laptop Gaming', total: 'Rp 15.000.000', status: 'Delivered', date: '2024-10-20' },
    { id: 2, customer: 'Jane Smith', product: 'Smartphone', total: 'Rp 8.000.000', status: 'Shipped', date: '2024-10-22' },
    { id: 3, customer: 'Bob Wilson', product: 'T-Shirt', total: 'Rp 150.000', status: 'Processing', date: '2024-10-25' },
    { id: 4, customer: 'Alice Brown', product: 'Running Shoes', total: 'Rp 1.200.000', status: 'Pending', date: '2024-10-27' },
  ])

  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Manage Orders</h1>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <ShoppingCartIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{orders.length}</div>
            <div className="dashboard-stat-label">Total Orders</div>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <ShoppingCartIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{orders.filter(o => o.status === 'Pending').length}</div>
            <div className="dashboard-stat-label">Pending Orders</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="products-search" style={{ marginTop: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem', width: '100%', padding: '.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="products-table-container" style={{ marginTop: '1.5rem' }}>
        <table className="products-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.total}</td>
                <td>
                  <span className={`badge ${
                    order.status === 'Delivered' ? 'badge-success' : 
                    order.status === 'Shipped' ? 'badge-primary' : 
                    order.status === 'Processing' ? 'badge-warning' : 
                    'badge-secondary'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.date}</td>
                <td>
                  <button className="btn-icon-action">
                    <EyeIcon style={{ width: '18px', height: '18px' }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
