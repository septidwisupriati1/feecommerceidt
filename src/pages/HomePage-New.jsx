import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingBag, 
  ShoppingCart, 
  Star,
  X,
  Package
} from "lucide-react";
import { isAuthenticated } from "../utils/auth";
import { useCart } from "../context/CartContext";
import BuyerNavbar from "../components/BuyerNavbar";
import CartSuccessToast from "../components/CartSuccessToast";
import { products as staticProducts } from "../data/products";
import { browseProducts, formatCurrency } from "../services/productAPI";
import Footer from "../components/Footer";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [cartToast, setCartToast] = useState({ show: false, message: "" });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 1
  });

  const featuredRef = useRef(null);

  // Read search keyword from URL (?q=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || "";
    setSearchInput(q);
    setSearchQuery(q);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [location.search]);

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
  }, [pagination.page, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await browseProducts({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        sort_by: "created_at",
        sort_order: "desc"
      });

      if (response?.success) {
        setProducts(response.data || []);

        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            page: response.pagination.page ?? prev.page,
            limit: response.pagination.limit ?? prev.limit,
            total: response.pagination.total ?? response.pagination.total_items ?? prev.total,
            totalPages: response.pagination.totalPages ?? response.pagination.total_pages ?? prev.totalPages
          }));
        }
        return;
      }

      throw new Error(response?.error || "Gagal memuat produk");
    } catch (err) {
      console.warn("HomePage: fallback ke data statis", err);
      setError("Gagal memuat data dari server, menampilkan data sementara.");

      // Offline fallback: gunakan data statis lokal agar ID dan gambar konsisten dengan halaman detail
      const filtered = staticProducts
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
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => formatCurrency(Number(price) || 0);

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23e2e8f0'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='Segoe UI Emoji' font-size='72'%3E%F0%9F%9B%8D%EF%B8%8F%3C/text%3E%3C/svg%3E";

  const resolveImage = (url) => {
    if (!url) return placeholderImage;
    const trimmed = url.trim();
    if (trimmed.startsWith('data:')) return trimmed; // base64/data URI - use as-is
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('//')) return `https:${trimmed}`; // protocol-relative fallback

    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const origin = new URL(base, window.location.origin).origin;
      return `${origin}/${trimmed.replace(/^\//, "")}`;
    } catch (err) {
      console.warn("resolveImage fallback", err);
    }

    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
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

  const handleBuyNowClick = (product) => {
    if (!isAuthenticated()) {
      setLoginAction(`membeli "${product.name}" sekarang`);
      setShowLoginModal(true);
    } else {
      navigate('/checkout', {
        state: {
          buyNow: {
            product,
            quantity: 1
          }
        }
      });
    }
  };

  const scrollFeatured = (direction) => {
    const container = featuredRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const handleProductClick = (productId) => {
    navigate(`/produk/${productId}`);
  };

  // Auto-scroll featured carousel every 3s by one card, loop back to start
  useEffect(() => {
    const container = featuredRef.current;
    if (!container || !container.firstElementChild) return;

    const getStep = () => {
      const card = container.firstElementChild;
      const gap = parseFloat(getComputedStyle(container).columnGap || getComputedStyle(container).gap || '0');
      return card.getBoundingClientRect().width + gap;
    };

    const scrollOnce = () => {
      const step = getStep();
      const maxScroll = container.scrollWidth - container.clientWidth;
      const next = container.scrollLeft + step;
      if (next >= maxScroll - 1) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: step, behavior: 'smooth' });
      }
    };

    const id = setInterval(scrollOnce, 3000);
    return () => clearInterval(id);
  }, [products.length]);

  const renderProductCard = (product, extraClass = '') => (
    <div 
      key={product.product_id}
      className={`${styles.productCard} ${extraClass}`}
    >
      <div 
        className={styles.productImageContainer}
        onClick={() => handleProductClick(product.product_id)}
      >
        <img 
          src={resolveImage(product.primary_image)}
          alt={product.name}
          className={styles.productImage}
          onError={(e) => {
            console.log('Image load error:', product.primary_image);
            e.currentTarget.src = placeholderImage;
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
              handleBuyNowClick(product);
            }}
            title="Beli Sekarang"
          >
            <ShoppingBag className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );

  const featuredProducts = products.slice(0, 12);
  const allProductsPreview = products.slice(0, 5);

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
        </div>
      </div>

      {/* Products Section */}
      <div className={styles.productsSection}>
        <div className={styles.productsContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Produk Pilihan</h2>
          </div>

          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                background: 'rgba(248,113,113,0.12)',
                color: '#991b1b',
                border: '1px solid rgba(248,113,113,0.35)'
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Featured Carousel */}
              <div className={styles.featuredWrapper}>
                <button className={`${styles.arrowBtn} ${styles.arrowLeft}`} onClick={() => scrollFeatured('left')} aria-label="Scroll kiri">
                  ‹
                </button>
                <div className={styles.featuredScroll} ref={featuredRef}>
                  {featuredProducts.map((product) => renderProductCard(product, styles.featuredCard))}
                </div>
                <button className={`${styles.arrowBtn} ${styles.arrowRight}`} onClick={() => scrollFeatured('right')} aria-label="Scroll kanan">
                  ›
                </button>
              </div>

              {/* All Products Preview */}
              <div className={styles.sectionHeaderCompact}>
                <h3 className={styles.sectionSubtitle}>Semua Produk</h3>
              </div>
              <div className={styles.previewGrid}>
                {allProductsPreview.map((product) => renderProductCard(product))}
                {products.length > 5 && (
                  <button
                    className={styles.viewAllCard}
                    onClick={() => navigate('/produk')}
                    aria-label="Lihat semua produk"
                  >
                    <span className={styles.viewAllLabel}>Lihat semua</span>
                    <span className={styles.viewAllArrow}>→</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Package className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>Produk tidak ditemukan</h3>
              <p className={styles.emptyStateText}>
                Coba kata kunci atau kategori lain
              </p>
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
      <Footer showMap />

      <CartSuccessToast
        show={cartToast.show}
        message={cartToast.message || "Produk ditambahkan ke keranjang"}
        onClose={() => setCartToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
}
