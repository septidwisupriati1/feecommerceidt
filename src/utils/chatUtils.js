// Chat Utils for localStorage management

export const CHAT_STORAGE_KEY = 'seller_chats';

// Initialize dummy chats if not exists
export const initializeDummyChats = () => {
  const existingChats = localStorage.getItem(CHAT_STORAGE_KEY);
  if (!existingChats) {
    const dummyChats = {
      buyer: [
        {
          id: 1,
          buyerId: 101,
          buyerName: 'Ahmad Rizki',
          buyerAvatar: 'AR',
          lastMessage: 'Halo, apakah produk laptop masih ready?',
          lastTime: '10:30',
          unreadCount: 2,
          isOnline: true,
          isReported: false,
          orderHistory: 3,
          messages: [
            { id: 1, text: 'Halo, apakah produk laptop masih ready?', sender: 'buyer', time: '10:25', status: 'read' },
            { id: 2, text: 'Harga bisa nego tidak?', sender: 'buyer', time: '10:30', status: 'delivered' }
          ]
        },
        {
          id: 2,
          buyerId: 102,
          buyerName: 'Siti Nurhaliza',
          buyerAvatar: 'SN',
          lastMessage: 'Terima kasih produknya sudah sampai!',
          lastTime: 'Kemarin',
          unreadCount: 0,
          isOnline: false,
          isReported: false,
          orderHistory: 1,
          messages: [
            { id: 1, text: 'Paket sudah dikirim?', sender: 'buyer', time: '09:00', status: 'read' },
            { id: 2, text: 'Sudah dikirim ya, resi: JNE123456', sender: 'seller', time: '09:15', status: 'read' },
            { id: 3, text: 'Terima kasih produknya sudah sampai!', sender: 'buyer', time: '16:30', status: 'read' }
          ]
        },
        {
          id: 3,
          buyerId: 103,
          buyerName: 'Budi Santoso',
          buyerAvatar: 'BS',
          lastMessage: 'Oke siap, saya transfer sekarang',
          lastTime: '2 hari lalu',
          unreadCount: 0,
          isOnline: false,
          isReported: false,
          orderHistory: 5,
          messages: [
            { id: 1, text: 'Total berapa untuk 2 item?', sender: 'buyer', time: '14:00', status: 'read' },
            { id: 2, text: 'Total Rp 250.000 sudah termasuk ongkir', sender: 'seller', time: '14:05', status: 'read' },
            { id: 3, text: 'Oke siap, saya transfer sekarang', sender: 'buyer', time: '14:10', status: 'read' }
          ]
        },
        {
          id: 4,
          buyerId: 104,
          buyerName: 'Diana Putri',
          buyerAvatar: 'DP',
          lastMessage: 'Kapan barang dikirim?',
          lastTime: '3 hari lalu',
          unreadCount: 0,
          isOnline: false,
          isReported: false,
          orderHistory: 2,
          messages: [
            { id: 1, text: 'Saya sudah bayar ya', sender: 'buyer', time: '08:00', status: 'read' },
            { id: 2, text: 'Baik kak, akan segera diproses', sender: 'seller', time: '08:30', status: 'read' },
            { id: 3, text: 'Kapan barang dikirim?', sender: 'buyer', time: '10:00', status: 'read' }
          ]
        },
        {
          id: 5,
          buyerId: 105,
          buyerName: 'Eko Prasetyo',
          buyerAvatar: 'EP',
          lastMessage: 'Ada diskon gak kak?',
          lastTime: '1 minggu lalu',
          unreadCount: 1,
          isOnline: false,
          isReported: false,
          orderHistory: 0,
          messages: [
            { id: 1, text: 'Kak mau tanya produknya', sender: 'buyer', time: '15:00', status: 'read' },
            { id: 2, text: 'Ada diskon gak kak?', sender: 'buyer', time: '15:05', status: 'delivered' }
          ]
        }
      ],
      admin: [
        {
          id: 6,
          buyerId: 1,
          buyerName: 'Admin STP',
          buyerAvatar: 'AD',
          lastMessage: 'Mohon segera proses pesanan pending',
          lastTime: '08:00',
          unreadCount: 1,
          isOnline: true,
          isReported: false,
          orderHistory: 0,
          messages: [
            { id: 1, text: 'Selamat pagi, ada beberapa pesanan yang pending', sender: 'buyer', time: '08:00', status: 'delivered' },
            { id: 2, text: 'Mohon segera proses pesanan pending', sender: 'buyer', time: '08:00', status: 'delivered' }
          ]
        },
        {
          id: 7,
          buyerId: 2,
          buyerName: 'Tim Verifikasi',
          buyerAvatar: 'TV',
          lastMessage: 'Dokumen Anda sudah diverifikasi',
          lastTime: '2 hari lalu',
          unreadCount: 0,
          isOnline: false,
          orderHistory: 0,
          messages: [
            { id: 1, text: 'Mohon upload dokumen verifikasi', sender: 'buyer', time: '10:00', status: 'read' },
            { id: 2, text: 'Sudah saya upload pak', sender: 'seller', time: '11:00', status: 'read' },
            { id: 3, text: 'Dokumen Anda sudah diverifikasi', sender: 'buyer', time: '14:00', status: 'read' }
          ]
        }
      ]
    };
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(dummyChats));
    return dummyChats;
  }
  return JSON.parse(existingChats);
};

// Get all chats
export const getAllChats = () => {
  const chats = localStorage.getItem(CHAT_STORAGE_KEY);
  return chats ? JSON.parse(chats) : initializeDummyChats();
};

// Get chat by ID
export const getChatById = (chatId, mode = 'buyer') => {
  const allChats = getAllChats();
  const chatList = mode === 'buyer' ? allChats.buyer : allChats.admin;
  return chatList.find(chat => chat.id === chatId);
};

