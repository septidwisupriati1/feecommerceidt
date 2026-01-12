/**
 * Image Helper Utility
 * Utility untuk menangani URL gambar dari backend
 */

// Base URL backend untuk development dan production
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

/**
 * Membuat URL lengkap untuk gambar dari backend
 * @param {string} imagePath - Path relatif gambar dari backend (contoh: 'uploads/products/image.jpg')
 * @param {string} fallback - URL fallback jika gambar tidak valid
 * @returns {string} URL lengkap gambar
 */
export const getImageUrl = (imagePath, fallback = 'https://via.placeholder.com/400x300?text=No+Image') => {
  // Jika imagePath kosong atau null, return fallback
  if (!imagePath) {
    return fallback;
  }

  // Data URL or blob URL: gunakan langsung tanpa prefix backend
  if (typeof imagePath === 'string' && (imagePath.startsWith('data:') || imagePath.startsWith('blob:'))) {
    return imagePath;
  }

  // Jika imagePath sudah berupa URL lengkap (http/https), return langsung
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Jika imagePath dimulai dengan slash, hapus slash pertama
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;

  // Gabungkan dengan base URL
  return `${BACKEND_URL}/${cleanPath}`;
};

/**
 * Membuat URL lengkap untuk gambar produk
 * @param {string} imagePath - Path gambar produk
 * @returns {string} URL lengkap gambar produk
 */
export const getProductImageUrl = (imagePath) => {
  return getImageUrl(imagePath, 'https://via.placeholder.com/400x300?text=Product+Image');
};

/**
 * Membuat URL lengkap untuk avatar user
 * @param {string} imagePath - Path avatar user
 * @returns {string} URL lengkap avatar
 */
export const getUserAvatarUrl = (imagePath) => {
  return getImageUrl(imagePath, 'https://via.placeholder.com/200x200?text=User');
};

/**
 * Membuat URL lengkap untuk logo toko
 * @param {string} imagePath - Path logo toko
 * @returns {string} URL lengkap logo toko
 */
export const getStoreLogoUrl = (imagePath) => {
  return getImageUrl(imagePath, 'https://via.placeholder.com/200x200?text=Store');
};

/**
 * Membuat URL lengkap untuk kategori icon
 * @param {string} imagePath - Path icon kategori
 * @returns {string} URL lengkap icon
 */
export const getCategoryIconUrl = (imagePath) => {
  return getImageUrl(imagePath, 'https://via.placeholder.com/100x100?text=Category');
};

/**
 * Handle error saat gambar gagal dimuat
 * @param {Event} event - Event error dari tag img
 * @param {string} fallback - URL fallback
 */
export const handleImageError = (event, fallback = 'https://via.placeholder.com/400x300?text=No+Image') => {
  event.target.src = fallback;
  event.target.onerror = null; // Prevent infinite loop
};

/**
 * Get multiple image URLs from array of image objects
 * @param {Array} images - Array of image objects with image_url property
 * @returns {Array} Array of full image URLs
 */
export const getImageUrls = (images) => {
  if (!Array.isArray(images)) {
    return [];
  }
  return images
    .map(img => {
      if (typeof img === 'string') return getImageUrl(img);
      return getImageUrl(img.image_url || img.url || img.path || img.src);
    })
    .filter(Boolean);
};

/**
 * Get primary image URL from product images array
 * @param {Array} images - Array of image objects
 * @returns {string} Primary image URL
 */
export const getPrimaryImageUrl = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // Find primary image
  const primaryImage = images.find(img => img.is_primary);
  
  // Use primary image if found, otherwise use first image
  const imageToUse = primaryImage || images[0];
  
  return getImageUrl(imageToUse.image_url || imageToUse.url || imageToUse.path || imageToUse.src);
};
