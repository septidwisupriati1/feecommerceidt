import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, MessageCircle, Bell, User, Search, Clock } from "lucide-react";
import { isAuthenticated, clearAuth } from "../utils/auth";
import { useCart } from "../context/CartContext";
import { getUnreadCount } from "../services/notificationAPI";
import chatAPI from "../services/chatAPI";
import styles from "./BuyerNavbar.module.css";

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const HISTORY_KEY = 'buyer-search-history';

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

  // Fetch unread chat messages count
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (!isAuthenticated()) {
        setUnreadMessages(0);
        return;
      }
      try {
        const res = await chatAPI.getConversations();
        if (res.success && Array.isArray(res.data)) {
          const total = res.data.reduce(
            (sum, conv) => sum + (conv.unread_count ?? conv.unreadCount ?? 0),
            0
          );
          setUnreadMessages(total);
        } else {
          setUnreadMessages(0);
        }
      } catch (error) {
        console.error('Error fetching unread chat count:', error);
        setUnreadMessages(0);
      }
    };

    fetchUnreadMessages();
    const interval = setInterval(fetchUnreadMessages, 15000);
    const handler = () => fetchUnreadMessages();
    window.addEventListener('chatUnreadCountChanged', handler);

    return () => {
      clearInterval(interval);
      window.removeEventListener('chatUnreadCountChanged', handler);
    };
  }, []);

  // Sync search box with query param `q`
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || "";
    setSearchTerm(q);
  }, [location.search]);

  // Load search history once
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) setSearchHistory(JSON.parse(saved));
    } catch (err) {
      console.warn('Search history read error', err);
    }
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredHistory = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return searchHistory;
    return searchHistory.filter(item => item.toLowerCase().includes(q));
  }, [searchHistory, searchTerm]);

  const limitedHistory = useMemo(() => filteredHistory.slice(0, 5), [filteredHistory]);

  const removeHistoryItem = (value) => {
    setSearchHistory((prev) => {
      const next = prev.filter((item) => item !== value);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      try {
        const next = [trimmed, ...searchHistory.filter(i => i !== trimmed)].slice(0, 8);
        setSearchHistory(next);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch (err) {
        console.warn('Search history save error', err);
      }
    }
    navigate(trimmed ? `/produk?q=${encodeURIComponent(trimmed)}` : '/produk');
    setShowSuggestions(false);
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

        {/* Search in Navbar */}
        <div className={styles.searchWrapper} ref={searchRef}>
          <form className={styles.navbarSearch} onSubmit={handleSearchSubmit}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Cari produk"
              value={searchTerm}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              className={styles.searchInput}
              autoComplete="off"
            />
          </form>

          {showSuggestions && filteredHistory.length > 0 && (
            <div className={styles.searchDropdown}>
              <div className={styles.searchDropdownHeader}>
                <span className={styles.searchDropdownLabel}><Clock className={styles.dropdownIcon} /> Riwayat pencarian</span>
                <button
                  type="button"
                  className={styles.clearHistory}
                  onClick={() => {
                    setSearchHistory([]);
                    localStorage.removeItem(HISTORY_KEY);
                  }}
                >
                  Hapus
                </button>
              </div>
              <div className={styles.searchHistoryList}>
                {limitedHistory.map((item) => (
                  <div key={item} className={styles.searchHistoryRow}>
                    <button
                      type="button"
                      className={styles.searchHistoryItem}
                      onClick={() => {
                        setSearchTerm(item);
                        navigate(`/produk?q=${encodeURIComponent(item)}`);
                        setShowSuggestions(false);
                      }}
                    >
                      {item}
                    </button>
                    <button
                      type="button"
                      className={styles.deleteHistory}
                      aria-label={`Hapus ${item}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeHistoryItem(item);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setOpen(false);
  };

  const confirmLogout = () => {
    clearAuth();
    setShowLogoutConfirm(false);
    navigate('/login', { replace: true, state: { fromLogout: true } });
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
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
          <button className={styles.dropdownItem} onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      )}

      {showLogoutConfirm && createPortal(
        <div className={styles.logoutOverlay} onClick={cancelLogout}>
          <div className={styles.logoutModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.logoutHeader}>
              <div>
                <h3>Konfirmasi Logout</h3>
                <p>Anda akan keluar dari akun buyer.</p>
              </div>
              <button
                className={styles.logoutClose}
                aria-label="Tutup"
                onClick={cancelLogout}
              >
                ×
              </button>
            </div>
            <div className={styles.logoutActions}>
              <button
                className={styles.logoutCancel}
                onClick={cancelLogout}
              >
                Batal
              </button>
              <button
                className={styles.logoutConfirm}
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
