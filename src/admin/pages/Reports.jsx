import { 
  ChartBarIcon, 
  BanknotesIcon, 
  ShoppingCartIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

export default function AdminReports() {
  const reports = {
    sales: {
      today: 'Rp 12.500.000',
      thisMonth: 'Rp 350.000.000',
      lastMonth: 'Rp 320.000.000',
      growth: '+9.4%'
    },
    orders: {
      today: 45,
      thisMonth: 1234,
      lastMonth: 1150,
      growth: '+7.3%'
    },
    users: {
      today: 12,
      thisMonth: 345,
      lastMonth: 298,
      growth: '+15.8%'
    },
    products: {
      total: 856,
      active: 789,
      inactive: 67,
      outOfStock: 23
    }
  }

  return (
    <div className="seller-products-page">
      <div className="products-header">
        <h1>Laporan</h1>
        <button className="btn btn-primary">Download Laporan</button>
      </div>

      {/* Sales Report */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Laporan Penjualan</h2>
        <div className="products-stats">
          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <BanknotesIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.sales.today}</div>
              <div className="dashboard-stat-label">Penjualan Hari Ini</div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <BanknotesIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.sales.thisMonth}</div>
              <div className="dashboard-stat-label">Penjualan Bulan Ini</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem', marginTop: '.5rem' }}>
                <ArrowTrendingUpIcon style={{ width: '16px', height: '16px', color: '#4ade80' }} />
                <span style={{ fontSize: '.875rem', color: '#4ade80', fontWeight: 600 }}>{reports.sales.growth}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <BanknotesIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.sales.lastMonth}</div>
              <div className="dashboard-stat-label">Penjualan Bulan Lalu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Report */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Laporan Pesanan</h2>
        <div className="products-stats">
          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <ShoppingCartIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.orders.today}</div>
              <div className="dashboard-stat-label">Pesanan Hari Ini</div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <ShoppingCartIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.orders.thisMonth}</div>
              <div className="dashboard-stat-label">Pesanan Bulan Ini</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem', marginTop: '.5rem' }}>
                <ArrowTrendingUpIcon style={{ width: '16px', height: '16px', color: '#4ade80' }} />
                <span style={{ fontSize: '.875rem', color: '#4ade80', fontWeight: 600 }}>{reports.orders.growth}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <ShoppingCartIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.orders.lastMonth}</div>
              <div className="dashboard-stat-label">Pesanan Bulan Lalu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Report */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Laporan Pengguna</h2>
        <div className="products-stats">
          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <UsersIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.users.today}</div>
              <div className="dashboard-stat-label">Pengguna Baru Hari Ini</div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <UsersIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.users.thisMonth}</div>
              <div className="dashboard-stat-label">Pengguna Baru Bulan Ini</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem', marginTop: '.5rem' }}>
                <ArrowTrendingUpIcon style={{ width: '16px', height: '16px', color: '#4ade80' }} />
                <span style={{ fontSize: '.875rem', color: '#4ade80', fontWeight: 600 }}>{reports.users.growth}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <UsersIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.users.lastMonth}</div>
              <div className="dashboard-stat-label">Pengguna Baru Bulan Lalu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Summary */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#1f2937' }}>Ringkasan Produk</h2>
        <div className="products-stats">
          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <ChartBarIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.products.total}</div>
              <div className="dashboard-stat-label">Total Produk</div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <ChartBarIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.products.active}</div>
              <div className="dashboard-stat-label">Produk Aktif</div>
            </div>
          </div>

          <div className="dashboard-stat-card dashboard-stat-card-darkblue">
            <div className="dashboard-stat-icon">
              <ChartBarIcon strokeWidth={2} />
            </div>
            <div className="dashboard-stat-info">
              <div className="dashboard-stat-value">{reports.products.outOfStock}</div>
              <div className="dashboard-stat-label">Stok Habis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
