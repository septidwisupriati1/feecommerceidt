import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function SellerNavbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [location.pathname])
  
  // Lock scroll and add Esc to close
  useEffect(() => {
    if (open) {
      const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
    }
  }, [open])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/seller" className="brand" aria-label="Seller Dashboard">
          <span className="logo" aria-hidden="true" />
          <span>Seller Dashboard</span>
        </Link>

        <div className="nav-center">
          <nav className="menu" aria-label="Seller Menu">
            <NavLink to="/seller" end>Beranda</NavLink>
            <NavLink to="/seller/my-products">Produk Saya</NavLink>
            <NavLink to="/seller/sold-products">Produk Terjual</NavLink>
            <NavLink to="/seller/balance">Saldo Penjualan</NavLink>
            <NavLink to="/seller/orders">Pesanan</NavLink>
            <NavLink to="/seller/reviews">Ulasan</NavLink>
            <NavLink to="/seller/settings">Pengaturan</NavLink>
            <NavLink to="/seller/terms">S&K</NavLink>
            <NavLink to="/seller/faq">FAQ</NavLink>
          </nav>
        </div>

        <div className="nav-right">
          <button className="lang" aria-haspopup="listbox" aria-expanded="false">IND ▾</button>
          
          <div className="user" style={{ textDecoration: 'none' }}>
            <div className="avatar" style={{ 
              backgroundImage: user?.avatar ? `url(${user.avatar})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
            <span style={{ fontWeight: 600, fontSize: '.95rem' }}>{user?.name || 'Seller'}</span>
          </div>

          <button 
            onClick={handleLogout}
            className="btn"
            style={{padding:'.5rem 1rem', fontSize:'.9rem'}}
          >
            Keluar
          </button>

          <button 
            className="hamburger" 
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mm-panel ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
        <div className="mm-content" onClick={(e) => e.stopPropagation()}>
          <div className="mm-header">
            <span style={{fontWeight:700, fontSize:'1.1rem'}}>Menu Seller</span>
            <button 
              onClick={() => setOpen(false)}
              style={{
                background:'transparent',
                border:'none',
                cursor:'pointer',
                padding:'.4rem',
                color:'inherit'
              }}
              aria-label="Tutup menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mm-menu">
            <NavLink to="/seller" end>Beranda</NavLink>
            <NavLink to="/seller/my-products">Produk Saya</NavLink>
            <NavLink to="/seller/sold-products">Produk Terjual</NavLink>
            <NavLink to="/seller/balance">Saldo Penjualan</NavLink>
            <NavLink to="/seller/orders">Pesanan</NavLink>
            <NavLink to="/seller/reviews">Ulasan</NavLink>
            <NavLink to="/seller/settings">Pengaturan</NavLink>
            <NavLink to="/seller/terms">Syarat & Ketentuan</NavLink>
            <NavLink to="/seller/faq">FAQ</NavLink>
          </div>
          <div className="mm-footer">
            <span style={{fontSize:'.9rem'}}>{user?.name || 'Seller'}</span>
            <button 
              onClick={handleLogout}
              className="btn"
              style={{padding:'.5rem 1rem', fontSize:'.9rem'}}
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
