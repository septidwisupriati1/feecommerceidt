import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  ShoppingCart, 
  MessageCircle, 
  Star,
  Search,
  X,
  Package
} from "lucide-react";
import { isAuthenticated } from "../utils/auth";
import { browseProducts, getCategories } from "../services/productAPI";
import { getImageUrl } from "../utils/imageHelper";
import { useCart } from "../context/CartContext";
import BuyerNavbar from "../components/BuyerNavbar";
import CartSuccessToast from "../components/CartSuccessToast";
import { products as staticProducts } from "../data/products";
import Footer from "../components/Footer";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [cartToast, setCartToast] = useState({ show: false, message: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  const CATEGORY_CACHE_KEY = 'categories_cache_v1';

  const getLocalCategories = () => {
    const map = new Map();
    staticProducts.forEach(p => {
      if (p.category_id && p.category) {
        map.set(p.category_id, { category_id: p.category_id, name: p.category });
      }
    });
    return Array.from(map.values());
  };

  const loadCachedCategories = () => {
    try {
      const cached = JSON.parse(localStorage.getItem(CATEGORY_CACHE_KEY));
      if (Array.isArray(cached) && cached.length) return cached;
    } catch (err) {
      console.warn('Category cache parse error', err);
    }
    return null;
  };

  const saveCachedCategories = (cats) => {
    try {
      localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify(cats));
    } catch (err) {
      console.warn('Category cache save error', err);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [pagination.page, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    const localCats = getLocalCategories();
    const cachedCats = loadCachedCategories();
    if (cachedCats?.length) {
      setCategories([{ category_id: 'all', name: 'Semua' }, ...cachedCats]);
    } else {
      setCategories([{ category_id: 'all', name: 'Semua' }, ...localCats]);
    }

    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('categories-timeout')), 2000));
      const response = await Promise.race([getCategories(), timeoutPromise]);
      if (response?.success && Array.isArray(response.data)) {
        const merged = [{ category_id: 'all', name: 'Semua' }, ...response.data];
        setCategories(merged);
        saveCachedCategories(response.data);
      }
    } catch (err) {
      console.warn('Using fallback categories', err.message);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);

    // Offline fallback: gunakan data statis lokal agar ID dan gambar konsisten dengan halaman detail
    const filtered = staticProducts
      .filter(p => selectedCategory === 'all' || p.category_id === Number(selectedCategory))
      .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(filtered.length / pagination.limit));
    const currentPage = Math.min(pagination.page, totalPages);
    const start = (currentPage - 1) * pagination.limit;
    const paged = filtered.slice(start, start + pagination.limit);

    const mapped = paged.map(p => ({
      ...p,
      id: p.id,
      product_id: p.id,
      rating_average: p.rating,
      total_reviews: p.reviews,
      primary_image: p.image,
      stock: p.stock ?? 100,
      category_name: p.category,
      category: { category_id: p.category_id, name: p.category }
    }));

    setProducts(mapped);
    setPagination(prev => ({
      ...prev,
      total: filtered.length,
      totalPages,
      page: currentPage
    }));

    setLoading(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={i < fullStars ? styles.star : `${styles.star} ${styles.starEmpty}`}
        />
      );
    }
    return stars;
  };

  const handleCartClick = (product) => {
    if (!isAuthenticated()) {
      setLoginAction(`menambahkan "${product.name}" ke keranjang`);
      setShowLoginModal(true);
    } else {
      addToCart(product, 1);
      setCartToast({ show: true, message: `${product.name} berhasil masuk ke keranjang.` });
    }
  };

  const handleChatClick = (productId, productName) => {
    if (!isAuthenticated()) {
      setLoginAction(`mengirim pesan tentang "${productName}"`);
      setShowLoginModal(true);
    } else {
      // Navigate to chat
      navigate('/chat');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/produk/${productId}`);
  };

  return (
    <div className={styles.homePage}>
      {/* Navbar */}
      <BuyerNavbar />

      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Selamat Datang di E-Commerce
          </h1>
          <p className={styles.heroSubtitle}>
            Temukan produk terbaik dengan harga terjangkau
          </p>
          <div className={styles.searchBar}>
            <input 
              type="text"
              placeholder="Cari produk yang kamu inginkan..."
              className={styles.searchInput}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <Search className={styles.searchIcon} />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className={styles.productsSection}>
        <div className={styles.productsContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Produk Pilihan</h2>
            <div className={styles.filterButtons}>
              {categories.map(cat => (
                <button
                  key={cat.category_id || cat.name}
                  className={`${styles.filterBtn} ${selectedCategory === (cat.category_id?.toString() || cat.name) ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedCategory((cat.category_id || cat.name).toString());
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : products.length > 0 ? (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <div 
                  key={product.product_id} 
                  className={styles.productCard}
                >
                  <div 
                    className={styles.productImageContainer}
                    onClick={() => handleProductClick(product.product_id)}
                  >
                    <img 
                      src={(product.primary_image || '').startsWith('http') ? product.primary_image : (product.primary_image || 'https://via.placeholder.com/400x400?text=No+Image')}
                      alt={product.name}
                      className={styles.productImage}
                      onError={(e) => {
                        console.log('Image load error:', product.primary_image);
                        e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                    {product.stock === 0 && (
                      <div className={styles.productBadge}>Habis</div>
                    )}
                    {product.stock > 0 && product.stock < 10 && (
                      <div className={styles.productBadge}>Stok Terbatas</div>
                    )}
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    
                    <div className={styles.productRating}>
                      <div className={styles.stars}>
                        {renderStars(product.rating_average || 0)}
                      </div>
                      <span className={styles.ratingText}>
                        {(product.rating_average || 0).toFixed(1)} ({product.total_reviews || 0})
                      </span>
                    </div>
                    
                    <div className={styles.productPrice}>
                      {formatPrice(product.price)}
                    </div>
                    
                    <div className={styles.productActions}>
                      <button 
                        className={styles.btnIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCartClick(product);
                        }}
                        title="Tambah ke Keranjang"
                      >
                        <ShoppingCart className={styles.icon} />
                      </button>
                      <button 
                        className={`${styles.btnIcon} ${styles.btnIconPrimary}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChatClick(product.product_id, product.name);
                        }}
                        title="Chat Penjual"
                      >
                        <MessageCircle className={styles.icon} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Package className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>Produk tidak ditemukan</h3>
              <p className={styles.emptyStateText}>
                Coba kata kunci atau kategori lain
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationBtn}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                ← Sebelumnya
              </button>
              
              <div className={styles.paginationInfo}>
                Halaman {pagination.page} dari {pagination.totalPages}
              </div>
              
              <button
                className={styles.paginationBtn}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Login Diperlukan</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowLoginModal(false)}
              >
                <X style={{ width: '1.5rem', height: '1.5rem' }} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                Anda harus login terlebih dahulu untuk {loginAction}.
              </p>
              <p className={styles.modalText}>
                Sudah punya akun? Silakan login. Belum punya akun? Daftar gratis sekarang!
              </p>
            </div>
            
            <div className={styles.modalActions}>
              <button 
                className={`${styles.btnModal} ${styles.btnModalSecondary}`}
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/register');
                }}
              >
                Daftar
              </button>
              <button 
                className={`${styles.btnModal} ${styles.btnModalPrimary}`}
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
