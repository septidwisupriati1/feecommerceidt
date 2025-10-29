import { useProducts } from '../context/ProductsContext.jsx'
import { ShoppingBagIcon, CubeIcon } from '@heroicons/react/24/outline'

export default function SellerProducts(){
  const { products } = useProducts()
  
  // Calculate total stock
  const totalStock = 400 // You can calculate from products if needed

  return (
    <div className="seller-products-page">
      <div className="products-stats-cards">
        {/* Total Produk Card */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <ShoppingBagIcon />
          </div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-value">{products.length}</div>
            <div className="dashboard-stat-label">Total Produk</div>
          </div>
        </div>

        {/* Total Stok Card */}
        <div className="dashboard-stat-card dashboard-stat-card-darkblue">
          <div className="dashboard-stat-icon">
            <CubeIcon />
          </div>
          <div className="dashboard-stat-content">
            <div className="dashboard-stat-value">{totalStock}</div>
            <div className="dashboard-stat-label">Total Stok</div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="products-list-section">
        <h2>Daftar Produk</h2>
        <ul>
          {products.map(p => (
            <li key={p.id}>{p.title} - ${p.price.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
