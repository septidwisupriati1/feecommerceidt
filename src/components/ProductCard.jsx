import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle, Star } from "lucide-react";
import { isAuthenticated } from "../utils/auth";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product, onCartClick, onChatClick, onLoginRequired }) {
  const navigate = useNavigate();

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

  const handleCartClick = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      onLoginRequired(`menambahkan "${product.name}" ke keranjang`);
    } else {
      onCartClick && onCartClick(product.id);
    }
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      onLoginRequired(`mengirim pesan tentang "${product.name}"`);
    } else {
      onChatClick && onChatClick(product.id);
    }
  };

  const handleProductClick = () => {
    navigate(`/produk/${product.id}`);
  };

  const getBadgeClass = (badge) => {
    if (!badge) return '';
    
    const badgeLower = badge.toLowerCase();
    if (badgeLower.includes('new')) return styles.new;
    if (badgeLower.includes('promo')) return styles.promo;
    if (badgeLower.includes('best') || badgeLower.includes('seller')) return styles.bestSeller;
    return '';
  };

  return (
    <div className={styles.productCard} onClick={handleProductClick}>
      <div className={styles.productImageContainer}>
        <img 
          src={product.image} 
          alt={product.name}
          className={styles.productImage}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=Produk';
          }}
        />
        {product.badge && (
          <div className={`${styles.productBadge} ${getBadgeClass(product.badge)}`}>
            {product.badge}
          </div>
        )}
        {product.sold && (
          <div className={styles.soldBadge}>
            {product.sold} Terjual
          </div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        
        <div className={styles.productRating}>
          <div className={styles.stars}>
            {renderStars(product.rating || 0)}
          </div>
          <span className={styles.ratingText}>
            {product.rating || 0} ({product.reviews || 0})
          </span>
        </div>
        
        <div className={styles.productPrice}>
          {formatPrice(product.price)}
          {product.originalPrice && (
            <>
              <span className={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
              {product.discount && (
                <span className={styles.discount}>
                  -{product.discount}%
                </span>
              )}
            </>
          )}
        </div>
        
        <div className={styles.productActions}>
          <button 
            className={styles.btnIcon}
            onClick={handleCartClick}
            title="Tambah ke Keranjang"
          >
            <ShoppingCart className={styles.icon} />
          </button>
          <button 
            className={`${styles.btnIcon} ${styles.btnIconPrimary}`}
            onClick={handleChatClick}
            title="Chat Penjual"
          >
            <MessageCircle className={styles.icon} />
          </button>
        </div>
      </div>
    </div>
  );
}
