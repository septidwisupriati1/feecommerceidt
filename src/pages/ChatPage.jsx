import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BuyerNavbar from "../components/BuyerNavbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import EmptyState from "../components/EmptyState";
import chatAPI from "../services/chatAPI";
import { getCurrentUser } from '../services/authAPI';
import {
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  PhotoIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  ShoppingBagIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const formatTimestamp = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const apiOrigin = import.meta.env.VITE_API_BASE_URL ? new URL(import.meta.env.VITE_API_BASE_URL).origin : '';
const buildImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return apiOrigin ? `${apiOrigin}${url}` : url;
};

const normalizeConversation = (conv) => {
  const other = conv?.other_user || conv?.otherUser || {};
  const storeName =
    other.seller_profile?.store_name ||
    other.store_profile?.store_name ||
    other.store_name ||
    other.store?.store_name ||
    conv?.store?.store_name ||
    conv?.shop_name ||
    conv?.shopName ||
    conv?.sellerName ||
    conv?.storeName ||
    conv?.store_name ||
    other.full_name ||
    other.username;
  const storePhoto =
    other.seller_profile?.store_photo ||
    other.store_profile?.store_photo ||
    other.store_photo ||
    other.store?.store_photo ||
    conv?.store?.store_photo ||
    conv?.shopAvatar ||
    other.profile_picture;
  return {
    id: conv?.conversation_id || conv?.id || conv?.conversationId,
    name: storeName || 'Pengguna',
    avatar: buildImageUrl(storePhoto),
    otherUserId: other.user_id || conv?.otherUserId || conv?.shopId || conv?.sellerId,
    lastMessage: conv?.last_message_text || conv?.lastMessage || 'Tidak ada pesan',
    lastTime: conv?.last_message_at || conv?.updated_at || conv?.lastMessageTime || conv?.created_at,
    unreadCount: conv?.unread_count ?? conv?.unreadCount ?? 0,
    isOnline: other.status === 'active' || conv?.isOnline || false,
  };
};

