import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()

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
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" aria-label="TalentHub">
          <span className="logo" aria-hidden="true" />
          <span>TalentHub</span>
        </Link>

        <div className="nav-center">
          <nav className="menu" aria-label="Primary">
            <NavLink to="/" end>Beranda</NavLink>
            <NavLink to="/products">Katalog</NavLink>
          </nav>
        </div>

        <div className="nav-right">
          <button className="lang" aria-haspopup="listbox" aria-expanded="false">IND ▾</button>
          {isAuthenticated ? (
            <Link to="/account" className="user" aria-label="Profil" style={{ textDecoration: 'none' }}>
              {user?.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user?.name || 'User'} 
                  className="avatar"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <span className="avatar" aria-hidden="true" />
              )}
              <span>{user?.name || 'User'}</span>
            </Link>
          ) : (
            <Link to="/login" className="btn-login" aria-label="Masuk">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
              </svg>
              <span>Masuk</span>
            </Link>
          )}
          <button className="hamburger" aria-label="Menu" aria-controls="mobile-menu" aria-expanded={open} onClick={() => setOpen(v=>!v)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div id="mobile-menu" className={`mm-panel ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="mm-content">
          <div className="mm-header">
            <span className="brand" style={{gap:'.5rem'}}>
              <span className="logo" aria-hidden="true" />
              <span>TalentHub</span>
            </span>
            <button className="hamburger" aria-label="Tutup" onClick={() => setOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <nav className="mm-menu" aria-label="Menu mobile">
            <NavLink to="/" end>Beranda</NavLink>
            <NavLink to="/products">Katalog</NavLink>
          </nav>
          <div className="mm-footer">
            <button className="lang">IND ▾</button>
            {isAuthenticated ? (
              <div className="user">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user?.name || 'User'} 
                    className="avatar"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <span className="avatar" aria-hidden="true" />
                )}
                <span>{user?.name || 'User'}</span>
              </div>
            ) : (
              <div className="user">
                <span className="avatar" aria-hidden="true" />
                <span>Guest</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
