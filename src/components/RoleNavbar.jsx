import { NavLink, Link } from 'react-router-dom'

export default function RoleNavbar({ brand = 'Panel', base='/', links = [], right = null, onLogout }){
  return (
    <header className="navbar" style={{borderRadius:0, marginTop:0}}>
      <div className="nav-inner" style={{maxWidth:'1200px',margin:'0 auto',padding:'.75rem 1rem',display:'grid',gridTemplateColumns:'auto 1fr auto',alignItems:'center',gap:'1rem'}}>
        <Link to={base} className="brand" aria-label={brand}>
          <span className="logo" aria-hidden="true" />
          <span>{brand}</span>
        </Link>
        <div style={{display:'flex',justifyContent:'center',overflowX:'auto'}}>
          <nav className="menu" aria-label={`${brand} sections`}>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
            ))}
          </nav>
        </div>
        <div className="nav-right" style={{gap:'.5rem'}}>
          <button className="icon-btn light" aria-label="Notifikasi">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="22" height="22" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>
          {right}
          {onLogout && (<button className="btn btn-ghost" onClick={onLogout}>Keluar</button>)}
        </div>
      </div>
    </header>
  )
}
