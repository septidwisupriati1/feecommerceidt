import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, MessageCircle, Bell, User, Search, Clock } from "lucide-react";
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
              placeholder="Cari produk, kategori..."
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
  };

  const confirmLogout = () => {
    clearAuth();
    setOpen(false);
    setShowLogoutConfirm(false);
    navigate('/login');
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
        (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Logout</h3>
                  <p className="text-sm text-gray-600 mt-1">Anda akan keluar dari akun.</p>
                </div>
                <button
                  onClick={cancelLogout}
                  className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={cancelLogout}
                  className="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ),
        document.body
      )}
    </div>
  );
}
