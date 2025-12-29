# Chat API Documentation

## Overview
API untuk sistem chat/messaging antara buyer dan seller, termasuk chat dengan admin platform.

**Base URL:** `http://localhost:5000/api/chat`

---

## Authentication
Semua endpoint memerlukan authentication token di header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get Conversations

**Endpoint:** `GET /api/chat/conversations`

**Description:** Mendapatkan daftar semua percakapan untuk user yang sedang login

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| role | string | No | Filter by role: 'buyer', 'seller' |
| filter | string | No | Filter type: 'all', 'unread', 'read' |
| search | string | No | Search conversation partner name |
| type | string | No | For seller: 'buyer' or 'admin' |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Conversations retrieved successfully",
  "data": [
    {
      "id": 1,
      "conversationId": 1,
      "buyerId": 5,
      "buyerName": "John Doe",
      "buyerAvatar": "https://example.com/avatar.jpg",
      "sellerId": 3,
      "sellerName": "TechStore Official",
      "sellerAvatar": "https://example.com/shop.jpg",
      "shopName": "TechStore Official",
      "shopAvatar": "🏪",
      "lastMessage": "Terima kasih!",
      "lastMessageTime": "2024-11-24T10:30:00.000Z",
      "unreadCount": 2,
      "isOnline": true,
      "orderHistory": 5,
      "updatedAt": "2024-11-24T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

**Example Request:**
```javascript
// Frontend (using chatAPI.js)
const response = await chatAPI.getConversations({
  role: 'buyer',
  filter: 'unread',
  search: 'TechStore'
});
```

---

### 2. Get Messages

**Endpoint:** `GET /api/chat/conversations/:conversationId/messages`

**Description:** Mendapatkan semua pesan dalam percakapan tertentu

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| conversationId | number | Yes | Conversation ID |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Messages per page (default: 50) |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": 1,
      "messageId": 1,
      "conversationId": 1,
      "senderId": 5,
      "recipientId": 3,
      "senderRole": "buyer",
      "buyerId": 5,
      "message": "Apakah produk ini ready stock?",
      "text": "Apakah produk ini ready stock?",
      "messageType": "text",
      "attachment": null,
      "status": "read",
      "sentAt": "2024-11-24T10:00:00.000Z",
      "createdAt": "2024-11-24T10:00:00.000Z"
    },
    {
      "id": 2,
      "messageId": 2,
      "conversationId": 1,
      "senderId": 3,
      "recipientId": 5,
      "senderRole": "seller",
      "message": "Ya, masih ready stock!",
      "messageType": "text",
      "attachment": null,
      "status": "read",
      "sentAt": "2024-11-24T10:05:00.000Z",
      "createdAt": "2024-11-24T10:05:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "pages": 1
  }
}
```

**Example Request:**
```javascript
const response = await chatAPI.getMessages(conversationId, {
  page: 1,
  limit: 50
});
```

---

### 3. Send Message

**Endpoint:** `POST /api/chat/conversations/:conversationId/messages`

**Description:** Mengirim pesan baru dalam percakapan

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| conversationId | number | Yes | Conversation ID |

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | Yes | Message text |
| messageType | string | No | Type: 'text', 'image', 'file' (default: 'text') |
| attachment | File | No | Attachment file (for image/file type) |

**Response Success (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 3,
    "conversationId": 1,
    "senderId": 5,
    "recipientId": 3,
    "message": "Saya mau order 2 pcs",
    "messageType": "text",
    "attachment": null,
    "status": "sent",
    "sentAt": "2024-11-24T10:10:00.000Z"
  }
}
```

**Example Request:**
```javascript
const response = await chatAPI.sendMessage(conversationId, {
  message: "Halo, apakah ready stock?",
  messageType: "text"
});
```

---

### 4. Send Message (New Conversation)

**Endpoint:** `POST /api/chat/messages`

**Description:** Mengirim pesan pertama (membuat percakapan baru)

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| recipientId | number | Yes | Recipient user ID |
| message | string | Yes | Message text |
| messageType | string | No | Type: 'text', 'image', 'file' |
| attachment | File | No | Attachment file |

**Response Success (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 1,
    "conversationId": 5,
    "senderId": 5,
    "recipientId": 3,
    "message": "Halo, saya tertarik dengan produk ini",
    "messageType": "text",
    "status": "sent",
    "sentAt": "2024-11-24T10:00:00.000Z"
  }
}
```

**Example Request:**
```javascript
const response = await chatAPI.sendMessage(null, {
  recipientId: 3,
  message: "Halo, produk ini masih ada?",
  messageType: "text"
});
```

---

### 5. Mark as Read

**Endpoint:** `PUT /api/chat/conversations/:conversationId/read`

**Description:** Menandai semua pesan dalam percakapan sebagai sudah dibaca

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| conversationId | number | Yes | Conversation ID |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Messages marked as read",
  "data": {
    "conversationId": 1,
    "markedCount": 5
  }
}
```

