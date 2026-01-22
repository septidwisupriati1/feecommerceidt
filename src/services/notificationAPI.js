/**
 * Notification API Service
 * Handles all notification-related API calls
 * Based on README-NOTIFICATIONS.md
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/ecommerce';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get user ID from localStorage
 */
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.user_id;
  } catch {
    return null;
  }
};

/**
 * Get user role from localStorage
 */
const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || user?.roles?.[0] || 'buyer';
  } catch {
    return 'buyer';
  }
};

const BUYER_ALLOWED_TYPES = [
  'SYSTEM_WELCOME',
  'ORDER_PLACED',
  'ORDER_STATUS_UPDATED',
  'ORDER_SHIPPED',
  'ORDER_DELIVERED',
  'ORDER_CANCELED',
  'PAYMENT_CONFIRMED',
  'PAYMENT_FAILED',
  'REFUND_PROCESSED',
  'ADMIN_BROADCAST',
  'ADMIN_DIRECT',
  'SYSTEM_MAINTENANCE',
];

const filterNotificationsByRole = (items, allowedTypes) => {
  const notifications = items || [];
  // If caller passes allowedTypes, respect it; otherwise return everything
  if (allowedTypes?.length) {
    return notifications.filter(n => allowedTypes.includes(n.type));
  }
  return notifications;
};

/**
 * Get all notifications for current user
 * @param {Object} params - Query parameters
 * @param {boolean} params.unread - Filter by unread status
 * @param {string} params.type - Filter by notification type
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 20, max: 100)
 * @param {Array<string>} params.allowedTypes - Optional: allowed notification types for client-side filtering
 * @returns {Promise<Object>} Notifications data with pagination
 */
