import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function SellerNavbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [profileName, setProfileName] = useState('Seller')
  const location = useLocation()

  // Load profile name from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      try {
        const profileData = JSON.parse(storedProfile)
        setProfileName(profileData.namaLengkap || 'Seller')
      } catch (e) {
        console.error('Error parsing profile:', e)
      }
    }
  }, [])

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const storedProfile = localStorage.getItem('userProfile')
      if (storedProfile) {
        try {
          const profileData = JSON.parse(storedProfile)
          setProfileName(profileData.namaLengkap || 'Seller')
        } catch (e) {
          console.error('Error parsing profile:', e)
        }
      }
    }

    window.addEventListener('profileUpdated', handleProfileUpdate)
    window.addEventListener('storage', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate)
      window.removeEventListener('storage', handleProfileUpdate)
    }
  }, [])

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
        <Link to="/seller" className="brand" aria-label="TalentHub Seller">
          <span className="logo" aria-hidden="true" />
          <span>TalentHub</span>
          <span style={{fontSize:'.75rem', color:'#6b7280', fontWeight:500, marginLeft:'.25rem'}}>Seller</span>
        </Link>

        <div className="nav-center">
          <nav className="menu seller-menu" aria-label="Primary">
            <NavLink to="/seller" end>Beranda</NavLink>
            <NavLink to="/seller/products">Produk Saya</NavLink>
            <NavLink to="/seller/reviews">Ulasan</NavLink>
            <NavLink to="/seller/settings">Pengaturan</NavLink>
            <NavLink to="/seller/terms">Syarat & Ketentuan</NavLink>
            <NavLink to="/seller/faq">FAQ</NavLink>
          </nav>
        </div>

        <div className="nav-right">
          <button className="lang" aria-haspopup="listbox" aria-expanded="false">IND ▾</button>
          
          <Link to="/seller/shop" className="icon-btn light" aria-label="Toko Saya" style={{ width: 'auto', padding: '.5rem .9rem', gap: '.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
            <span style={{ fontSize: '.9rem', fontWeight: 600 }}>Toko Saya</span>
          </Link>

          <Link to="/seller/settings" className="user" aria-label="Profil" style={{ textDecoration: 'none' }}>
            <div className="avatar" />
            <span>{profileName}</span>
          </Link>

          <button className="hamburger" onClick={() => setOpen(true)} aria-label="Menu">
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
            <div className="brand">
              <span className="logo" />
              <span>TalentHub Seller</span>
            </div>
            <button onClick={() => setOpen(false)} style={{background:'transparent',border:'none',cursor:'pointer'}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mm-menu" aria-label="Mobile menu">
            <NavLink to="/seller" end>Beranda</NavLink>
            <NavLink to="/seller/products">Produk Saya</NavLink>
            <NavLink to="/seller/reviews">Ulasan</NavLink>
            <NavLink to="/seller/settings">Pengaturan</NavLink>
            <NavLink to="/seller/terms">Syarat & Ketentuan</NavLink>
            <NavLink to="/seller/faq">FAQ</NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