**Example Request:**
```javascript
await chatAPI.markAsRead(conversationId);
```

---

### 6. Block User

**Endpoint:** `POST /api/chat/block`

**Description:** Memblokir user (tidak akan menerima pesan dari user tersebut)

**Request Body:**
```json
{
  "userId": 3
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "User blocked successfully",
  "data": {
    "blockedUserId": 3,
    "blockedAt": "2024-11-24T10:00:00.000Z"
  }
}
```

**Example Request:**
```javascript
const response = await chatAPI.blockUser(userId);
```

---

### 7. Unblock User

**Endpoint:** `POST /api/chat/unblock`

**Description:** Membuka blokir user

**Request Body:**
```json
{
  "userId": 3
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "User unblocked successfully"
}
```

**Example Request:**
```javascript
const response = await chatAPI.unblockUser(userId);
```

---

### 8. Delete Conversation

**Endpoint:** `DELETE /api/chat/conversations/:conversationId`

**Description:** Menghapus percakapan (soft delete - hanya untuk user yang menghapus)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| conversationId | number | Yes | Conversation ID |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Conversation deleted successfully"
}
```

**Example Request:**
```javascript
await chatAPI.deleteConversation(conversationId);
```

---

### 9. Report User/Conversation

**Endpoint:** `POST /api/chat/report`

**Description:** Melaporkan user atau percakapan yang melanggar aturan

**Request Body:**
```json
{
  "userId": 3,
  "conversationId": 1,
  "reason": "spam",
  "description": "User mengirim spam berkali-kali"
}
```

**Request Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | number | No | User ID to report |
| conversationId | number | No | Conversation ID |
| reason | string | Yes | Reason: 'spam', 'harassment', 'inappropriate_behavior', 'scam', 'other' |
| description | string | Yes | Detailed description |

**Response Success (200):**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "reportId": 1,
    "status": "pending"
  }
}
```

**Example Request:**
```javascript
const response = await chatAPI.reportUser({
  userId: 3,
  conversationId: 1,
  reason: 'spam',
  description: 'User mengirim pesan spam'
});
```

---

### 10. Get or Create Conversation

**Endpoint:** `POST /api/chat/conversations`

**Description:** Mendapatkan percakapan dengan user tertentu, atau membuat baru jika belum ada

**Request Body:**
```json
{
  "userId": 3
}
```

**Response Success (200/201):**
```json
{
  "success": true,
  "message": "Conversation retrieved/created successfully",
  "data": {
    "id": 1,
    "conversationId": 1,
    "userId": 3,
    "userName": "TechStore Official",
    "userAvatar": "https://example.com/avatar.jpg",
    "lastMessage": null,
    "unreadCount": 0,
    "isOnline": false
  }
}
```

**Example Request:**
```javascript
const response = await chatAPI.getOrCreateConversation(userId);
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid request data",
  "details": {
    "message": "Message is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "User is blocked"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Conversation not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Failed to send message"
}
```

---

## Message Status

| Status | Description |
|--------|-------------|
| `sent` | Pesan terkirim ke server |
| `delivered` | Pesan terkirim ke penerima |
| `read` | Pesan sudah dibaca penerima |

---

## Message Types

| Type | Description |
|------|-------------|
| `text` | Plain text message |
| `image` | Image attachment |
| `file` | File attachment |

---

## Frontend Integration

### chatAPI.js Service
File `src/services/chatAPI.js` sudah menyediakan semua fungsi untuk berkomunikasi dengan backend:

```javascript
import chatAPI from '../services/chatAPI';

// Get conversations
const conversations = await chatAPI.getConversations({ role: 'buyer' });

// Get messages
const messages = await chatAPI.getMessages(conversationId);

// Send message
const response = await chatAPI.sendMessage(conversationId, {
  message: "Hello!",
  messageType: "text"
});

// Mark as read
await chatAPI.markAsRead(conversationId);

// Block user
await chatAPI.blockUser(userId);

// Delete conversation
await chatAPI.deleteConversation(conversationId);

// Report user
await chatAPI.reportUser({
  userId: 3,
  reason: 'spam',
  description: 'Spam messages'
});
```

### Components Integration

