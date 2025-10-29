import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/Navbar.css";

export default function TalentNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change and on ESC
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  return (
    <div className="navbar tn-gradient">
      <div className="nav-logo" aria-label="TalentHub">
        <img src="/logo-stp.svg" alt="TalentHub" />
      </div>

      <div className="tn-center">
        <nav className="tn-menu" aria-label="Menu utama">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/training">Pelatihan Elektronik</NavLink>
          <NavLink to="/talent">Pusat Bakat</NavLink>
          <NavLink to="/products">Perdagangan Elektronik</NavLink>
          <NavLink to="/metaverse">Metaverse</NavLink>
          <NavLink to="/more">Lainnya</NavLink>
          <NavLink to="/account">Profil</NavLink>
        </nav>
      </div>

      <button className="tn-hamburger" aria-label="Menu" aria-expanded={open} aria-controls="tn-mobile" onClick={() => setOpen(v=>!v)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#193F7A"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
      </button>

      <div id="tn-mobile" className={`tn-panel ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="tn-content">
          <div className="tn-header">
            <div className="nav-logo"><img src="/logo-stp.svg" alt="Logo" /></div>
            <button className="tn-hamburger" aria-label="Tutup" onClick={() => setOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="#193F7A"><path d="M6 6l12 12M18 6L6 18"/></svg>
            </button>
          </div>
          <nav className="tn-menu tn-menu-mobile">
            <NavLink to="/" end>Beranda</NavLink>
            <NavLink to="/training">Pelatihan Elektronik</NavLink>
            <NavLink to="/talent">Pusat Bakat</NavLink>
            <NavLink to="/products">Perdagangan Elektronik</NavLink>
            <NavLink to="/metaverse">Metaverse</NavLink>
            <NavLink to="/more">Lainnya</NavLink>
            <NavLink to="/account">Profil</NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
}
