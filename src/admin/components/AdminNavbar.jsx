import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminNavbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [profileName, setProfileName] = useState('Admin')
  const location = useLocation()

  // Load profile name from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      try {
        const profileData = JSON.parse(storedProfile)
        setProfileName(profileData.namaLengkap || 'Admin')
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
          setProfileName(profileData.namaLengkap || 'Admin')
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
        <Link to="/admin" className="brand" aria-label="TalentHub Admin">
          <span className="logo" aria-hidden="true" />
          <span>TalentHub</span>
          <span style={{fontSize:'.75rem', color:'#6b7280', fontWeight:500, marginLeft:'.25rem'}}>Admin</span>
        </Link>

        <div className="nav-center">
          <nav className="menu admin-menu" aria-label="Primary">
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/accounts">Kelola Akun</NavLink>
            <NavLink to="/admin/categories">Kategori</NavLink>
            <NavLink to="/admin/reports">Laporan</NavLink>
            <NavLink to="/admin/terms">Syarat & Ketentuan</NavLink>
            <NavLink to="/admin/privacy">Kebijakan Privasi</NavLink>
            <NavLink to="/admin/faq">FAQ</NavLink>
          </nav>
        </div>

        <div className="nav-right">
          <button className="lang" aria-haspopup="listbox" aria-expanded="false">IND ▾</button>
          
          <Link to="/admin/settings" className="user" aria-label="Profil" style={{ textDecoration: 'none' }}>
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
              <span>TalentHub Admin</span>
            </div>
            <button onClick={() => setOpen(false)} style={{background:'transparent',border:'none',cursor:'pointer'}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mm-menu" aria-label="Mobile menu">
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/accounts">Kelola Akun</NavLink>
            <NavLink to="/admin/categories">Kategori</NavLink>
            <NavLink to="/admin/reports">Laporan</NavLink>
            <NavLink to="/admin/terms">Syarat & Ketentuan</NavLink>
            <NavLink to="/admin/privacy">Kebijakan Privasi</NavLink>
            <NavLink to="/admin/faq">FAQ</NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}
