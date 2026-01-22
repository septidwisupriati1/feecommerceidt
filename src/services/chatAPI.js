import axios from 'axios';
import { validateAuth, clearAuth } from '../utils/auth';

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// If env already includes "/api/ecommerce", strip it to avoid double prefix
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/?api\/ecommerce\/?$/, '');
const CHAT_BASE = `${API_BASE_URL}/api/ecommerce/chat`;

const CHAT_FALLBACK_KEY = 'chat_fallback_conversations';

const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
      id: user?.user_id || user?.id || null,
      role: user?.role || user?.roles?.[0] || 'buyer',
      name: user?.name || user?.fullname || user?.full_name || user?.username || 'User'
    };
  } catch {
    return { id: null, role: 'buyer', name: 'User' };
  }
};

const loadFallbackStore = () => {
  try {
    const raw = localStorage.getItem(CHAT_FALLBACK_KEY);
    if (!raw) return { conversations: [] };
    return JSON.parse(raw);
  } catch {
    return { conversations: [] };
  }
};

const saveFallbackStore = (data) => {
  localStorage.setItem(CHAT_FALLBACK_KEY, JSON.stringify(data));
};

const ensureConversation = ({ buyerId, buyerName, sellerId, sellerName }) => {
  const store = loadFallbackStore();
  let conv = store.conversations.find(
    (c) => c.buyerId === buyerId && c.sellerId === sellerId
  );
  if (!conv) {
    conv = {
      id: Date.now(),
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      lastMessage: null,
      lastMessageTime: null,
      unreadBuyer: 0,
      unreadSeller: 0,
      messages: []
    };
    store.conversations.unshift(conv);
    saveFallbackStore(store);
  }
  return conv;
};

const mapConversationForRole = (conv, role) => {
  if (role === 'seller') {
    return {
      id: conv.id,
      conversationId: conv.id,
      buyerId: conv.buyerId,
      buyerName: conv.buyerName,
      buyerAvatar: (conv.buyerName || 'B').slice(0, 2).toUpperCase(),
      sellerId: conv.sellerId,
      lastMessage: conv.lastMessage || 'Tidak ada pesan',
      lastMessageTime: conv.lastMessageTime,
      unreadCount: conv.unreadSeller || 0,
      isOnline: false,
      updatedAt: conv.lastMessageTime
    };
  }
  // buyer
  return {
    id: conv.id,
    conversationId: conv.id,
    shopId: conv.sellerId,
    shopName: conv.sellerName || 'Toko',
    shopAvatar: (conv.sellerName || 'T').slice(0, 2).toUpperCase(),
    lastMessage: conv.lastMessage || 'Tidak ada pesan',
    lastMessageTime: conv.lastMessageTime,
    unreadCount: conv.unreadBuyer || 0,
    isOnline: false,
    updatedAt: conv.lastMessageTime,
    sellerId: conv.sellerId
  };
};

const mapMessagesFromFallback = (conv, currentUserId) => {
  return (conv.messages || []).map((msg) => ({
    id: msg.id,
    message: msg.message,
    text: msg.message,
    messageType: msg.messageType || 'text',
    senderId: msg.senderId,
    recipientId: msg.recipientId,
    senderRole: msg.senderRole,
    status: msg.status || 'sent',
    sentAt: msg.sentAt,
    createdAt: msg.sentAt,
    buyerId: conv.buyerId,
    sellerId: conv.sellerId
  }));
};

// Create axios instance with default config
const chatAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
chatAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
chatAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🔒 [ChatAPI] Unauthorized - clearing auth');
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Chat API Service
 * Handles all chat/messaging functionality between buyers and sellers
 */