**ChatPage.jsx (Buyer)**
- Menggunakan `chatAPI.getConversations()` untuk load chat list
- Menggunakan `chatAPI.getMessages()` untuk load messages
- Menggunakan `chatAPI.sendMessage()` untuk kirim pesan
- Auto mark as read saat buka conversation

**SellerChatPage.jsx (Seller)**
- Support 2 mode: chat dengan buyer dan chat dengan admin
- Sama seperti buyer, menggunakan semua fungsi chatAPI
- Tambahan: quick replies untuk respon cepat

---

## Fallback Mode

chatAPI.js mendukung **fallback mode** untuk development/testing:
- Jika backend belum tersedia, API akan return data kosong
- Tidak akan throw error, hanya console warning
- Property `fallback: true` di response menandakan mode fallback aktif

```javascript
const response = await chatAPI.getConversations();

if (response.fallback) {
  console.warn('Backend not available, using fallback mode');
}
```

---

## Real-time Updates (Future Enhancement)

Untuk real-time messaging, pertimbangkan implementasi:
- **WebSocket** untuk instant message delivery
- **Socket.io** untuk typing indicators
- **Server-Sent Events (SSE)** untuk notifications

---

## Security Considerations

1. **Authentication**: Semua endpoint wajib menggunakan JWT token
2. **Authorization**: User hanya bisa akses conversation sendiri
3. **Rate Limiting**: Batasi jumlah pesan per menit (anti-spam)
4. **File Upload**: Validasi tipe file dan ukuran maksimal
5. **XSS Prevention**: Sanitize message content sebelum display
6. **Block System**: User yang diblokir tidak bisa kirim pesan

---

## Database Schema (Reference)

### conversations table
```sql
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT,
  seller_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);
```

### messages table
```sql
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT,
  sender_id INT,
  recipient_id INT,
  message TEXT,
  message_type ENUM('text', 'image', 'file'),
  attachment VARCHAR(255),
  status ENUM('sent', 'delivered', 'read'),
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id)
);
```

### blocked_users table
```sql
CREATE TABLE blocked_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  blocker_id INT,
  blocked_id INT,
  blocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blocker_id) REFERENCES users(id),
  FOREIGN KEY (blocked_id) REFERENCES users(id),
  UNIQUE KEY unique_block (blocker_id, blocked_id)
);
```

### chat_reports table
```sql
CREATE TABLE chat_reports (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reporter_id INT,
  reported_id INT,
  conversation_id INT,
  reason ENUM('spam', 'harassment', 'inappropriate_behavior', 'scam', 'other'),
  description TEXT,
  status ENUM('pending', 'reviewed', 'resolved'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  FOREIGN KEY (reported_id) REFERENCES users(id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

---

## Testing Checklist

- [ ] Get conversations untuk buyer
- [ ] Get conversations untuk seller
- [ ] Get messages untuk conversation tertentu
- [ ] Send message text
- [ ] Send message dengan attachment
- [ ] Mark messages as read
- [ ] Block user
- [ ] Unblock user
- [ ] Delete conversation
- [ ] Report user
- [ ] Create new conversation
- [ ] Filter conversations (all, unread, read)
- [ ] Search conversations
- [ ] Pagination untuk conversations
- [ ] Pagination untuk messages
- [ ] Error handling untuk semua endpoint
- [ ] Authentication validation
- [ ] Authorization validation

---

## Quick Start Guide

### 1. Import chatAPI
```javascript
import chatAPI from '../services/chatAPI';
```

### 2. Load Conversations
```javascript
useEffect(() => {
  const loadChats = async () => {
    const response = await chatAPI.getConversations({
      role: 'buyer',
      filter: 'all'
    });
    
    if (response.success) {
      setChats(response.data);
    }
  };
  
  loadChats();
}, []);
```

### 3. Load Messages
```javascript
const loadMessages = async (conversationId) => {
  const response = await chatAPI.getMessages(conversationId);
  
  if (response.success) {
    setMessages(response.data);
  }
};
```

### 4. Send Message
```javascript
const handleSend = async () => {
  const response = await chatAPI.sendMessage(conversationId, {
    message: message,
    messageType: 'text'
  });
  
  if (response.success) {
    setMessages(prev => [...prev, response.data]);
  }
};
```

---

## Support & Contact

Untuk pertanyaan atau issue terkait Chat API:
- Check console logs untuk debugging
- Review fallback mode behavior
- Verify authentication token
- Check network requests di browser DevTools

---

**Last Updated:** November 24, 2024
**API Version:** 1.0.0
**Status:** Ready for Backend Implementation
