import { StarIcon, CubeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'

export default function SellerDashboard(){
  return (
    <div className="seller-dashboard">
      <div className="dashboard-stats">
        {/* Ulasan Produk Card - Dark Blue */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <StarIcon />
          </div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-value">Rp. 0</div>
            <div className="dashboard-stat-label">Ulasan Produk</div>
          </div>
        </div>

        {/* Products Card - Dark Blue */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <CubeIcon />
          </div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-value">10</div>
            <div className="dashboard-stat-label">Products</div>
          </div>
        </div>

        {/* Sold Products Card - Dark Blue */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <ShoppingCartIcon />
          </div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-value">30</div>
            <div className="dashboard-stat-label">Sold Products</div>
          </div>
        </div>
      </div>
    </div>
  )
}
