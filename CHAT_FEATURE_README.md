# Seller Chat Feature - Frontend Only

## 📱 Fitur Utama

### 1. **Dual Mode Chat**
- **Chat dengan Buyer** - Komunikasi dengan pembeli
- **Chat dengan Admin** - Komunikasi dengan admin platform

### 2. **Manajemen Percakapan**
- ✅ Daftar chat buyer/admin
- ✅ Search chat berdasarkan nama
- ✅ Filter: Semua / Belum Dibaca
- ✅ Indikator online/offline
- ✅ Jumlah pesan belum dibaca
- ✅ History pesanan buyer
- ✅ Chat baru (tambah kontak)

### 3. **Fitur Messaging**
- ✅ Kirim pesan text
- ✅ Quick replies (template pesan)
- ✅ Status pesan (sent → delivered → read)
- ✅ Timestamp pesan
- ✅ Auto-scroll ke pesan terbaru
- ✅ Enter untuk kirim pesan
- ✅ Bubble chat berbeda untuk seller/buyer

### 4. **Data Storage**
- 💾 **localStorage**: `seller_chats`
- 📊 **Structure**:
```json
{
  "buyer": [
    {
      "id": 1,
      "buyerId": 101,
      "buyerName": "Ahmad Rizki",
      "buyerAvatar": "AR",
      "lastMessage": "Halo...",
      "lastTime": "10:30",
      "unreadCount": 2,
      "isOnline": true,
      "orderHistory": 3,
      "messages": [
        {
          "id": 1,
          "text": "Halo...",
          "sender": "buyer",
          "time": "10:30",
          "status": "read"
        }
      ]
    }
  ],
  "admin": [...]
}
```

### 5. **Dummy Data**
Otomatis terinisialisasi dengan:
- 5 chat buyer (dengan berbagai status)
- 2 chat admin
- Total 7 percakapan sample

## 🎯 Cara Penggunaan

### Untuk Seller:
1. **Buka Halaman Chat** → `/seller/chat`
2. **Pilih Mode** → Buyer atau Admin
3. **Pilih Chat** → Klik kontak di sidebar
4. **Balas Pesan**:
   - Ketik di input box
   - Atau gunakan Quick Replies
   - Tekan Enter / klik tombol kirim
5. **Chat Baru** → Klik tombol "Chat Baru"

### Quick Replies (Buyer Mode):
- Salam
- Ready Stock
- Proses
- Dikirim

### Quick Replies (Admin Mode):
- Mohon Bantuan
- Terima Kasih
- Verifikasi

## 🔧 Utilities (chatUtils.js)

### Functions Available:
```javascript
// Initialize
initializeDummyChats()

// Get data
getAllChats()
getChatById(chatId, mode)
getUnreadCount(mode)
getTotalUnreadCount()
getChatStats()

// Mutations
addMessageToChat(chatId, message, mode)
updateMessageStatus(chatId, messageId, status, mode)
markChatAsRead(chatId, mode)
createNewChat(buyerName, mode)
deleteChat(chatId, mode)

// Simulation
simulateIncomingMessage(chatId, messageText, mode)

// Reset
resetChatData()
```

## 🎨 UI Features

### Header:
- 🍔 Hamburger menu (mobile)
- 🔄 Toggle mode Buyer/Admin
- ➕ Tombol Chat Baru
- 🔔 Badge jumlah belum dibaca

### Sidebar Chat List:
- 🔍 Search bar
- 🏷️ Filter tabs (Semua / Belum Dibaca)
- 👤 Avatar dengan inisial
- 🟢 Indikator online
- 🔴 Badge unread count
- 📦 Order history (buyer mode)

### Chat Area:
- 📸 Avatar & status online
- 👤 Tombol lihat profil
- 📞 Tombol call (UI only)
- ⚙️ Menu options
- 💬 Bubble chat dengan warna berbeda
- ✓ Status indikator (sent/delivered/read)
- 🎯 Quick reply buttons
- 😊 Emoji button (UI only)
- 📷 Photo button (UI only)
- 📎 Attachment button (UI only)

### Message Status:
- ⏰ **Pending** - Clock icon
- ✓ **Sent** - Single check
- ✓✓ **Delivered** - Double check (gray)
- ✓✓ **Read** - Double check (blue)

## 📱 Responsive Design
- Desktop: Sidebar + Chat area
- Mobile: Hamburger menu, collapsible sidebar
- Adaptive layout untuk semua screen size

## 🔮 Backend Integration (Ready)

File sudah siap untuk backend integration:

```javascript
// TODO: Uncomment saat backend ready

// Get conversations
const response = await fetch('/api/chat/conversations', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get messages
const messages = await fetch(`/api/chat/messages/${conversationId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Send message
const send = await fetch('/api/chat/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    conversationId,
    message: messageText,
    messageType: 'text'
  })
});

// Mark as read
await fetch(`/api/chat/read/${conversationId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🎯 Testing Scenarios

1. **Chat dengan Buyer**
   - Pilih chat Ahmad Rizki (2 unread)
   - Lihat pesan masuk
   - Balas dengan quick reply "Ready Stock"
   - Kirim custom message
   - Lihat status berubah: sent → delivered → read

2. **Chat dengan Admin**
   - Switch ke mode Admin
   - Pilih Admin STP (1 unread)
   - Balas pesan
   - Test quick replies

3. **Create New Chat**
   - Klik "Chat Baru"
   - Input nama: "Test User"
   - Mulai percakapan baru

4. **Search & Filter**
   - Search: "ahmad"
   - Filter: Belum Dibaca
   - Cek hasil filtering

## 🚀 Future Enhancements (Backend Required)

- [ ] Upload gambar
- [ ] Upload file attachment
- [ ] Voice message
- [ ] Video call
- [ ] Typing indicator
- [ ] Read receipt real-time
- [ ] Push notifications
- [ ] Message reactions
- [ ] Delete/Edit message
- [ ] Forward message
- [ ] Archive chat
- [ ] Block/Report user
- [ ] Group chat
- [ ] Auto-reply bot
- [ ] Chat analytics

## 📊 Performance

- ⚡ Instant load (localStorage)
- 🔄 Smooth scroll to bottom
- 💾 Persistent data (survive refresh)
- 🎯 Optimized re-renders
- 📱 Mobile-friendly

---

**Status**: ✅ Fully Functional (Frontend Only)  
**Storage**: localStorage  
**Ready for**: Backend Integration
