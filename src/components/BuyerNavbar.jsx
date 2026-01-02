import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, MessageCircle, Bell, User } from "lucide-react";
import { isAuthenticated, clearAuth } from "../utils/auth";
import { useCart } from "../context/CartContext";
import { getUnreadCount } from "../services/notificationAPI";
import styles from "./BuyerNavbar.module.css";

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Fetch unread notifications count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated()) {
        try {
          const count = await getUnreadCount();
          setUnreadNotifications(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
          setUnreadNotifications(0);
        }
      }
    };

    fetchUnreadCount();
    
    // Poll every 30 seconds for updates
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo Section */}
        <div className={styles.navbarBrand} onClick={() => navigate('/home')}>
          <img 
            src="/images/stp.png" 
            alt="E-Commerce Logo" 
            className={styles.navbarLogo}
          />
          <span className={styles.navbarTitle}>E-Commerce</span>
        </div>

        {/* Navigation Links - Center */}
        <div className={styles.navbarLinks}>
          <button 
            className={`${styles.navLink} ${isActive('/home') || isActive('/') ? styles.active : ''}`}
            onClick={() => navigate('/home')}
          >
            Beranda
          </button>
          <button 
            className={`${styles.navLink} ${isActive('/produk') ? styles.active : ''}`}
            onClick={() => navigate('/produk')}
          >
            Produk
          </button>
          <button 
            className={`${styles.navLink} ${isActive('/pesanan-saya') ? styles.active : ''}`}
            onClick={() => navigate('/pesanan-saya')}
          >
            Pesanan Saya
          </button>
        </div>

        {/* Right Side Actions */}
        <div className={styles.navbarActions}>
          {!isAuthenticated() ? (
            <>
              <button 
                className={styles.btnOutline}
                onClick={() => navigate('/login')}
              >
                Masuk
              </button>
              <button 
                className={styles.btnPrimary}
                onClick={() => navigate('/register')}
              >
                Daftar
              </button>
            </>
          ) : (
            <>
              {/* Notification Bell */}
              <div className={styles.iconButton} onClick={() => navigate('/notifikasi')}>
                <Bell className={styles.icon} />
                {unreadNotifications > 0 && (
                  <span className={styles.badge}>
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>
                )}
              </div>

              {/* Messages */}
              <div className={styles.iconButton} onClick={() => navigate('/chat')}>
                <MessageCircle className={styles.icon} />
                {unreadMessages > 0 && (
                  <span className={styles.badge}>
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </span>
                )}
              </div>

              {/* Shopping Cart */}
              <div className={styles.iconButton} onClick={() => navigate('/keranjang')}>
                <ShoppingCart className={styles.icon} />
                {cartItems.length > 0 && (
                  <span className={styles.badge}>{cartItems.length}</span>
                )}
              </div>

              {/* User Profile (dropdown) */}
              <ProfileMenu />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function ProfileMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setOpen(false);
    navigate('/login');
  };

  return (
    <div className={styles.profileWrapper} ref={menuRef}>
      <div
        className={styles.avatar}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      >
        <User className={styles.avatarIcon} />
      </div>

      {open && (
        <div className={styles.profileDropdown} onClick={(e) => e.stopPropagation()}>
          <button className={styles.dropdownItem} onClick={() => { setOpen(false); navigate('/profil'); }}>
            Profil
          </button>
          <button className={styles.dropdownItem} onClick={() => { setOpen(false); navigate('/pesanan-saya'); }}>
            Pesanan Saya
          </button>
          <button className={styles.dropdownItem} onClick={() => { setOpen(false); navigate('/wishlist'); }}>
            Wishlist
          </button>
          <div className={styles.dropdownDivider} />
          <button className={styles.dropdownItem} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
