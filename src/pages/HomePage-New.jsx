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
import BuyerNavbar from "../components/BuyerNavbar";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

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
    const response = await getCategories();
    if (response.success) {
      setCategories([
        { category_id: 'all', name: 'Semua' },
        ...response.data
      ]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      search: searchQuery || undefined,
      category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    const response = await browseProducts(params);
    
    if (response.success) {
      setProducts(response.data);
      setPagination(response.pagination);
    }
    
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

  const handleCartClick = (productId, productName) => {
    if (!isAuthenticated()) {
      setLoginAction(`menambahkan "${productName}" ke keranjang`);
      setShowLoginModal(true);
    } else {
      // Add to cart logic
      console.log("Adding to cart:", productId);
      alert("Produk ditambahkan ke keranjang!");
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
                  className={`${styles.filterBtn} ${selectedCategory === (cat.category_id || cat.name) ? styles.active : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.category_id || cat.name);
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
              {products.map(product => (
                <div 
                  key={product.product_id} 
                  className={styles.productCard}
                >
                  <div 
                    className={styles.productImageContainer}
                    onClick={() => handleProductClick(product.product_id)}
                  >
                    {product.primary_image ? (
                      <img 
                        src={getImageUrl(product.primary_image)} 
                        alt={product.name}
                        className={styles.productImage}
                        onError={(e) => {
                          console.log('Image load error:', product.primary_image);
                          e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className={styles.productImage} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f3f4f6',
                        fontSize: '4rem'
                      }}>
                        🛍️
                      </div>
                    )}
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
                          handleCartClick(product.product_id, product.name);
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