export const getNotifications = async (params = {}) => {
  const { allowedTypes, ...queryParamsInput } = params;
  try {
    const queryParams = new URLSearchParams();
    
    if (queryParamsInput.unread !== undefined) queryParams.append('unread', queryParamsInput.unread);
    if (queryParamsInput.type) queryParams.append('type', queryParamsInput.type);
    if (queryParamsInput.page) queryParams.append('page', queryParamsInput.page);
    if (queryParamsInput.pageSize) queryParams.append('pageSize', queryParamsInput.pageSize);

    const response = await fetch(
      `${API_BASE_URL}/notifications?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data || {};
    const filteredItems = filterNotificationsByRole(data.items, allowedTypes);
    return { ...data, items: filteredItems };
  } catch (error) {
    console.warn('Backend unavailable, using fallback notifications:', error);
    return getFallbackNotifications({ ...queryParamsInput, allowedTypes });
  }
};

/**
 * Get unread notification count
 * @param {string} type - Optional: filter by notification type
 * @returns {Promise<number>} Unread notification count
 */
export const getUnreadCount = async (type = null, options = {}) => {
  const { allowedTypes } = options;
  try {
    // If caller specifies allowedTypes, align badge with the same client-side filter as the list
    if (allowedTypes && allowedTypes.length > 0) {
      const list = await getNotifications({ unread: true, type, allowedTypes, pageSize: 100 });
      return (list.items || []).length;
    }

    const queryParams = type ? `?type=${type}` : '';
    
    const response = await fetch(
      `${API_BASE_URL}/notifications/unread-count${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.count;
  } catch (error) {
    console.warn('Backend unavailable, using fallback count:', error);
    const notifications = getFallbackNotifications({ unread: true, type, allowedTypes });
    return notifications.items.length;
  }
};

/**
 * Mark single notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Backend unavailable, fallback mode:', error);
    // Update in fallback storage
    updateFallbackNotificationReadStatus(notificationId, true);
    return {
      id: notificationId,
      is_read: true,
      read_at: new Date().toISOString()
    };
  }
};

/**
 * Mark all notifications as read
 * @param {string} type - Optional: mark only notifications of this type
 * @returns {Promise<Object>} Result with count of updated notifications
 */
export const markAllAsRead = async (type = null) => {
  try {
    const queryParams = type ? `?type=${type}` : '';
    
    const response = await fetch(
      `${API_BASE_URL}/notifications/mark-all-read${queryParams}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Backend unavailable, fallback mode:', error);
    // Update all in fallback storage
    const count = markAllFallbackAsRead(type);
    return { count };
  }
};

/**
 * Delete notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Deleted notification data
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Backend unavailable, fallback mode:', error);
    // Delete from fallback storage
    deleteFallbackNotification(notificationId);
    return { id: notificationId };
  }
};

/**
 * Create notification(s) - Admin only
 * @param {Object} data - Notification data
 * @param {Array<number>} data.userIds - Array of user IDs
 * @param {string} data.type - Notification type
 * @param {string} data.title - Notification title
 * @param {string} data.message - Notification message
 * @param {string} data.entityType - Optional: entity type
 * @param {number} data.entityId - Optional: entity ID
 * @param {string} data.link - Optional: link URL
 * @param {Object} data.metadata - Optional: additional metadata
 * @param {number} data.priority - Optional: priority level (0-3)
 * @returns {Promise<Object>} Created notifications count
 */
export const createNotification = async (data) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/notifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Backend unavailable, fallback mode:', error);
    // Create in fallback storage
    createFallbackNotifications(data);
    return { count: data.userIds.length };
  }
};

// ==================== FALLBACK DATA ====================

const FALLBACK_STORAGE_KEY = 'fallback_notifications';

/**
 * Get fallback notifications from localStorage
 */
const getFallbackStorage = () => {
  try {
    const stored = localStorage.getItem(FALLBACK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Save fallback notifications to localStorage
 */
const saveFallbackStorage = (notifications) => {
  localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(notifications));
};

/**
 * Initialize fallback notifications
 */
const initializeFallbackNotifications = () => {
  const userId = getUserId();
  if (!userId) return [];

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userRole = currentUser?.role || currentUser?.roles?.[0] || 'buyer';

  const notifications = [
    {
      id: 1,
      user_id: userId,
      type: 'SYSTEM_WELCOME',
      title: '🎉 Selamat Datang!',
      message: `Selamat datang di E-Commerce! Terima kasih telah bergabung sebagai ${userRole}.`,
      entity_type: null,
      entity_id: null,
      link: null,
      is_read: false,
      read_at: null,
      metadata: { source: 'system' },
      priority: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: userId,
      type: 'ORDER_PLACED',
      title: '📦 Pesanan Berhasil Dibuat',
      message: 'Pesanan #ORD-20251119-00001 telah berhasil dibuat. Silakan lakukan pembayaran.',
      entity_type: 'order',
      entity_id: 1,
      link: '/pesanan-saya',
      is_read: false,
      read_at: null,
      metadata: { order_number: 'ORD-20251119-00001' },
      priority: 2,
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updated_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      user_id: userId,
      type: 'PAYMENT_CONFIRMED',
      title: '✅ Pembayaran Dikonfirmasi',
      message: 'Pembayaran untuk pesanan #ORD-20251118-00042 telah dikonfirmasi.',
      entity_type: 'order',
      entity_id: 42,
      link: '/pesanan-saya',
      is_read: true,
      read_at: new Date(Date.now() - 1800000).toISOString(),
      metadata: { order_number: 'ORD-20251118-00042', amount: 150000 },
      priority: 1,
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updated_at: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 4,
      user_id: userId,
      type: 'ORDER_SHIPPED',
      title: '🚚 Pesanan Dalam Pengiriman',
      message: 'Pesanan #ORD-20251117-00035 sedang dalam perjalanan. Estimasi tiba besok.',
      entity_type: 'order',
      entity_id: 35,
      link: '/pesanan-saya',
      is_read: false,
      read_at: null,
      metadata: { order_number: 'ORD-20251117-00035', tracking: 'JNE123456789' },
      priority: 2,
      created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      updated_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 5,
      user_id: userId,
      type: 'ADMIN_BROADCAST',
      title: '🔥 Flash Sale Hari Ini!',
      message: 'Dapatkan diskon hingga 70% untuk produk pilihan. Buruan sebelum kehabisan!',
      entity_type: 'promotion',
      entity_id: 10,
      link: '/produk',
      is_read: false,
      read_at: null,
      metadata: { campaign: 'flash-sale-nov-2025' },
      priority: 1,
      created_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      updated_at: new Date(Date.now() - 10800000).toISOString()
    }
  ];

  // Add role-specific notifications
  if (userRole === 'seller') {
    notifications.push(
      {
        id: 6,
        user_id: userId,
        type: 'NEW_REVIEW_RECEIVED',
        title: '⭐ Ulasan Baru Diterima',
        message: 'Produk "Smartphone X" mendapat ulasan baru dengan rating 5 bintang!',
        entity_type: 'review',
        entity_id: 123,
        link: '/seller/ulasan',
        is_read: false,
        read_at: null,
        metadata: { product_name: 'Smartphone X', rating: 5 },
        priority: 1,
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 7,
        user_id: userId,
        type: 'LOW_STOCK_WARNING',
        title: '⚠️ Stok Produk Menipis',
        message: 'Produk "Kaos Polo Premium" memiliki stok tersisa 3 unit. Segera restock!',
        entity_type: 'product',
        entity_id: 456,
        link: '/seller/produk-terjual',
        is_read: false,
        read_at: null,
        metadata: { product_name: 'Kaos Polo Premium', stock: 3 },
        priority: 2,
        created_at: new Date(Date.now() - 5400000).toISOString(),
        updated_at: new Date(Date.now() - 5400000).toISOString()
      }
    );
  } else if (userRole === 'admin') {
    notifications.push(
      {
        id: 8,
        user_id: userId,
        type: 'NEW_STORE_REGISTRATION',
        title: '🏪 Pendaftaran Toko Baru',
        message: 'Toko "Elektronik Jaya" telah mendaftar dan menunggu verifikasi.',
        entity_type: 'seller',
        entity_id: 789,
        link: '/admin/kelola-store',
        is_read: false,
        read_at: null,
        metadata: { store_name: 'Elektronik Jaya' },
        priority: 2,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 9,
        user_id: userId,
        type: 'PAYMENT_VERIFICATION_PENDING',
        title: '💳 Verifikasi Pembayaran Pending',
        message: '5 pembayaran menunggu verifikasi dari Anda.',
        entity_type: 'payment',
        entity_id: null,
        link: '/admin/payment-verification',
        is_read: false,
        read_at: null,
        metadata: { count: 5 },
        priority: 3,
        created_at: new Date(Date.now() - 1800000).toISOString(),
        updated_at: new Date(Date.now() - 1800000).toISOString()
      }
    );
  }

  saveFallbackStorage(notifications);
  return notifications;
};

/**
 * Get fallback notifications with filters
 */
const getFallbackNotifications = (params = {}) => {
  let notifications = getFallbackStorage();
  
  // Initialize if empty
  if (notifications.length === 0) {
    notifications = initializeFallbackNotifications();
  }

  const userId = getUserId();
  
  // Filter by user
  notifications = notifications.filter(n => n.user_id === userId);
  
  // Filter by unread status
  if (params.unread !== undefined) {
    notifications = notifications.filter(n => n.is_read === !params.unread);
  }
  
  // Filter by type
  if (params.type) {
    notifications = notifications.filter(n => n.type === params.type);
  }
  // Filter by allowed types (e.g., buyer-only)
  notifications = filterNotificationsByRole(notifications, params.allowedTypes);
  
  // Sort by created_at desc
  notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // Pagination
  const page = parseInt(params.page) || 1;
  const pageSize = Math.min(parseInt(params.pageSize) || 20, 100);
  const total = notifications.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    items: notifications.slice(start, end),
    page,
    pageSize,
    total,
    totalPages
  };
};

/**
 * Update notification read status in fallback
 */
const updateFallbackNotificationReadStatus = (notificationId, isRead) => {
  const notifications = getFallbackStorage();
  const index = notifications.findIndex(n => n.id === notificationId);
  
  if (index !== -1) {
    notifications[index].is_read = isRead;
    notifications[index].read_at = isRead ? new Date().toISOString() : null;
    notifications[index].updated_at = new Date().toISOString();
    saveFallbackStorage(notifications);
  }
};

/**
 * Mark all notifications as read in fallback
 */
const markAllFallbackAsRead = (type = null) => {
  const notifications = getFallbackStorage();
  const userId = getUserId();
  let count = 0;
  
  notifications.forEach(notification => {
    if (notification.user_id === userId && !notification.is_read) {
      if (!type || notification.type === type) {
        notification.is_read = true;
        notification.read_at = new Date().toISOString();
        notification.updated_at = new Date().toISOString();
        count++;
      }
    }
  });
  
  saveFallbackStorage(notifications);
  return count;
};

/**
 * Delete notification from fallback
 */
const deleteFallbackNotification = (notificationId) => {
  let notifications = getFallbackStorage();
  notifications = notifications.filter(n => n.id !== notificationId);
  saveFallbackStorage(notifications);
};

/**
 * Create notifications in fallback
 */
const createFallbackNotifications = (data) => {
  const notifications = getFallbackStorage();
  const maxId = notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) : 0;
  
  data.userIds.forEach((userId, index) => {
    const newNotification = {
      id: maxId + index + 1,
      user_id: userId,
      type: data.type,
      title: data.title,
      message: data.message,
      entity_type: data.entityType || null,
      entity_id: data.entityId || null,
      link: data.link || null,
      is_read: false,
      read_at: null,
      metadata: data.metadata || null,
      priority: data.priority || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    notifications.push(newNotification);
  });
  
  saveFallbackStorage(notifications);
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get notification type label
 */
export const getNotificationTypeLabel = (type) => {
  const labels = {
    'SYSTEM_WELCOME': 'Sistem',
    'ORDER_PLACED': 'Pesanan',
    'ORDER_STATUS_UPDATED': 'Pesanan',
    'ORDER_SHIPPED': 'Pengiriman',
    'ORDER_DELIVERED': 'Pengiriman',
    'ORDER_CANCELED': 'Pesanan',
    'PAYMENT_CONFIRMED': 'Pembayaran',
    'PAYMENT_FAILED': 'Pembayaran',
    'REFUND_PROCESSED': 'Refund',
    'NEW_REVIEW_RECEIVED': 'Ulasan',
    'LOW_STOCK_WARNING': 'Stok',
    'ADMIN_BROADCAST': 'Pengumuman',
    'ADMIN_DIRECT': 'Admin',
    'SYSTEM_MAINTENANCE': 'Sistem',
    'NEW_STORE_REGISTRATION': 'Toko Baru',
    'PAYMENT_VERIFICATION_PENDING': 'Verifikasi'
  };
  return labels[type] || 'Notifikasi';
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type) => {
  const icons = {
    'SYSTEM_WELCOME': '🎉',
    'ORDER_PLACED': '📦',
    'ORDER_STATUS_UPDATED': '📋',
    'ORDER_SHIPPED': '🚚',
    'ORDER_DELIVERED': '✅',
    'ORDER_CANCELED': '❌',
    'PAYMENT_CONFIRMED': '💰',
    'PAYMENT_FAILED': '⚠️',
    'REFUND_PROCESSED': '💳',
    'NEW_REVIEW_RECEIVED': '⭐',
    'LOW_STOCK_WARNING': '📉',
    'ADMIN_BROADCAST': '📢',
    'ADMIN_DIRECT': '✉️',
    'SYSTEM_MAINTENANCE': '🔧',
    'NEW_STORE_REGISTRATION': '🏪',
    'PAYMENT_VERIFICATION_PENDING': '💳'
  };
  return icons[type] || '🔔';
};

/**
 * Get priority badge color
 */
export const getPriorityColor = (priority) => {
  const colors = {
    0: 'bg-gray-100 text-gray-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  };
  return colors[priority] || colors[0];
};

/**
 * Format time ago
 */
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Baru saja';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari yang lalu`;
  
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

export default {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  getNotificationTypeLabel,
  getNotificationIcon,
  getPriorityColor,
  formatTimeAgo
};
