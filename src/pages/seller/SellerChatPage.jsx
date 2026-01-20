import { useEffect, useMemo, useState } from 'react';
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import SellerSidebar from "../../components/SellerSidebar";
import EmptyState from "../../components/EmptyState";
import Footer from '../../components/Footer';
import chatAPI from '../../services/chatAPI';
import { getCurrentUser } from '../../services/authAPI';
import {
  Search,
  Send,
  Smile,
  Image,
  Paperclip,
  MoreVertical,
  Phone,
  Check,
  CheckCheck,
  Clock,
  Circle
} from 'lucide-react';

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const normalizeConversation = (conv, currentUserId) => {
  const other = conv?.other_user || conv?.otherUser || {};
  const otherUserId = other.user_id || (conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id);
  return {
    id: conv?.conversation_id || conv?.id,
    name: other.full_name || other.username || 'Pengguna',
    avatar: other.profile_picture || null,
    otherUserId,
    lastMessage: conv?.last_message_text || conv?.lastMessage || 'Tidak ada pesan',
    lastTime: conv?.last_message_at || conv?.updated_at || conv?.created_at,
    unreadCount: conv?.unread_count ?? conv?.unreadCount ?? 0,
    isOnline: other.status === 'active'
  };
};

const normalizeMessage = (msg, currentUserId) => {
  const sentAt = msg?.created_at || msg?.createdAt || msg?.sent_at || msg?.timestamp;
  const senderId = msg?.sender_id || msg?.senderId;
  return {
    id: msg?.message_id || msg?.id,
    text: msg?.message_text || msg?.message || msg?.text || '',
    senderId,
    isMine: senderId === currentUserId,
    time: formatTime(sentAt)
  };
};

export default function SellerChatPage() {
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [filterType, searchQuery]);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
      markAsRead(selectedId);
    }
  }, [selectedId]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await chatAPI.getConversations({ search: searchQuery || undefined });
      if (res.success && res.data) {
        const mapped = res.data
          .map((c) => normalizeConversation(c, currentUser?.user_id))
          .filter((c) => c.id);
        setConversations(mapped);
        if (!selectedId && mapped.length) setSelectedId(mapped[0].id);
      }
    } catch (err) {
      console.error(' [SellerChat] loadConversations', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      const res = await chatAPI.getMessages(conversationId);
      if (res.success && res.data) {
        setMessages(res.data.map((m) => normalizeMessage(m, currentUser?.user_id)));
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error(' [SellerChat] loadMessages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await chatAPI.markAsRead(conversationId);
      setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)));
      window.dispatchEvent(new CustomEvent('chatUnreadCountChanged'));
    } catch (err) {
      console.error(' [SellerChat] markAsRead', err);
    }
  };

  const filteredChats = conversations.filter((c) => {
    const matchSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filterType === 'all' ||
      (filterType === 'unread' && c.unreadCount > 0) ||
      (filterType === 'read' && c.unreadCount === 0);
    return matchSearch && matchFilter;
  });

  const currentChat = conversations.find((c) => c.id === selectedId) || null;

  const handleSend = async () => {
    if (!message.trim() || !currentChat?.otherUserId) return;
    setSending(true);
    try {
      const res = await chatAPI.sendMessage({
        receiverId: currentChat.otherUserId,
        message: message.trim(),
        conversationId: currentChat.id
      });

      if (res.success) {
        const msg = normalizeMessage(res.data, currentUser?.user_id);
        setMessages((prev) => [...prev, msg]);

        if (res.data?.conversation) {
          const conv = normalizeConversation(res.data.conversation, currentUser?.user_id);
          setConversations((prev) => {
            const others = prev.filter((c) => c.id !== conv.id);
            return [conv, ...others];
          });
          setSelectedId(conv.id);
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === currentChat.id
                ? { ...c, lastMessage: msg.text, lastTime: new Date().toISOString() }
                : c
            )
          );
        }
        setMessage('');
      }
    } catch (err) {
      console.error(' [SellerChat] sendMessage', err);
      alert('Gagal mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  return (
    <SellerSidebar>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Chat Pembeli</h1>
          <Card className="shadow">
            <div className="flex h-[650px]">
              <div className="w-80 border-r bg-white flex flex-col">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari pembeli..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilterType('all')}
                    >
                      Semua
                    </Button>
                    <Button
                      size="sm"
                      variant={filterType === 'unread' ? 'default' : 'outline'}
                      onClick={() => setFilterType('unread')}
                    >
                      Belum Dibaca
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="p-6 text-center text-gray-500">Memuat...</div>
                  ) : filteredChats.length === 0 ? (
                    <div className="p-6">
                      <EmptyState
                        title="Belum ada chat"
                        description="Pesan dari pembeli akan muncul di sini."
                        icon="message-circle"
                      />
                    </div>
                  ) : (
                    filteredChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-4 border-b cursor-pointer ${selectedId === chat.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedId(chat.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold flex items-center justify-center">
                            {chat.avatar ? (
                              <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              (chat.name || 'U').slice(0, 2).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-sm text-gray-900">{chat.name}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                  <Circle className={`h-2 w-2 ${chat.isOnline ? 'text-green-500' : 'text-gray-300'}`} />
                                  {chat.isOnline ? 'Online' : 'Offline'}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">{formatTime(chat.lastTime) || '-'}</div>
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-sm text-gray-700 truncate">{chat.lastMessage}</div>
                              {chat.unreadCount > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                  {chat.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-gray-50">
                {currentChat ? (
                  <>
                    <div className="p-4 border-b bg-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold flex items-center justify-center">
                          {currentChat.avatar ? (
                            <img src={currentChat.avatar} alt={currentChat.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            (currentChat.name || 'U').slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{currentChat.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Circle className={`h-2 w-2 ${currentChat.isOnline ? 'text-green-500' : 'text-gray-300'}`} />
                            {currentChat.isOnline ? 'Online' : 'Offline'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="h-5 w-5" />
                        <MoreVertical className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {loadingMessages ? (
                        <div className="text-center text-gray-500">Memuat pesan...</div>
                      ) : messages.length === 0 ? (
                        <div className="text-center text-gray-400">Belum ada pesan</div>
                      ) : (
                        messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-md px-4 py-2 rounded-2xl text-sm shadow ${
                                msg.isMine
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-white text-gray-900 rounded-bl-none border'
                              }`}
                            >
                              <div>{msg.text}</div>
                              <div className={`text-[11px] mt-1 flex items-center gap-1 ${msg.isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                                {msg.isMine ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                {msg.time || <Clock className="h-3 w-3" />}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-4 border-t bg-white">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon"><Image className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder="Tulis pesan..."
                          className="flex-1"
                        />
                        <Button onClick={handleSend} disabled={!message.trim() || sending}>
                          {sending ? '...' : <Send className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    Pilih percakapan untuk melihat pesan
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    </SellerSidebar>
  );
}
