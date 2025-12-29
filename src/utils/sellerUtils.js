// Seller Utils - Check if seller is new and has no data

export const SELLER_DATA_KEYS = {
  PRODUCTS: 'seller_products',
  CHATS: 'seller_chats',
  ORDERS: 'seller_orders',
  SOLD_PRODUCTS: 'seller_sold_products',
  REVIEWS: 'seller_reviews',
  ACCOUNT_CREATED: 'seller_account_created'
};

// Check if seller has any products
export const hasProducts = () => {
  const products = localStorage.getItem(SELLER_DATA_KEYS.PRODUCTS);
  if (!products) return false;
  const parsed = JSON.parse(products);
  return parsed && parsed.length > 0;
};

// Check if seller has any chats
export const hasChats = () => {
  const chats = localStorage.getItem(SELLER_DATA_KEYS.CHATS);
  if (!chats) return false;
  const parsed = JSON.parse(chats);
  return (parsed.buyer && parsed.buyer.length > 0) || (parsed.admin && parsed.admin.length > 0);
};

// Check if seller has any orders
export const hasOrders = () => {
  const orders = localStorage.getItem(SELLER_DATA_KEYS.ORDERS);
  if (!orders) return false;
  const parsed = JSON.parse(orders);
  return parsed && parsed.length > 0;
};

// Check if seller has any sold products
export const hasSoldProducts = () => {
  const sold = localStorage.getItem(SELLER_DATA_KEYS.SOLD_PRODUCTS);
  if (!sold) return false;
  const parsed = JSON.parse(sold);
  return parsed && parsed.length > 0;
};

// Check if seller has any reviews
export const hasReviews = () => {
  const reviews = localStorage.getItem(SELLER_DATA_KEYS.REVIEWS);
  if (!reviews) return false;
  const parsed = JSON.parse(reviews);
  return parsed && parsed.length > 0;
};

// Check if seller is completely new (no data at all)
// DEPRECATED: Use isNewSeller from sellerStatus.js instead
// export const isNewSeller = () => {
//   return !hasProducts() && !hasChats() && !hasOrders() && !hasSoldProducts() && !hasReviews();
// };

// Get seller onboarding status
export const getSellerOnboardingStatus = () => {
  return {
    hasProducts: hasProducts(),
    hasChats: hasChats(),
    hasOrders: hasOrders(),
    hasSoldProducts: hasSoldProducts(),
    hasReviews: hasReviews(),
    isNew: isNewSeller(),
    completionPercentage: calculateCompletionPercentage()
  };
};

// Calculate completion percentage
const calculateCompletionPercentage = () => {
  let completed = 0;
  const total = 5;
  
  if (hasProducts()) completed++;
  if (hasChats()) completed++;
  if (hasOrders()) completed++;
  if (hasSoldProducts()) completed++;
  if (hasReviews()) completed++;
  
  return Math.round((completed / total) * 100);
};

// Mark account as created
export const markAccountCreated = () => {
  const now = new Date().toISOString();
  localStorage.setItem(SELLER_DATA_KEYS.ACCOUNT_CREATED, now);
  return now;
};

// Get account creation date
export const getAccountCreationDate = () => {
  return localStorage.getItem(SELLER_DATA_KEYS.ACCOUNT_CREATED);
};

// Initialize seller account (call this on first login)
export const initializeSellerAccount = () => {
  if (!getAccountCreationDate()) {
    markAccountCreated();
  }
  
  // Initialize empty data structures if they don't exist
  if (!localStorage.getItem(SELLER_DATA_KEYS.PRODUCTS)) {
    localStorage.setItem(SELLER_DATA_KEYS.PRODUCTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(SELLER_DATA_KEYS.CHATS)) {
    localStorage.setItem(SELLER_DATA_KEYS.CHATS, JSON.stringify({ buyer: [], admin: [] }));
  }
  
  if (!localStorage.getItem(SELLER_DATA_KEYS.ORDERS)) {
    localStorage.setItem(SELLER_DATA_KEYS.ORDERS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(SELLER_DATA_KEYS.SOLD_PRODUCTS)) {
    localStorage.setItem(SELLER_DATA_KEYS.SOLD_PRODUCTS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(SELLER_DATA_KEYS.REVIEWS)) {
    localStorage.setItem(SELLER_DATA_KEYS.REVIEWS, JSON.stringify([]));
  }
};

// Reset seller data (for testing)
export const resetSellerData = () => {
  Object.values(SELLER_DATA_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Get seller statistics
export const getSellerStats = () => {
  const products = JSON.parse(localStorage.getItem(SELLER_DATA_KEYS.PRODUCTS) || '[]');
  const chats = JSON.parse(localStorage.getItem(SELLER_DATA_KEYS.CHATS) || '{"buyer":[],"admin":[]}');
  const orders = JSON.parse(localStorage.getItem(SELLER_DATA_KEYS.ORDERS) || '[]');
  const sold = JSON.parse(localStorage.getItem(SELLER_DATA_KEYS.SOLD_PRODUCTS) || '[]');
  const reviews = JSON.parse(localStorage.getItem(SELLER_DATA_KEYS.REVIEWS) || '[]');
  
  return {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalChats: (chats.buyer?.length || 0) + (chats.admin?.length || 0),
    unreadChats: [...(chats.buyer || []), ...(chats.admin || [])].reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalSold: sold.length,
    totalRevenue: sold.reduce((sum, s) => sum + (s.total || 0), 0),
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
      : 0
  };
};