// Add new message to chat
export const addMessageToChat = (chatId, message, mode = 'buyer') => {
  const allChats = getAllChats();
  const chatList = mode === 'buyer' ? allChats.buyer : allChats.admin;
  
  const updatedList = chatList.map(chat => {
    if (chat.id === chatId) {
      return {
        ...chat,
        messages: [...(chat.messages || []), message],
        lastMessage: message.text,
        lastTime: 'Baru saja',
        unreadCount: message.sender === 'buyer' ? chat.unreadCount + 1 : 0
      };
    }
    return chat;
  });
  
  if (mode === 'buyer') {
    allChats.buyer = updatedList;
  } else {
    allChats.admin = updatedList;
  }
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  
  // Dispatch event to update badge in sidebar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'));
  }
  
  return allChats;
};

// Update message status
export const updateMessageStatus = (chatId, messageId, status, mode = 'buyer') => {
  const allChats = getAllChats();
  const chatList = mode === 'buyer' ? allChats.buyer : allChats.admin;
  
  const updatedList = chatList.map(chat => {
    if (chat.id === chatId) {
      return {
        ...chat,
        messages: chat.messages.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        )
      };
    }
    return chat;
  });
  
  if (mode === 'buyer') {
    allChats.buyer = updatedList;
  } else {
    allChats.admin = updatedList;
  }
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  return allChats;
};

// Mark chat as read
export const markChatAsRead = (chatId, mode = 'buyer') => {
  const allChats = getAllChats();
  const chatList = mode === 'buyer' ? allChats.buyer : allChats.admin;
  
  const updatedList = chatList.map(chat => 
    chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
  );
  
  if (mode === 'buyer') {
    allChats.buyer = updatedList;
  } else {
    allChats.admin = updatedList;
  }
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  
  // Dispatch event to update badge in sidebar
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'));
  }
  
  return allChats;
};

// Create new chat
export const createNewChat = (buyerName, mode = 'buyer') => {
  const allChats = getAllChats();
  const newChat = {
    id: Date.now(),
    buyerId: Date.now(),
    buyerName: buyerName.trim(),
    buyerAvatar: getInitials(buyerName.trim()),
    lastMessage: 'Mulai percakapan baru',
    lastTime: 'Baru saja',
    unreadCount: 0,
    isOnline: false,
    orderHistory: 0,
    messages: []
  };

  if (mode === 'buyer') {
    allChats.buyer = [newChat, ...(allChats.buyer || [])];
  } else {
    allChats.admin = [newChat, ...(allChats.admin || [])];
  }

  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  return { allChats, newChat };
};

// Delete chat
export const deleteChat = (chatId, mode = 'buyer') => {
  const allChats = getAllChats();
  
  if (mode === 'buyer') {
    allChats.buyer = allChats.buyer.filter(chat => chat.id !== chatId);
  } else {
    allChats.admin = allChats.admin.filter(chat => chat.id !== chatId);
  }
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  return allChats;
};

// Get unread count
export const getUnreadCount = (mode = 'buyer') => {
  const allChats = getAllChats();
  const chatList = mode === 'buyer' ? allChats.buyer : allChats.admin;
  return chatList.reduce((sum, chat) => sum + chat.unreadCount, 0);
};

// Get total unread count (all modes)
export const getTotalUnreadCount = () => {
  const allChats = getAllChats();
  const buyerUnread = allChats.buyer?.reduce((sum, chat) => sum + chat.unreadCount, 0) || 0;
  const adminUnread = allChats.admin?.reduce((sum, chat) => sum + chat.unreadCount, 0) || 0;
  return buyerUnread + adminUnread;
};

// Simulate receiving new message from buyer/admin
export const simulateIncomingMessage = (chatId, messageText, mode = 'buyer') => {
  const newMessage = {
    id: Date.now(),
    text: messageText,
    sender: 'buyer',
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    status: 'delivered'
  };
  
  return addMessageToChat(chatId, newMessage, mode);
};

// Helper function
const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

// Reset to dummy data
export const resetChatData = () => {
  localStorage.removeItem(CHAT_STORAGE_KEY);
  return initializeDummyChats();
};

// Report chat
export const reportChat = (chatId, mode = 'buyer') => {
  const allChats = getAllChats();
  const chatList = mode === 'buyer' ? allChats.buyer : allChats.admin;
  
  const updatedList = chatList.map(chat => 
    chat.id === chatId ? { ...chat, isReported: true } : chat
  );
  
  if (mode === 'buyer') {
    allChats.buyer = updatedList;
  } else {
    allChats.admin = updatedList;
  }
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  
  // Dispatch event to update UI
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chatReported'));
  }
  
  return allChats;
};

// Unreport chat (for testing or admin purposes)
export const unreportChat = (chatId, mode = 'buyer') => {
  const allChats = getAllChats();
  const chatList = mode === 'buyer' ? allChats.buyer : allChats.admin;
  
  const updatedList = chatList.map(chat => 
    chat.id === chatId ? { ...chat, isReported: false } : chat
  );
  
  if (mode === 'buyer') {
    allChats.buyer = updatedList;
  } else {
    allChats.admin = updatedList;
  }
  
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(allChats));
  return allChats;
};

// Get chat statistics
export const getChatStats = () => {
  const allChats = getAllChats();
  
  return {
    totalBuyerChats: allChats.buyer?.length || 0,
    totalAdminChats: allChats.admin?.length || 0,
    totalUnreadBuyer: getUnreadCount('buyer'),
    totalUnreadAdmin: getUnreadCount('admin'),
    totalUnread: getTotalUnreadCount(),
    totalChats: (allChats.buyer?.length || 0) + (allChats.admin?.length || 0)
  };
};