const normalizeMessage = (msg, currentUserId) => {
  const sentAt = msg?.created_at || msg?.createdAt || msg?.sent_at || msg?.sentAt || msg?.timestamp;
  return {
    id: msg?.message_id || msg?.id,
    text: msg?.message_text || msg?.message || msg?.text || '',
    senderId: msg?.sender_id || msg?.senderId,
    receiverId: msg?.receiver_id || msg?.receiverId || msg?.recipientId,
    time: formatTimestamp(sentAt),
    isMine: (msg?.sender_id || msg?.senderId) === currentUserId,
  };
};

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const sellerIdFromQuery = query.get('sellerId') ? parseInt(query.get('sellerId'), 10) : null;
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [filterType, searchQuery]);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
      markChatAsRead(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    if (sellerIdFromQuery && !Number.isNaN(sellerIdFromQuery)) {
      startConversationWithUser(sellerIdFromQuery);
    }
  }, [sellerIdFromQuery]);

  const currentChat = useMemo(
    () => conversations.find((c) => c.id === selectedId) || null,
    [conversations, selectedId]
  );

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations({ search: searchQuery || undefined });

      if (response.success && response.data) {
        const mapped = response.data.map(normalizeConversation).filter((c) => c.id);
        setConversations(mapped);
        if (!selectedId && mapped.length) {
          setSelectedId(mapped[0].id);
        }
      } else if (response.fallback) {
        setConversations(response.data || []);
      }
    } catch (error) {
      console.error(' [ChatPage] Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const startConversationWithUser = async (targetUserId) => {
    try {
      setLoadingMessages(true);
      const response = await chatAPI.getConversationWithUser(targetUserId, { limit: 100 });
      if (response.success && response.data?.conversation) {
        const conv = normalizeConversation(response.data.conversation);
        setConversations((prev) => {
          const others = prev.filter((c) => c.id !== conv.id);
          return [conv, ...others];
        });
        setSelectedId(conv.id);
        const mappedMessages = (response.data.messages || []).map((m) =>
          normalizeMessage(m, currentUser?.user_id)
        );
        setMessages(mappedMessages);
        window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'));
      }
    } catch (error) {
      console.error(' [ChatPage] Error starting conversation:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const response = await chatAPI.getMessages(conversationId);

      if (response.success && response.data) {
        const mapped = response.data.map((m) => normalizeMessage(m, currentUser?.user_id));
        setMessages(mapped);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error(' [ChatPage] Error loading messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markChatAsRead = async (conversationId) => {
    try {
      await chatAPI.markAsRead(conversationId);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
      window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'));
    } catch (error) {
      console.error(' [ChatPage] Error marking as read:', error);
    }
  };

  const filteredChats = conversations.filter((chat) => {
    const matchesSearch = chat.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'unread' && chat.unreadCount > 0) ||
      (filterType === 'read' && chat.unreadCount === 0);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChat?.otherUserId) return;

    setSendingMessage(true);
    try {
      const response = await chatAPI.sendMessage({
        receiverId: currentChat.otherUserId,
        message: message.trim(),
        conversationId: currentChat.id,
      });

      if (response.success) {
        const normalizedMsg = normalizeMessage(response.data, currentUser?.user_id);
        setMessages((prev) => [...prev, normalizedMsg]);

        if (response.data?.conversation) {
          const normalizedConv = normalizeConversation(response.data.conversation);
          // Preserve known partner info if backend response misses it
          if (!normalizedConv.otherUserId && currentChat?.otherUserId) {
            normalizedConv.otherUserId = currentChat.otherUserId;
          }
          if (normalizedConv.name === 'Pengguna' && currentChat?.name) {
            normalizedConv.name = currentChat.name;
          }
          setConversations((prev) => {
            const others = prev.filter((c) => c.id !== normalizedConv.id);
            return [normalizedConv, ...others];
          });
          setSelectedId(normalizedConv.id);
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === currentChat.id
                ? { ...c, lastMessage: normalizedMsg.text, lastTime: new Date().toISOString() }
                : c
            )
          );
        }

        setMessage('');
      }
    } catch (error) {
      console.error(' [ChatPage] Error sending message:', error);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleBlockShop = async () => {
    if (!currentChat) return;
    if (
      confirm(`Apakah Anda yakin ingin memblokir ${currentChat.name}? Anda tidak akan menerima pesan dari toko ini lagi.`)
    ) {
      try {
        const response = await chatAPI.blockUser(currentChat.otherUserId);
        if (response.success) {
          setConversations((prev) => prev.filter((c) => c.id !== currentChat.id));
          setMessages([]);
          setSelectedId(null);
          setShowDropdown(false);
          alert(`${currentChat.name} telah diblokir`);
        } else {
          alert(response.error || 'Gagal memblokir toko');
        }
      } catch (error) {
        console.error(' [ChatPage] Error blocking shop:', error);
        alert('Gagal memblokir toko');
      }
    }
  };

  const handleReportShop = async () => {
    if (!currentChat) return;
    const reason = prompt('Masukkan alasan pelaporan:');
    if (reason) {
      try {
        const response = await chatAPI.reportUser({
          userId: currentChat.otherUserId,
          conversationId: currentChat.id,
          reason: 'inappropriate_behavior',
          description: reason,
        });

        if (response.success) {
          alert(`Laporan untuk ${currentChat.name} telah dikirim. Tim kami akan meninjau laporan Anda.`);
        } else {
          alert(response.error || 'Gagal mengirim laporan');
        }
        setShowDropdown(false);
      } catch (error) {
        console.error(' [ChatPage] Error reporting shop:', error);
        alert('Gagal mengirim laporan');
      }
    }
  };

  const handleDeleteChat = async () => {
    if (!currentChat) return;
    if (confirm(`Hapus percakapan dengan ${currentChat.name}?`)) {
      try {
        const response = await chatAPI.deleteConversation(currentChat.id);

        if (response.success) {
          setConversations((prev) => prev.filter((chat) => chat.id !== currentChat.id));
          setSelectedId(null);
          setShowDropdown(false);
          setMessages([]);
        } else {
          alert(response.error || 'Gagal menghapus percakapan');
        }
      } catch (error) {
        console.error(' [ChatPage] Error deleting chat:', error);
        alert('Gagal menghapus percakapan');
      }
    }
  };

  const unreadTotal = conversations.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(219, 234, 254, 0.4) 0%, rgba(239, 246, 255, 0.3) 20%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <BuyerNavbar />

      <div style={{
        background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.5) 0%, rgba(239, 246, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 100%)',
        padding: '2rem 0',
        borderBottom: '1px solid rgba(147, 197, 253, 0.2)'
      }}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2" style={{ color: '#1e40af' }}>
            Chat
          </h1>
          <p className="text-lg text-center" style={{ color: '#6b7280' }}>
            {unreadTotal} pesan belum dibaca
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 mb-8">
        <Card className="overflow-hidden shadow-xl">
          <div className="flex h-[700px]">
            <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              <div className="flex border-b border-gray-200 bg-white">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 relative ${
                    filterType === 'all' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filterType === 'all' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                  Semua ({filteredChats.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 relative ${
                    filterType === 'unread' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {filterType === 'unread' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                  Belum Dibaca
                  {conversations.filter(c => c.unreadCount > 0).length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
                      {conversations.filter(c => c.unreadCount > 0).length}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                    <p>Memuat percakapan...</p>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <EmptyState
                      title="Belum Ada Chat"
                      description="Mulai chat dengan penjual untuk bertanya tentang produk."
                      actionLabel="Cari Produk"
                      onAction={() => navigate('/produk')}
                      icon="message-circle"
                    />
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedId(chat.id)}
                      className={`flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer transition-all ${
                        selectedId === chat.id 
                          ? 'bg-blue-50 border-l-4 border-l-blue-600 hover:bg-blue-50' 
                          : 'hover:bg-blue-50'
                      }`}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {chat.avatar ? (
                            <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            (chat.name || 'U').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        {chat.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">
                            {chat.name}
                          </h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {formatTimestamp(chat.lastTime) || '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 ml-2 shadow-md animate-pulse">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
              {currentChat ? (
                <>
                  <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {currentChat.avatar ? (
                            <img src={currentChat.avatar} alt={currentChat.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            (currentChat.name || 'U').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        {currentChat.isOnline && (
                          <div className="absolute bottom-0 right-0">
                            <div className="w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm">
                              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-lg">{currentChat.name}</h2>
                        <p className={`text-sm font-medium ${currentChat.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                          {currentChat.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="hover:bg-blue-50"
                        onClick={() => navigate('/produk')}
                      >
                        <ShoppingBagIcon className="h-5 w-5 mr-1" />
                        Kunjungi Toko
                      </Button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <PhoneIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setShowDropdown(!showDropdown)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        {showDropdown && (
                          <>
                            <div 
                              className="fixed inset-0 z-10"
                              onClick={() => setShowDropdown(false)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                              <button
                                onClick={handleReportShop}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                              >
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                                <span>Laporkan Toko</span>
                              </button>
                              <button
                                onClick={handleBlockShop}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                              >
                                <NoSymbolIcon className="h-5 w-5 text-red-600" />
                                <span>Blokir Toko</span>
                              </button>
                              <div className="border-t border-gray-200 my-1"></div>
                              <button
                                onClick={handleDeleteChat}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                              >
                                <TrashIcon className="h-5 w-5 text-gray-600" />
                                <span>Hapus Percakapan</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMessages ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                          <p>Memuat pesan...</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <p className="font-medium">Belum ada pesan</p>
                          <p className="text-sm">Mulai percakapan dengan mengirim pesan pertama!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              msg.isMine
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                                : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <span className={`text-xs mt-1 block ${
                              msg.isMine ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <FaceSmileIcon className="h-6 w-6" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <PhotoIcon className="h-6 w-6" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <PaperClipIcon className="h-6 w-6" />
                      </button>
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder="Ketik pesan Anda..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        disabled={!message.trim() || sendingMessage}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 text-white shadow-md hover:shadow-lg transition-all duration-200 px-4"
                      >
                        {sendingMessage ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <PaperAirplaneIcon className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-white">
                  <div className="text-center px-4">
                    <div className="text-6xl mb-4"></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Pilih Chat
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Pilih percakapan dari daftar untuk mulai chat dengan penjual
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
