# E-Commerce Notification System

## Overview

Sistem notifikasi e-commerce dirancang untuk memberitahu pengguna tentang aktivitas penting mereka dan transaksi bisnis. Sistem ini menggunakan dua tipe notifikasi utama:

- **SYSTEM**: Notifikasi untuk user reguler (pembeli, penjual) tentang aksi mereka atau transaksi standar
- **ADMINISTRATOR**: Notifikasi untuk admin yang melakukan operasi administratif, verifikasi, atau moderasi

---

## Architecture

### Database Schema

Semua notifikasi disimpan di tabel `notifications` dengan struktur berikut:

```sql
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(50),           -- SYSTEM atau ADMINISTRATOR
  title VARCHAR(255),         -- Judul singkat
  message TEXT,               -- Pesan lengkap (Bahasa Indonesia)
  entity_type VARCHAR(50),    -- Tipe entitas (order, product, review, etc.)
  entity_id INT,              -- ID entitas
  is_read BOOLEAN DEFAULT false,
  read_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);
```

### Timezone

Semua timestamp disimpan dan ditampilkan dalam **GMT +7 (Asia/Jakarta)**.

---

## Notification Service

### Location
`services/ecommerceNotificationService.js`

### Main Methods

#### 1. Create Notification
```javascript
await ecommerceNotificationService.createNotifications({
  userIds: [1, 2, 3],
  type: "SYSTEM",
  title: "Order Created",
  message: "Pesanan Anda telah berhasil dibuat",
  entityType: "order",
  entityId: 123,
});
```

#### 2. List Notifications
```javascript
const result = await ecommerceNotificationService.listNotifications({
  userId: 1,
  unread: true,  // null untuk semua
  type: "SYSTEM", // null untuk semua
  page: 1,
  pageSize: 20,
});
```

#### 3. Count Unread
```javascript
const count = await ecommerceNotificationService.countUnread(userId, type);
```

#### 4. Mark as Read
```javascript
await ecommerceNotificationService.markAsRead(notificationId, userId);
```

#### 5. Mark All as Read
```javascript
const result = await ecommerceNotificationService.markAllAsRead(userId, type);
```

#### 6. Delete Notification
```javascript
await ecommerceNotificationService.deleteNotification(notificationId, userId);
```

---

## API Endpoints

### Get Notifications
```
GET /api/ecommerce/notifications
Authorization: Bearer {token}

Query Parameters:
- unread: true|false|null (default: null)
- type: SYSTEM|ADMINISTRATOR|null (default: null)
- page: number (default: 1)
- pageSize: number (default: 20, max: 100)

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "user_id": 1,
        "type": "SYSTEM",
        "title": "Pesanan Dibuat",
        "message": "Pesanan #ORD-123 berhasil dibuat",
        "entity_type": "order",
        "entity_id": 123,
        "is_read": false,
        "created_at": "2025-11-18T10:30:00+07:00",
        "updated_at": "2025-11-18T10:30:00+07:00"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Get Unread Count
```
GET /api/ecommerce/notifications/unread-count
Authorization: Bearer {token}

Query Parameters:
- type: SYSTEM|ADMINISTRATOR|null (default: null)

Response:
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### Mark as Read
```
PATCH /api/ecommerce/notifications/:id/read
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "is_read": true,
    "read_at": "2025-11-18T10:35:00+07:00"
  }
}
```

### Mark All as Read
```
PATCH /api/ecommerce/notifications/mark-all-read
Authorization: Bearer {token}

Query Parameters:
- type: SYSTEM|ADMINISTRATOR|null (default: null)

Response:
{
  "success": true,
  "data": {
    "count": 5
  },
  "message": "5 notification(s) marked as read"
}
```

### Delete Notification
```
DELETE /api/ecommerce/notifications/:id
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": 1,
    "deleted": true
  }
}
```

### Admin Create Notification
```
POST /api/ecommerce/notifications
Authorization: Bearer {admin_token}

Body:
{
  "userIds": [1, 2, 3],
  "type": "SYSTEM",
  "title": "Maintenance Alert",
  "message": "Sistem sedang dalam pemeliharaan",
  "entityType": "system",
  "entityId": null,
  "link": "/maintenance",
  "priority": 1
}

Response:
{
  "success": true,
  "data": {
    "count": 3
  },
  "message": "3 notification(s) created successfully"
}
```

---

## Implementation Guide

### Step 1: Import Service
```javascript
import ecommerceNotificationService from "../../../services/ecommerceNotificationService.js";
```

### Step 2: Create Notification in Controller

#### Example: Order Creation
```javascript
export const createOrder = async (req, res) => {
  try {
    // ... existing order creation logic ...

    // Create notifications
    await ecommerceNotificationService.createNotifications({
      userIds: [buyerId],
      type: "SYSTEM",
      title: "Pesanan Dibuat",
      message: `Pesanan #${orderNumber} berhasil dibuat. Total: Rp ${totalAmount}. Silakan lakukan pembayaran.`,
      entityType: "order",
      entityId: orderId,
    });

    await ecommerceNotificationService.createNotifications({
      userIds: [sellerId],
      type: "SYSTEM",
      title: "Pesanan Baru",
      message: `Pesanan baru #${orderNumber} diterima! Menunggu konfirmasi pembayaran.`,
      entityType: "order",
      entityId: orderId,
    });

    res.status(201).json({ success: true, data: orderData });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
