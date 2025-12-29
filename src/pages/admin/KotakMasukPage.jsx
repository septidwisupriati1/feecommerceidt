import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/Footer';
import { 
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  PhotoIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  BuildingStorefrontIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const KotakMasukPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Data chat dengan seller
  const [chats, setChats] = useState([
    {
      id: 1,
      sellerName: 'Imperio Solo',
      sellerAvatar: 'IS',
      storeName: 'Imperio Solo',
      lastMessage: 'Admin, saya ingin melaporkan masalah pembayaran',
      lastTime: '5 menit lalu',
      unreadCount: 2,
      isOnline: true,
      totalProducts: 45,
      messages: [
        { id: 1, text: 'Halo Admin, saya ingin melaporkan masalah', sender: 'seller', time: '10:30', status: 'read' },
        { id: 2, text: 'Halo! Ada yang bisa kami bantu?', sender: 'admin', time: '10:32', status: 'read' },
        { id: 3, text: 'Saya mengalami masalah dengan pembayaran dari customer', sender: 'seller', time: '10:35', status: 'read' },
        { id: 4, text: 'Baik, bisa tolong jelaskan lebih detail masalahnya?', sender: 'admin', time: '10:36', status: 'read' },
        { id: 5, text: 'Customer sudah bayar tapi status belum berubah di dashboard saya', sender: 'seller', time: '10:38', status: 'delivered' }
      ]
    },
    {
      id: 2,
      sellerName: 'Planet Distro 2',
      sellerAvatar: 'PD',
      storeName: 'Planet Distro 2',
      lastMessage: 'Bagaimana cara menambah variasi produk?',
      lastTime: '20 menit lalu',
      unreadCount: 1,
      isOnline: true,
      totalProducts: 32,
      messages: [
        { id: 1, text: 'Admin, bagaimana cara menambah variasi produk seperti ukuran dan warna?', sender: 'seller', time: '14:20', status: 'delivered' }
      ]
    },
    {
      id: 3,
      sellerName: 'Batik Cah Ayu',
      sellerAvatar: 'BC',
      storeName: 'Batik Cah Ayu',
      lastMessage: 'Terima kasih atas bantuannya',
      lastTime: '1 jam lalu',
      unreadCount: 0,
      isOnline: false,
      totalProducts: 28,
      messages: [
        { id: 1, text: 'Admin, produk saya kok tidak muncul di pencarian?', sender: 'seller', time: '09:15', status: 'read' },
        { id: 2, text: 'Sudah kami cek, produknya sudah muncul sekarang. Coba refresh halaman', sender: 'admin', time: '09:20', status: 'read' },
        { id: 3, text: 'Sudah muncul, terima kasih banyak Admin!', sender: 'seller', time: '09:25', status: 'read' }
      ]
    },
    {
      id: 4,
      sellerName: 'Toko Elektronik Jaya',
      sellerAvatar: 'TE',
      storeName: 'Toko Elektronik Jaya',
      lastMessage: 'Minta tolong verifikasi akun saya',
      lastTime: '2 jam lalu',
      unreadCount: 1,
      isOnline: false,
      totalProducts: 67,
      messages: [
        { id: 1, text: 'Selamat siang Admin, saya sudah upload dokumen verifikasi. Mohon segera diproses', sender: 'seller', time: '11:00', status: 'delivered' }
      ]
    },
    {
      id: 5,
      sellerName: 'Warung Kopi Nusantara',
      sellerAvatar: 'WK',
      storeName: 'Warung Kopi Nusantara',
      lastMessage: 'Kapan penarikan saldo diproses?',
      lastTime: '3 jam lalu',
      unreadCount: 2,
      isOnline: true,
      totalProducts: 15,
      messages: [
        { id: 1, text: 'Admin, saya sudah request penarikan saldo 3 hari lalu tapi belum diproses', sender: 'seller', time: '08:00', status: 'delivered' },
        { id: 2, text: 'Mohon bantuannya segera diproses ya Admin', sender: 'seller', time: '08:02', status: 'delivered' }
      ]
    }
  ]);

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && chat.unreadCount > 0) ||
                         (filterType === 'replied' && chat.unreadCount === 0);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'admin',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === selectedChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: message,
          lastTime: 'Baru saja',
          unreadCount: 0
        };
      }
      return chat;
    }));

    setMessage('');

    setTimeout(() => {
      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === selectedChat.id) {
          const updatedMessages = chat.messages.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          );
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      }));
    }, 1000);

    setTimeout(() => {
      setChats(prevChats => prevChats.map(chat => {
        if (chat.id === selectedChat.id) {
          const updatedMessages = chat.messages.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          );
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      }));
    }, 2000);
  };

  const getMessageStatus = (status) => {
    switch(status) {
      case 'sent':
        return <CheckIcon className="h-4 w-4 text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex -space-x-1">
            <CheckIcon className="h-4 w-4 text-gray-400" />
            <CheckIcon className="h-4 w-4 text-gray-400" />
          </div>
        );
      case 'read':
        return (
          <div className="flex -space-x-1">
            <CheckIcon className="h-4 w-4 text-blue-500" />
            <CheckIcon className="h-4 w-4 text-blue-500" />
          </div>
        );
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const currentChat = chats.find(chat => chat.id === selectedChat?.id);

  return (
    <AdminSidebar>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-500 via-blue-300 via-30% to-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-2">
            Kotak Masuk
          </h1>
          <p className="text-lg text-blue-50 text-center">
            Komunikasi dengan Penjual
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Percakapan</p>
                <p className="text-3xl font-bold text-blue-600">{chats.length}</p>
              </div>
              <div className="text-5xl">💬</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Belum Dibaca</p>
                <p className="text-3xl font-bold text-red-600">
                  {chats.reduce((sum, chat) => sum + chat.unreadCount, 0)}
                </p>
              </div>
              <div className="text-5xl">📩</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Penjual Aktif</p>
                <p className="text-3xl font-bold text-green-600">
                  {chats.filter(c => c.isOnline).length}
                </p>
              </div>
              <div className="text-5xl">🟢</div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex h-[700px]">
            {/* Left Sidebar - Seller List */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari penjual..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    filterType === 'all' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Semua ({chats.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    filterType === 'unread' 
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Belum Dibaca ({chats.filter(c => c.unreadCount > 0).length})
                </button>
              </div>

              {/* Seller Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>Tidak ada chat ditemukan</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`flex items-start gap-3 p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-blue-50 ${
                        selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {chat.sellerAvatar}
                        </div>
                        {chat.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                              {chat.sellerName}
                            </h3>
                            <p className="text-xs text-gray-500">
                              🏪 {chat.totalProducts} produk
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {chat.lastTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 ml-2">
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
            <div className="flex-1 flex flex-col bg-gray-50">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {currentChat?.sellerAvatar}
                        </div>
                        {currentChat?.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900">{currentChat?.sellerName}</h2>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={currentChat?.isOnline ? 'text-green-600' : 'text-gray-500'}>
                            {currentChat?.isOnline ? 'Online' : 'Offline'}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">🏪 {currentChat?.storeName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm">
                        <BuildingStorefrontIcon className="h-5 w-5 inline mr-1" />
                        Lihat Toko
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <PhoneIcon className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="text-center mb-4">
                      <span className="bg-white px-4 py-2 rounded-full text-xs text-gray-500 shadow-sm">
                        Hari ini
                      </span>
                    </div>

                    {currentChat?.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            msg.sender === 'admin'
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white text-gray-900 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                            msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            <span>{msg.time}</span>
                            {msg.sender === 'admin' && getMessageStatus(msg.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    {/* Quick Replies */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <button
                        onClick={() => setMessage('Terima kasih telah menghubungi admin. Ada yang bisa kami bantu?')}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        Salam
                      </button>
                      <button
                        onClick={() => setMessage('Permintaan Anda sedang kami proses. Mohon ditunggu.')}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        Diproses
                      </button>
                      <button
                        onClick={() => setMessage('Masalah sudah kami selesaikan. Silakan dicek kembali.')}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        Selesai
                      </button>
                      <button
                        onClick={() => setMessage('Untuk informasi lebih lanjut, silakan hubungi support kami.')}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        Info Support
                      </button>
                    </div>

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
                        <input
                          type="text"
                          placeholder="Ketik balasan Anda..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSendMessage();
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded transition-colors"
                      >
                        <PaperAirplaneIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* No Chat Selected */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Pilih Penjual
                    </h3>
                    <p className="text-gray-600">
                      Pilih percakapan dari daftar untuk membalas pesan penjual
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AdminSidebar>
  );
};

export default KotakMasukPage;