const chatAPI = {
  /**
   * Get all conversations for current user
   * @param {Object} params - Query parameters
   * @param {string} params.role - 'buyer' or 'seller'
   * @param {string} params.filter - 'all', 'unread', 'read'
   * @param {string} params.search - Search query for conversation partner name
   * @returns {Promise} Array of conversations
   */
  getConversations: async (params = {}) => {
    try {
      validateAuth();
      
      console.log('💬 [ChatAPI] Getting conversations...', params);
      
      const response = await chatAxios.get(`${CHAT_BASE}/conversations`, { params });
      
      console.log('✅ [ChatAPI] Conversations retrieved:', response.data.data?.length || 0);
      
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error getting conversations:', error);
      const user = getCurrentUser();
      const store = loadFallbackStore();
      const filtered = store.conversations.filter((c) =>
        params.role === 'seller' ? c.sellerId === user.id : c.buyerId === user.id
      );
      const mapped = filtered.map((c) => mapConversationForRole(c, params.role || user.role));
      console.warn('⚠️ [ChatAPI] Using fallback conversations from localStorage');
      return {
        success: true,
        data: mapped,
        message: 'Fallback conversations',
        fallback: true
      };
    }
  },

  /**
   * Get messages for a specific conversation
   * @param {number} conversationId - Conversation ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Messages per page
   * @returns {Promise} Array of messages
   */
  getMessages: async (conversationId, params = {}) => {
    try {
      validateAuth();
      
      console.log(`💬 [ChatAPI] Getting messages for conversation ${conversationId}...`, params);
      
      const response = await chatAxios.get(`${CHAT_BASE}/conversations/${conversationId}/messages`, { params });
      
      console.log('✅ [ChatAPI] Messages retrieved:', response.data.data?.length || 0);
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error getting messages:', error);
      const store = loadFallbackStore();
      const conv = store.conversations.find((c) => c.id === conversationId);
      const messages = conv ? mapMessagesFromFallback(conv, getCurrentUser().id) : [];
      console.warn('⚠️ [ChatAPI] Using fallback messages from localStorage');
      return {
        success: true,
        data: messages,
        message: 'Fallback messages',
        fallback: true
      };
    }
  },

  /**
   * Send a new message
   * @param {number} conversationId - Conversation ID (optional for new conversation)
   * @param {Object} messageData - Message data
   * @param {number} messageData.recipientId - Recipient user ID (required if no conversationId)
   * @param {string} messageData.message - Message text
   * @param {string} messageData.messageType - 'text', 'image', 'file'
   * @param {File} messageData.attachment - Attachment file (optional)
   * @returns {Promise} Sent message object
   */
  sendMessage: async (conversationIdOrPayload, maybeMessageData) => {
    let payload;
    try {
      validateAuth();
      
      // Support legacy signature (conversationId, messageData) and new signature (payload only)
      payload = maybeMessageData ? { conversationId: conversationIdOrPayload, ...maybeMessageData } : conversationIdOrPayload;

      const receiverId = payload.recipientId || payload.receiverId || payload.receiver_id;
      if (!receiverId) {
        throw new Error('recipientId/receiverId is required');
      }

      const requestBody = {
        receiver_id: receiverId,
        message_text: payload.message || payload.message_text || ''
      };

      console.log('📤 [ChatAPI] Sending message...', { receiverId, hasConversationId: Boolean(payload.conversationId) });

      const response = await chatAxios.post(`${CHAT_BASE}/messages`, requestBody);
      
      console.log('✅ [ChatAPI] Message sent successfully');
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error sending message:', error);
      const user = getCurrentUser();
      const store = loadFallbackStore();

      const recipientId = payload?.recipientId || payload?.receiverId || payload?.receiver_id;
      const conversationId = payload?.conversationId;
      const messageText = payload?.message || payload?.message_text;

      if (!recipientId || !messageText) {
        throw error;
      }

      let conv = null;
      if (conversationId) {
        conv = store.conversations.find((c) => c.id === conversationId);
      }
      if (!conv) {
        conv = ensureConversation({
          buyerId: user.role === 'buyer' ? user.id : recipientId,
          buyerName: user.role === 'buyer' ? user.name : `Buyer ${recipientId}`,
          sellerId: user.role === 'seller' ? user.id : recipientId,
          sellerName: user.role === 'seller' ? user.name : `Seller ${recipientId}`
        });
      }

      const now = new Date().toISOString();
      const newMsg = {
        id: Date.now(),
        message: messageText,
        messageType: payload?.messageType || 'text',
        senderId: user.id,
        senderRole: user.role,
        recipientId: user.role === 'buyer' ? conv.sellerId : conv.buyerId,
        status: 'sent',
        sentAt: now
      };

      conv.messages = [...(conv.messages || []), newMsg];
      conv.lastMessage = newMsg.message;
      conv.lastMessageTime = now;
      if (user.role === 'buyer') {
        conv.unreadSeller = (conv.unreadSeller || 0) + 1;
        conv.unreadBuyer = 0;
      } else {
        conv.unreadBuyer = (conv.unreadBuyer || 0) + 1;
        conv.unreadSeller = 0;
      }

      saveFallbackStore(store);

      return {
        success: true,
        data: {
          id: newMsg.id,
          message: newMsg.message,
          messageType: newMsg.messageType,
          senderId: newMsg.senderId,
          recipientId: newMsg.recipientId,
          sentAt: now,
          status: newMsg.status,
          conversationId: conv.id
        },
        message: 'Message sent (fallback mode)',
        fallback: true
      };
    }
  },

  /**
   * Mark messages as read
   * @param {number} conversationId - Conversation ID
   * @returns {Promise} Success response
   */
  markAsRead: async (conversationId) => {
    try {
      validateAuth();
      
      console.log(`👁️ [ChatAPI] Marking conversation ${conversationId} as read...`);
      
      const response = await chatAxios.put(`${CHAT_BASE}/conversations/${conversationId}/read`);
      
      console.log('✅ [ChatAPI] Marked as read successfully');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error marking as read:', error);
      const user = getCurrentUser();
      const store = loadFallbackStore();
      const conv = store.conversations.find((c) => c.id === conversationId);
      if (conv) {
        if (user.role === 'buyer') conv.unreadBuyer = 0;
        else conv.unreadSeller = 0;
        saveFallbackStore(store);
      }
      console.warn('⚠️ [ChatAPI] Using fallback mark-as-read');
      return {
        success: true,
        message: 'Marked as read (fallback mode)',
        fallback: true
      };
    }
  },

  /**
   * Block a user (prevent receiving messages)
   * @param {number} userId - User ID to block
   * @returns {Promise} Success response
   */
  blockUser: async (userId) => {
    try {
      validateAuth();
      
      console.log(`🚫 [ChatAPI] Blocking user ${userId}...`);
      
      const response = await chatAxios.post('/api/chat/block', { userId });
      
      console.log('✅ [ChatAPI] User blocked successfully');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error blocking user:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Gagal memblokir pengguna',
        fallback: true
      };
    }
  },

  /**
   * Unblock a user
   * @param {number} userId - User ID to unblock
   * @returns {Promise} Success response
   */
  unblockUser: async (userId) => {
    try {
      validateAuth();
      
      console.log(`✅ [ChatAPI] Unblocking user ${userId}...`);
      
      const response = await chatAxios.post('/api/chat/unblock', { userId });
      
      console.log('✅ [ChatAPI] User unblocked successfully');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error unblocking user:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Gagal membuka blokir pengguna',
        fallback: true
      };
    }
  },

  /**
   * Delete a conversation
   * @param {number} conversationId - Conversation ID
   * @returns {Promise} Success response
   */
  deleteConversation: async (conversationId) => {
    try {
      validateAuth();
      
      console.log(`🗑️ [ChatAPI] Deleting conversation ${conversationId}...`);
      
      const response = await chatAxios.delete(`/api/chat/conversations/${conversationId}`);
      
      console.log('✅ [ChatAPI] Conversation deleted successfully');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error deleting conversation:', error);
      const store = loadFallbackStore();
      store.conversations = store.conversations.filter((c) => c.id !== conversationId);
      saveFallbackStore(store);
      return {
        success: true,
        message: 'Conversation deleted (fallback mode)',
        fallback: true
      };
    }
  },

  /**
   * Report a user or conversation
   * @param {Object} reportData - Report data
   * @param {number} reportData.userId - User ID to report (optional)
   * @param {number} reportData.conversationId - Conversation ID (optional)
   * @param {string} reportData.reason - Report reason
   * @param {string} reportData.description - Detailed description
   * @returns {Promise} Success response
   */
  reportUser: async (reportData) => {
    try {
      validateAuth();
      
      console.log('⚠️ [ChatAPI] Reporting user/conversation...', reportData);
      
      const response = await chatAxios.post('/api/chat/report', reportData);
      
      console.log('✅ [ChatAPI] Report submitted successfully');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error reporting:', error);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Gagal mengirim laporan',
        fallback: true
      };
    }
  },

  /**
   * Get conversation with a specific user (or create new if doesn't exist)
   * @param {number} userId - User ID to chat with
   * @returns {Promise} Conversation object
   */
  getConversationWithUser: async (userId, params = {}) => {
    try {
      validateAuth();
      const response = await chatAxios.get(`${CHAT_BASE}/conversations/with/${userId}/messages`, { params });
      const convData = response.data.data?.conversation;
      const messages = response.data.data?.messages || [];
      return {
        success: true,
        data: {
          conversation: convData,
          messages,
          pagination: response.data.data?.pagination
        }
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error getting conversation with user:', error);
      // fallback: ensure local
      const current = getCurrentUser();
      const conv = ensureConversation({
        buyerId: current.role === 'buyer' ? current.id : userId,
        buyerName: current.role === 'buyer' ? current.name : `Buyer ${userId}`,
        sellerId: current.role === 'seller' ? current.id : userId,
        sellerName: current.role === 'seller' ? current.name : `Seller ${userId}`
      });
      const msgs = mapMessagesFromFallback(conv, current.id);
      return {
        success: true,
        data: { conversation: conv, messages: msgs, pagination: null },
        fallback: true
      };
    }
  },

  /**
   * Get unread message count for the current user
   */
  getUnreadCount: async () => {
    try {
      validateAuth();
      const response = await chatAxios.get(`${CHAT_BASE}/unread-count`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      console.error('❌ [ChatAPI] Error getting unread count:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal mengambil jumlah pesan belum dibaca'
      };
    }
  }
};

export default chatAPI;
