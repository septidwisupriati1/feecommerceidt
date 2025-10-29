import { 
  UsersIcon, 
  CubeIcon, 
  StarIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  return (
    <div className="seller-dashboard">
      <h1 className="page-title">Dashboard Admin</h1>
      
      <div className="dashboard-stats">
        {/* Total Users */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <UsersIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">1,234</div>
            <div className="dashboard-stat-label">Total Users</div>
          </div>
        </div>

        {/* Total Products */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <CubeIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">856</div>
            <div className="dashboard-stat-label">Total Products</div>
          </div>
        </div>

        {/* Total Reviews */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <StarIcon strokeWidth={2} />
          </div>
          <div className="dashboard-stat-info">
            <div className="dashboard-stat-value">4,567</div>
            <div className="dashboard-stat-label">Total Reviews</div>
          </div>
        </div>
      </div>
    </div>
  )
}
