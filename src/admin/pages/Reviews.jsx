import { useState } from 'react'
import { StarIcon, MagnifyingGlassIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState('')
  const [reviews] = useState([
    { id: 1, customer: 'John Doe', product: 'Laptop Gaming', rating: 5, comment: 'Excellent product!', date: '2024-10-20' },
    { id: 2, customer: 'Jane Smith', product: 'Smartphone', rating: 4, comment: 'Good quality', date: '2024-10-22' },
    { id: 3, customer: 'Bob Wilson', product: 'T-Shirt', rating: 3, comment: 'Average', date: '2024-10-25' },
    { id: 4, customer: 'Alice Brown', product: 'Running Shoes', rating: 5, comment: 'Love it!', date: '2024-10-27' },
  ])

  const filteredReviews = reviews.filter(review => 
    review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.product.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? 
        <StarSolid key={i} style={{ width: '16px', height: '16px', color: '#fbbf24' }} /> :
        <StarIcon key={i} style={{ width: '16px', height: '16px', color: '#d1d5db' }} />
    ))
  }

  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Manage Reviews</h1>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <StarIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{reviews.length}</div>
            <div className="dashboard-stat-label">Total Reviews</div>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <StarIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
            </div>
            <div className="dashboard-stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="products-search" style={{ marginTop: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem', width: '100%', padding: '.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }}
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="products-table-container" style={{ marginTop: '1.5rem' }}>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.customer}</td>
                <td>{review.product}</td>
                <td>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {renderStars(review.rating)}
                  </div>
                </td>
                <td>{review.comment}</td>
                <td>{review.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn-icon-action">
                      <EyeIcon style={{ width: '18px', height: '18px' }} />
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