```

#### Example: Payment Approval
```javascript
export const approvePayment = async (req, res) => {
  try {
    // ... existing payment approval logic ...

    // Notify buyer
    await ecommerceNotificationService.createNotifications({
      userIds: [buyerId],
      type: "SYSTEM",
      title: "Pembayaran Disetujui",
      message: `Pembayaran pesanan #${orderNumber} telah diverifikasi dan disetujui! Pesanan sedang diproses.`,
      entityType: "order",
      entityId: orderId,
    });

    // Notify seller
    await ecommerceNotificationService.createNotifications({
      userIds: [sellerId],
      type: "SYSTEM",
      title: "Pembayaran Dikonfirmasi",
      message: `Pembayaran pesanan #${orderNumber} telah dikonfirmasi! Silakan siapkan barang untuk dikirim.`,
      entityType: "order",
      entityId: orderId,
    });

    res.json({ success: true, data: paymentData });
  } catch (error) {
    console.error("Error approving payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
```

#### Example: Review Moderation (Admin)
```javascript
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ... existing review update logic ...

    if (status === "approved") {
      // Notify reviewer
      await ecommerceNotificationService.createNotifications({
        userIds: [reviewerId],
        type: "SYSTEM",
        title: "Review Disetujui",
        message: "Review Anda telah disetujui dan sekarang terlihat oleh pembeli lain!",
        entityType: "review",
        entityId: id,
      });

      // Notify seller
      await ecommerceNotificationService.createNotifications({
        userIds: [sellerId],
        type: "SYSTEM",
        title: "Review Disetujui",
        message: `Review untuk produk '${productName}' telah disetujui dan sekarang publik.`,
        entityType: "review",
        entityId: id,
      });
    } else if (status === "rejected") {
      // Notify reviewer
      await ecommerceNotificationService.createNotifications({
        userIds: [reviewerId],
        type: "ADMINISTRATOR",
        title: "Review Ditolak",
        message: `Review Anda telah ditolak. Alasan: ${adminNotes}`,
        entityType: "review",
        entityId: id,
      });
    }

    res.json({ success: true, data: reviewData });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
```

---

## Notification Types & Messages

### 1. SYSTEM - Buyer/Seller Actions

| Event | Recipient | Message |
|-------|-----------|---------|
| Registration | Buyer | "Selamat datang di Platform E-Commerce! Akun Anda telah berhasil dibuat..." |
| Email Verified | User | "Verifikasi email berhasil! Akun Anda sekarang fully activated." |
| Password Changed | User | "Password Anda telah berhasil diubah. Jika ini bukan tindakan Anda..." |
| Profile Updated | User | "Profil Anda telah berhasil diperbarui." |
| Product Created | Seller | "Produk '{name}' berhasil dibuat dan sekarang terlihat oleh pembeli." |
| Product Updated | Seller | "Produk '{name}' telah berhasil diperbarui." |
| Product Deleted | Seller | "Produk '{name}' telah berhasil dihapus." |
| Order Created | Buyer/Seller | "Pesanan #{number} berhasil dibuat..." / "Pesanan baru #{number} diterima!..." |
| Order Cancelled | Buyer/Seller | "Pesanan #{number} telah berhasil dibatalkan..." / "Pesanan #{number} telah dibatalkan oleh pembeli." |
| Payment Uploaded | Buyer/Admin | "Bukti pembayaran untuk pesanan #{number} berhasil diupload..." / "Pembayaran pesanan #{number} menunggu verifikasi." |
| Payment Approved | Buyer/Seller | "Pembayaran pesanan #{number} telah diverifikasi dan disetujui!..." / "Pembayaran pesanan #{number} telah dikonfirmasi!..." |
| Shipping Info | Buyer/Seller | "Pesanan #{number} sedang dalam perjalanan!..." / "Informasi pengiriman untuk pesanan #{number} berhasil dicatat." |
| Order Delivered | Buyer/Seller | "Pesanan #{number} telah tiba! Silakan konfirmasi penerimaan..." / "Pesanan #{number} telah sampai ke pembeli." |
| Review Created | Reviewer/Seller | "Review Anda berhasil disubmit dan sedang dalam verifikasi." / "Review baru untuk produk '{name}': {rating}/5 bintang" |

### 2. ADMINISTRATOR - Admin Actions

| Event | Recipient | Message |
|-------|-----------|---------|
| Payment Rejected | Admin | "Pembayaran pesanan #{number} telah Anda tolak." |
| Variant Added | Admin | "Varian '{name}' ditambahkan ke produk '{product_name}'." |
| Variant Updated | Admin | "Varian produk berhasil diperbarui." |
| Variant Deleted | Admin | "Varian produk telah dihapus." |
| Review Approved | Admin/Reviewer | (Notifies reviewer & seller as SYSTEM) |
| Review Rejected | Admin/Reviewer | (Notifies reviewer as ADMINISTRATOR) |
| Review Deleted | Admin/Reviewer | (Notifies reviewer as ADMINISTRATOR) |
| User Created | Admin/New User | "User baru '{email}' berhasil dibuat." / "Akun telah dibuat oleh admin..." |
| User Updated | Admin/User | "User '{email}' berhasil diperbarui." / "Informasi akun Anda telah diperbarui oleh administrator." |
| User Deleted | Admin/User | "User '{email}' berhasil dinonaktifkan." / "Akun Anda telah dinonaktifkan..." |
| Order Transferred | Admin/Seller | "Pesanan #{number} telah dicatat sebagai transfer selesai." / "Pembayaran pesanan #{number} telah ditransfer ke rekening Anda!" |

---

## Testing

### Run Test Suite
```bash
cd modules/ecommerce/tests/testjs
node test-notifications.js
```

### Test Coverage

The test file `test-notifications.js` includes automated tests for:

1. ✅ User Registration
2. ✅ Password Change
3. ✅ Forgot Password
4. ✅ Profile Update
5. ✅ Profile Picture Deletion
6. ✅ Store Update
7. ✅ Product Creation
8. ✅ Product Update
9. ✅ Product Deletion
10. ✅ Add to Cart
11. ✅ Order Creation
12. ✅ Order Cancellation
13. ✅ Payment Approval
14. ✅ Payment Rejection
15. ✅ Shipping Info Input
16. ✅ Review Approval
17. ✅ Product Report
18. ✅ Admin User Creation
19. ✅ Bank Account Addition

### Manual Testing with Postman

**Step 1: Get Notifications**
```
GET http://localhost:3000/api/ecommerce/notifications
Authorization: Bearer {token}
```

**Step 2: Get Unread Count**
```
GET http://localhost:3000/api/ecommerce/notifications/unread-count
Authorization: Bearer {token}
```

**Step 3: Mark as Read**
```
PATCH http://localhost:3000/api/ecommerce/notifications/1/read
Authorization: Bearer {token}
```

**Step 4: Mark All as Read**
```
PATCH http://localhost:3000/api/ecommerce/notifications/mark-all-read
Authorization: Bearer {token}
```

**Step 5: Delete Notification**
```
DELETE http://localhost:3000/api/ecommerce/notifications/1
Authorization: Bearer {token}
```

---

## Best Practices

### 1. Always Create Notifications After Successful Operations
```javascript
// Good
if (operationSuccessful) {
  await notificationService.createNotifications({...});
  res.json({ success: true, data });
}

// Bad - Don't create notifications before confirming success
```

### 2. Use Consistent Message Format
- Pesan dimulai dengan aksi atau status
- Include identifiers (order number, product name, etc.)
- Use Bahasa Indonesia for all messages
- Be clear and concise

### 3. Always Include Entity Type and Entity ID
```javascript
// Good
await notificationService.createNotifications({
  userIds: [1],
  type: "SYSTEM",
  message: "...",
  entityType: "order",   // ✅ Always specify
  entityId: 123,         // ✅ Always specify
});

// Helps with filtering and linking
```

### 4. Handle Errors Gracefully
```javascript
try {
  await notificationService.createNotifications({...});
} catch (error) {
  console.error("Failed to create notification:", error);
  // Continue operation - don't fail main operation if notification fails
}
```

### 5. Batch Notifications When Notifying Multiple Users
```javascript
// Good - notify multiple users at once
await notificationService.createNotifications({
  userIds: [buyerId, sellerId, adminId], // Array of recipients
  type: "SYSTEM",
  message: "...",
});
```

---

## Troubleshooting

### Notifications Not Appearing

1. **Check Database Connection**
   ```bash
   npm run db:generate
   npm run db:reset:ecommerce
   ```

2. **Verify User IDs**
   - Ensure user_id exists in users table
   - Check user hasn't been deleted

3. **Check Query Filters**
   - Use `GET /api/ecommerce/notifications?unread=false` to see read notifications
   - Use `type=SYSTEM` or `type=ADMINISTRATOR` to filter by type

### Performance Issues

1. **Use Pagination**
   - Always use page and pageSize parameters
   - Default pageSize is 20, max is 100

2. **Index on Created_at**
   - Notifications are ordered by priority DESC, then created_at DESC
   - This is optimized with database indexes

---

## Future Enhancements (Not in MVP)

- [ ] Email notifications
- [ ] SMS notifications
- [ ] Push notifications (mobile app)
- [ ] Notification preferences (opt-in/out)
- [ ] Notification scheduling
- [ ] Batch processing for high-volume events
- [ ] Notification archival
- [ ] Webhook integrations

---

## Support

For issues or questions about the notification system, please refer to:
- Main documentation: `/Temp/ECOMMERCE_NOTIFICATION_MAPPING_V2.md`
- Test file: `/modules/ecommerce/tests/testjs/test-notifications.js`
- Service code: `/services/ecommerceNotificationService.js`

---

**Version:** 2.0 (MVP)  
**Last Updated:** November 18, 2025  
**Timezone:** GMT +7 (Asia/Jakarta)
