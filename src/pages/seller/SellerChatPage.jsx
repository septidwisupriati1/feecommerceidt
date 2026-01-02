import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import EmptyState from "../../components/EmptyState";
import Footer from '../../components/Footer';
import { isNewSeller } from '../../utils/sellerStatus';
import { 
  Search,
  Send,
  Smile,
  Image,
  Paperclip,
  MoreVertical,
  Phone,
  User,
  Check,
  CheckCheck,
  Clock,
  Filter,
  Menu,
  MessageCirclePlus,
  Bell,
  MessageSquare,
  Shield,
  Package,
  Circle
} from 'lucide-react';
import CartSuccessToast from '../../components/CartSuccessToast';

// Initialize dummy data for chat
const initializeDummyChats = () => {
  const existingChats = localStorage.getItem('seller_chats');
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
        }
      ],
      admin: [
        {
          id: 4,
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
        }
      ]
    };
    localStorage.setItem('seller_chats', JSON.stringify(dummyChats));
    return dummyChats;
  }
  return JSON.parse(existingChats);
};

export default function SellerChatPage() {
  const navigate = useNavigate();
  const messagesContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [chatMode, setChatMode] = useState('buyer'); // 'buyer' or 'admin'
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Chat data from localStorage
  const [allChats, setAllChats] = useState(() => initializeDummyChats());
  const [messages, setMessages] = useState([]);
  
  // TODO: Temporarily disabled due to import issue
  // const newSeller = isNewSeller();

  // TODO: Re-enable empty state when import issue resolved
  // if (newSeller) {
  //   return (
  //     <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
  //       <div className="min-h-screen bg-gray-50">
  //         <div className="container mx-auto px-4 py-12">
  //           <EmptyState
  //             title="Belum Ada Chat"
  //             description="Anda belum memiliki percakapan. Chat akan muncul ketika pembeli menghubungi Anda."
  //             actionLabel="Lihat Produk"
  //             onAction={() => navigate('/seller/product')}
  //             icon="message-circle"
  //           />
  //         </div>
  //       </div>
  //     </SellerSidebar>
  //   );
  // }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when chat selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      markChatAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    };

    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptionsMenu]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  };

  const loadMessages = (chatId) => {
    const chatsData = JSON.parse(localStorage.getItem('seller_chats') || '{}');
    const chatList = chatMode === 'buyer' ? chatsData.buyer : chatsData.admin;
    const chat = chatList?.find(c => c.id === chatId);
    
    if (chat && chat.messages) {
      setMessages(chat.messages);
    } else {
      setMessages([]);
    }
  };

  const markChatAsRead = (chatId) => {
    const chatsData = JSON.parse(localStorage.getItem('seller_chats') || '{}');
    const chatList = chatMode === 'buyer' ? chatsData.buyer : chatsData.admin;
    
    const updatedList = chatList.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    );
    
    if (chatMode === 'buyer') {
      chatsData.buyer = updatedList;
    } else {
      chatsData.admin = updatedList;
    }
    
    localStorage.setItem('seller_chats', JSON.stringify(chatsData));
    setAllChats(chatsData);
    
    // Dispatch custom event to update sidebar badge
    window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const currentChatList = chatMode === 'buyer' ? allChats.buyer : allChats.admin;

  const filteredChats = currentChatList?.filter(chat => {
    const matchesSearch = chat.buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && chat.unreadCount > 0) ||
                         (filterType === 'replied' && chat.unreadCount === 0);
    return matchesSearch && matchesFilter;
  }) || [];

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;
    
    // Prevent sending message if chat is reported
    if (selectedChat.isReported) {
      setToast({ show: true, message: 'Tidak dapat mengirim pesan. Percakapan ini telah dilaporkan.' });
      return;
    }

    setSendingMessage(true);

    try {
      const currentTime = new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const newMessage = {
        id: Date.now(),
        text: message.trim(),
        sender: 'seller',
        time: currentTime,
        status: 'sent'
      };

      // Update messages in localStorage
      const chatsData = JSON.parse(localStorage.getItem('seller_chats') || '{}');
      const chatList = chatMode === 'buyer' ? chatsData.buyer : chatsData.admin;
      
      const updatedList = chatList.map(chat => {
        if (chat.id === selectedChat.id) {
          return {
            ...chat,
            messages: [...(chat.messages || []), newMessage],
            lastMessage: message.trim(),
            lastTime: 'Baru saja',
            unreadCount: 0
          };
        }
        return chat;
      });
      
      if (chatMode === 'buyer') {
        chatsData.buyer = updatedList;
      } else {
        chatsData.admin = updatedList;
      }
      
      localStorage.setItem('seller_chats', JSON.stringify(chatsData));
      setAllChats(chatsData);
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate message status update (sent -> delivered -> read)
      setTimeout(() => {
        const updatedMsg = { ...newMessage, status: 'delivered' };
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? updatedMsg : msg
        ));
        updateMessageStatusInStorage(newMessage.id, 'delivered');
      }, 1000);

      setTimeout(() => {
        const updatedMsg = { ...newMessage, status: 'read' };
        setMessages(prev => prev.map(msg => 
          msg.id === newMessage.id ? updatedMsg : msg
        ));
        updateMessageStatusInStorage(newMessage.id, 'read');
      }, 2500);
    } catch (error) {
      console.error('Error sending message:', error);
      setToast({ show: true, message: 'Gagal mengirim pesan. Silakan coba lagi.' });
    } finally {
      setSendingMessage(false);
    }
  };

  const updateMessageStatusInStorage = (messageId, status) => {
    const chatsData = JSON.parse(localStorage.getItem('seller_chats') || '{}');
    const chatList = chatMode === 'buyer' ? chatsData.buyer : chatsData.admin;
    
    const updatedList = chatList.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: chat.messages.map(msg => 
            msg.id === messageId ? { ...msg, status } : msg
          )
        };
      }
      return chat;
    });
    
    if (chatMode === 'buyer') {
      chatsData.buyer = updatedList;
    } else {
      chatsData.admin = updatedList;
    }
    
    localStorage.setItem('seller_chats', JSON.stringify(chatsData));
  };

  const handleNewChat = () => {
    const buyerName = prompt('Masukkan nama buyer:');
    if (!buyerName || !buyerName.trim()) return;

    const chatsData = JSON.parse(localStorage.getItem('seller_chats') || '{}');
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

    if (chatMode === 'buyer') {
      chatsData.buyer = [newChat, ...(chatsData.buyer || [])];
    } else {
      chatsData.admin = [newChat, ...(chatsData.admin || [])];
    }

    localStorage.setItem('seller_chats', JSON.stringify(chatsData));
    setAllChats(chatsData);
    setSelectedChat(newChat);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Don't send if chat is reported
      if (!selectedChat?.isReported) {
        handleSendMessage();
      }
    }
  };

  const getMessageStatus = (status) => {
    switch(status) {
      case 'sent':
        return <Check className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const currentChat = currentChatList.find(chat => chat.id === selectedChat?.id);
  const totalUnread = currentChatList.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <SellerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Hamburger Menu */}
              <Button
                onClick={() => setIsSidebarOpen(true)}
                variant="ghost"
                className="text-white hover:bg-blue-500 md:hidden p-2"
                size="sm"
              >
                <Menu className="h-6 w-6" />
              </Button>
              
              <div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 md:h-7 md:w-7" />
                  <h1 className="text-xl md:text-2xl font-bold">
                    {chatMode === 'buyer' ? 'Chat dengan Pembeli' : 'Chat dengan Admin'}
                  </h1>
                </div>
                <p className="text-blue-100 text-xs md:text-sm flex items-center gap-2 mt-1">
                  <Circle className="h-2 w-2 fill-green-400 text-green-400" />
                  {filteredChats.length} Percakapan Aktif
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              {/* Unread Badge - More Prominent */}
              {totalUnread > 0 && (
                <div className="relative">
                  <div className="bg-white text-blue-600 px-3 md:px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
                    <Bell className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="font-bold text-sm md:text-base">{totalUnread}</span>
                    <span className="hidden sm:inline text-xs md:text-sm font-semibold">Belum Dibaca</span>
                  </div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                </div>
              )}
              
              {/* New Chat Button - Eye Catching */}
              <Button
                onClick={handleNewChat}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-3 md:px-4 py-2 cursor-pointer"
                size="sm"
              >
                <MessageCirclePlus className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Chat Baru</span>
              </Button>
            </div>
          </div>
          
          {/* Chat Mode Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setChatMode('buyer');
                setSelectedChat(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                chatMode === 'buyer'
                  ? 'bg-white text-blue-600 shadow-lg scale-105'
                  : 'bg-blue-500 bg-opacity-50 text-white hover:bg-opacity-70'
              } cursor-pointer`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Pembeli</span>
              {allChats.buyer?.filter(c => c.unreadCount > 0).length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {allChats.buyer.filter(c => c.unreadCount > 0).length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setChatMode('admin');
                setSelectedChat(null);
              }}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                chatMode === 'admin'
                  ? 'bg-white text-blue-600 shadow-lg scale-105'
                  : 'bg-blue-500 bg-opacity-50 text-white hover:bg-opacity-70'
              } cursor-pointer`}
            >
              <Shield className="h-5 w-5" />
              <span>Admin</span>
              {allChats.admin?.filter(c => c.unreadCount > 0).length > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {allChats.admin.filter(c => c.unreadCount > 0).length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Content */}
      <div className="container mx-auto px-4 py-6">
        <Card className="overflow-hidden shadow-xl">
          <div className="flex h-[700px]">
            {/* Left Sidebar - Chat List */}
            <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex border-b border-gray-200 bg-white">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 relative ${
                      filterType === 'all' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    } cursor-pointer`}
                >
                  {filterType === 'all' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                  Semua ({currentChatList.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 relative flex items-center justify-center gap-1 ${
                    filterType === 'unread' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  } cursor-pointer`}
                >
                  {filterType === 'unread' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                  <Bell className="h-4 w-4" />
                  Belum Dibaca
                  {currentChatList.filter(c => c.unreadCount > 0).length > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
                      {currentChatList.filter(c => c.unreadCount > 0).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Memuat percakapan...</p>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="font-medium">Tidak ada chat</p>
                    <p className="text-xs">Mulai chat baru dengan tombol di atas</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer transition-all ${
                        chat.isReported 
                          ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-600' 
                          : selectedChat?.id === chat.id 
                            ? 'bg-blue-50 border-l-4 border-l-blue-600 hover:bg-blue-50' 
                            : 'hover:bg-blue-50'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-md ${
                          chat.isReported ? 'from-red-400 to-red-600' : 'from-blue-400 to-blue-600'
                        }`}>
                          {chat.buyerAvatar}
                        </div>
                        {chat.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                          </div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold truncate text-sm flex items-center gap-2 ${
                              chat.isReported ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {chat.buyerName}
                              {chat.isReported && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                  <Shield className="h-3 w-3" />
                                  Dilaporkan
                                </span>
                              )}
                            </h3>
                            {chatMode === 'buyer' && chat.orderHistory > 0 && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <Package className="h-3 w-3" />
                                <span>{chat.orderHistory} pesanan</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {chat.lastTime}
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

            {/* Right Side - Chat Messages */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {currentChat?.buyerAvatar}
                        </div>
                        {currentChat?.isOnline && (
                          <div className="absolute bottom-0 right-0">
                            <div className="w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm">
                              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-lg">{currentChat?.buyerName}</h2>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`flex items-center gap-1 ${currentChat?.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                            <Circle className={`h-2 w-2 ${currentChat?.isOnline ? 'fill-green-500' : 'fill-gray-400'}`} />
                            <span className="font-medium">{currentChat?.isOnline ? 'Online' : 'Offline'}</span>
                          </div>
                          {chatMode === 'buyer' && currentChat?.orderHistory > 0 && (
                            <>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center gap-1 text-gray-600">
                                <Package className="h-4 w-4" />
                                <span>{currentChat?.orderHistory} pesanan</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </button>
                      <div className="relative" ref={dropdownRef}>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                          onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>
                        {showOptionsMenu && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-t-lg transition-colors flex items-center gap-2 cursor-pointer"
                              onClick={() => {
                                if (window.confirm('Apakah Anda yakin ingin menghapus semua pesan dalam percakapan ini?')) {
                                  // Implementasi hapus pesan
                                  setMessages([]);
                                  setShowOptionsMenu(false);
                                }
                              }}
                            >
                              <MessageSquare className="h-4 w-4" />
                              Hapus Pesan
                            </button>
                            <button
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors flex items-center gap-2 cursor-pointer"
                              onClick={() => {
                                if (window.confirm('Apakah Anda yakin ingin melaporkan percakapan ini?')) {
                                  // Update status isReported di localStorage
                                  const chatsData = JSON.parse(localStorage.getItem('seller_chats') || '{}');
                                  const chatList = chatMode === 'buyer' ? chatsData.buyer : chatsData.admin;
                                  
                                  const updatedList = chatList.map(chat => 
                                    chat.id === selectedChat.id ? { ...chat, isReported: true } : chat
                                  );
                                  
                                  if (chatMode === 'buyer') {
                                    chatsData.buyer = updatedList;
                                  } else {
                                    chatsData.admin = updatedList;
                                  }
                                  
                                  localStorage.setItem('seller_chats', JSON.stringify(chatsData));
                                  setAllChats(chatsData);
                                  setSelectedChat({ ...selectedChat, isReported: true });
                                  
                                  setToast({ show: true, message: 'Laporan telah dikirim. Tim kami akan meninjau percakapan ini.' });
                                  setShowOptionsMenu(false);
                                }
                              }}
                            >
                              <Shield className="h-4 w-4" />
                              Laporkan
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reported Chat Warning */}
                  {selectedChat?.isReported && (
                    <div className="bg-red-50 border-b-2 border-red-200 p-4">
                      <div className="flex items-center gap-3 text-red-800">
                        <div className="flex-shrink-0">
                          <Shield className="h-8 w-8 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">Percakapan Telah Dilaporkan</h4>
                          <p className="text-xs text-red-700">
                            Percakapan ini telah dilaporkan dan tidak dapat digunakan untuk mengirim atau menerima pesan baru. Tim kami sedang meninjau laporan ini.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages Area */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                  >
                    <div className="text-center mb-4">
                      <span className="bg-white px-4 py-2 rounded-full text-xs text-gray-500 shadow-sm">
                        {currentChat?.lastTime}
                      </span>
                    </div>

                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                        <p className="font-medium">Belum ada pesan</p>
                        <p className="text-sm">Mulai percakapan dengan mengirim pesan pertama!</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'seller' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                              msg.sender === 'seller'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none'
                                : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                              msg.sender === 'seller' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span>{msg.time}</span>
                              {msg.sender === 'seller' && getMessageStatus(msg.status)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className={`border-t border-gray-200 p-4 shadow-lg ${
                    selectedChat?.isReported ? 'bg-red-50' : 'bg-white'
                  }`}>
                    {/* Disabled Message for Reported Chat */}
                    {selectedChat?.isReported ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-red-600">
                        <Shield className="h-5 w-5" />
                        <span className="font-semibold text-sm">
                          Chat dinonaktifkan karena telah dilaporkan
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Quick Replies */}
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {chatMode === 'buyer' ? (
                            <>
                              <button
                                onClick={() => setMessage('Terima kasih sudah menghubungi kami 🙏')}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              >
                                👋 Salam
                              </button>
                              <button
                                onClick={() => setMessage('Produk ready stock kak, silakan checkout 😊')}
                                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              >
                                ✅ Ready Stock
                              </button>
                              <button
                                onClick={() => setMessage('Pesanan akan kami proses segera')}
                                className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              >
                                ⏳ Proses
                              </button>
                              <button
                                onClick={() => setMessage('Barang sudah dikirim, silakan cek resi')}
                                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              >
                                🚚 Dikirim
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setMessage('Mohon bantuannya untuk masalah ini')}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              >
                                🙏 Mohon Bantuan
                              </button>
                              <button
                                onClick={() => setMessage('Terima kasih atas tanggapannya')}
                                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              >
                                ✨ Terima Kasih
                              </button>
                              <button
                                onClick={() => setMessage('Saya butuh verifikasi untuk akun saya')}
                                className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                              >
                                🔐 Verifikasi
                              </button>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <Smile className="h-6 w-6" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <Image className="h-6 w-6" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                            <Paperclip className="h-6 w-6" />
                          </button>
                          
                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder="Ketik balasan Anda..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
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
                              <Send className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                /* No Chat Selected */
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                  <div className="text-center px-4">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-blue-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <MessageCirclePlus className="w-5 h-5 text-gray-900" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {chatMode === 'buyer' ? 'Pilih Pembeli' : 'Pilih Admin'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      {chatMode === 'buyer' 
                        ? 'Pilih percakapan dari daftar untuk membalas pesan pembeli atau mulai chat baru'
                        : 'Pilih percakapan dari daftar untuk membalas pesan admin atau mulai chat baru'
                      }
                    </p>
                    <Button
                      onClick={handleNewChat}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <MessageCirclePlus className="h-5 w-5 mr-2" />
                      Mulai Chat Baru
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <Footer />
      <CartSuccessToast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </SellerSidebar>
  );
}
