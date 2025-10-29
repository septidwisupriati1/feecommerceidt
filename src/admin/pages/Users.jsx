import { useState } from 'react'
import { UsersIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Buyer', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Seller', status: 'Active', joinDate: '2024-02-20' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Buyer', status: 'Inactive', joinDate: '2024-03-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Seller', status: 'Active', joinDate: '2024-04-05' },
  ])

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Manage Users</h1>
        <button className="btn btn-primary">+ Add User</button>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <UsersIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{users.length}</div>
            <div className="dashboard-stat-label">Total Users</div>
          </div>
        </div>

        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <UsersIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">{users.filter(u => u.status === 'Active').length}</div>
            <div className="dashboard-stat-label">Active Users</div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="products-search" style={{ marginTop: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '3rem', width: '100%', padding: '.75rem 1rem', border: '1px solid #d1d5db', borderRadius: '.5rem' }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="products-table-container" style={{ marginTop: '1.5rem' }}>
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'Seller' ? 'badge-primary' : 'badge-secondary'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.joinDate}</td>
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
