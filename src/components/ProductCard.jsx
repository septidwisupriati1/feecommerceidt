import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  // Badge color mapping
  const getBadgeStyle = (badge) => {
    switch(badge?.toLowerCase()) {
      case 'baru':
        return { backgroundColor: '#22c55e', color: 'white' }
      case 'preorder':
        return { backgroundColor: '#ef4444', color: 'white' }
      case 'diskon':
        return { backgroundColor: '#f59e0b', color: 'white' }
      default:
        return { backgroundColor: '#10b981', color: 'white' }
    }
  }

  return (
    <div className="product-card-modern">
      {/* Header with Logo */}
      <div className="product-card-header">
        <div className="product-card-logo">
          <img src={product.image} alt={product.title} />
        </div>
      </div>

      {/* Title and Category */}
      <div className="product-card-content">
        <h3 className="product-card-title">
          <Link to={`/products/${product.id}`}>{product.title}</Link>
        </h3>
        <div className="product-card-company">
          {product.category && (
            <span className="product-card-company-name">{product.category}</span>
          )}
          {product.badge && (
            <span className="product-card-badge-verified" style={getBadgeStyle(product.badge)}>
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Meta Info */}
      <div className="product-card-meta">
        <div className="product-card-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span>Jakarta</span>
        </div>
        <div className="product-card-meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span>Stok: {product.stock || 100}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="product-card-tags">
        <span className="product-card-tag">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
          </svg>
          Rp {product.price.toLocaleString('id-ID')}
        </span>
        <span className="product-card-tag">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="14" height="14">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
          4.5 / 5
        </span>
      </div>

      {/* Footer */}
      <div className="product-card-footer">
        <div className="product-card-time">
          <span>Terjual {Math.floor(Math.random() * 1000)}</span>
        </div>
        <Link to={`/products/${product.id}`} className="product-card-btn">
          Lihat Detail
        </Link>
      </div>
    </div>
  )
}
