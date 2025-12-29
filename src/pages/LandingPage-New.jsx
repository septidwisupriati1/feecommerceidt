import { useNavigate } from "react-router-dom";
import { ShoppingBag, Shield, Truck, CreditCard } from "lucide-react";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.landingPage}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarContainer}>
          <div className={styles.navbarBrand} onClick={() => navigate('/')}>
            {/* Logo dari folder public */}
            <img 
              src="/images/stp.png" 
              alt="E-Commerce Logo" 
              className={styles.navbarLogo}
            />
            <span className={styles.navbarTitle}>E-Commerce</span>
          </div>
          <div className={styles.navbarActions}>
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
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        {/* Decorative elements */}
        <div className={styles.decorativeElements}>
          <div className={`${styles.dot} ${styles.dot1}`}></div>
          <div className={`${styles.dot} ${styles.dot2}`}></div>
          <div className={`${styles.dot} ${styles.dot3}`}></div>
          <div className={`${styles.dot} ${styles.dot4}`}></div>
          <div className={`${styles.dot} ${styles.dot5}`}></div>
        </div>

        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Selamat Datang di E-Commerce
              <br />
              Platform Belanja Terpercaya
            </h1>
            <p className={styles.heroSubtitle}>
              Belanja mudah, cepat dan aman
              <br />
              Ribuan produk berkualitas dengan harga terbaik
            </p>
            <div className={styles.heroActions}>
              <button 
                className={`${styles.btnLarge} ${styles.btnPrimaryLarge}`}
                onClick={() => navigate('/register')}
              >
                Mulai Belanja Sekarang
              </button>
              <button 
                className={`${styles.btnLarge} ${styles.btnSecondaryLarge}`}
                onClick={() => navigate('/login')}
              >
                Sudah Punya Akun? Masuk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.featuresTitle}>
            Mengapa Memilih Kami?
          </h2>
          <div className={styles.featuresGrid}>
            {/* Feature 1 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
                  <ShoppingBag style={{ width: '2rem', height: '2rem', color: '#2563eb' }} />
                </div>
              </div>
              <h3 className={styles.featureTitle}>Produk Berkualitas</h3>
              <p className={styles.featureDescription}>
                Ribuan produk pilihan dari penjual terpercaya
              </p>
            </div>

            {/* Feature 2 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
                  <Shield style={{ width: '2rem', height: '2rem', color: '#16a34a' }} />
                </div>
              </div>
              <h3 className={styles.featureTitle}>Pembayaran Aman</h3>
              <p className={styles.featureDescription}>
                Sistem pembayaran terenkripsi dan terjamin keamanannya
              </p>
            </div>

            {/* Feature 3 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <div className={`${styles.iconWrapper} ${styles.iconPurple}`}>
                  <Truck style={{ width: '2rem', height: '2rem', color: '#9333ea' }} />
                </div>
              </div>
              <h3 className={styles.featureTitle}>Pengiriman Cepat</h3>
              <p className={styles.featureDescription}>
                Pengiriman ke seluruh Indonesia dengan berbagai pilihan ekspedisi
              </p>
            </div>

            {/* Feature 4 */}
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <div className={`${styles.iconWrapper} ${styles.iconOrange}`}>
                  <CreditCard style={{ width: '2rem', height: '2rem', color: '#ea580c' }} />
                </div>
              </div>
              <h3 className={styles.featureTitle}>Harga Terbaik</h3>
              <p className={styles.featureDescription}>
                Dapatkan penawaran menarik dan harga kompetitif setiap hari
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p className={styles.footerText}>
            &copy; 2025 E-Commerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
