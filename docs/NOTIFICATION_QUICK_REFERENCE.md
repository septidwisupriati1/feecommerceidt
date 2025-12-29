# E-Commerce Notification System - Quick Reference Guide

## 🚀 For Developers

This guide shows you how to use the e-commerce notification system.

---

## 📦 Existing Service

The notification service is already set up and ready to use:

```javascript
import ecommerceNotificationService from "../../../services/ecommerceNotificationService.js";
```

---

## 🔔 Automatic Notifications (Already Implemented)

All 43 endpoints already have automatic notifications via middleware. **You don't need to do anything for these!**

### Example: How It Works

```javascript
// Route with notification middleware
router.post("/register", registerNotification, authController.register);

// When user registers successfully:
// 1. Controller returns success response
// 2. Middleware intercepts response
// 3. Notification automatically created
// 4. User receives "Selamat datang di Platform E-Commerce!"
```

---

## ✍️ Manual Notification (If Needed)

If you need to create notifications manually (e.g., from a cron job or background process):

### Single Notification

```javascript
await ecommerceNotificationService.createNotifications({
  userIds: [userId],
  type: "SYSTEM", // or "ADMINISTRATOR"
  title: "Judul Notifikasi",
  message: "Pesan notifikasi dalam Bahasa Indonesia",
  entityType: "order", // optional: 'user', 'product', 'order', 'cart', etc.
  entityId: orderId, // optional: related entity ID
});
```

### Multiple Users (Bulk)

```javascript
// Notify all admins
const adminIds = await getAdminUserIds();
await ecommerceNotificationService.createNotifications({
  userIds: adminIds, // Array of user IDs
  type: "ADMINISTRATOR",
  title: "Laporan Baru",
  message: "Ada laporan baru yang memerlukan review",
  entityType: "report",
  entityId: reportId,
});
```

---

## 📖 Reading Notifications (For Frontend)

### Get User Notifications

```javascript
// GET /api/ecommerce/notifications
// Query params: ?unread=true&type=SYSTEM&page=1&pageSize=20

const response = await fetch('/api/ecommerce/notifications?unread=true', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
/*
{
  success: true,
  data: {
    items: [...notifications],
    page: 1,
    pageSize: 20,
    total: 45,
    totalPages: 3
  }
}
*/
```

### Get Unread Count

```javascript
// GET /api/ecommerce/notifications/unread-count

const response = await fetch('/api/ecommerce/notifications/unread-count', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
/*
{
  success: true,
  data: { count: 5 }
}
*/
```

### Mark as Read

```javascript
// PATCH /api/ecommerce/notifications/:id/read

await fetch(`/api/ecommerce/notifications/${notificationId}/read`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Mark All as Read

```javascript
// PATCH /api/ecommerce/notifications/mark-all-read

await fetch('/api/ecommerce/notifications/mark-all-read', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Delete Notification

```javascript
// DELETE /api/ecommerce/notifications/:id

await fetch(`/api/ecommerce/notifications/${notificationId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🎨 Notification Object Structure

```javascript
{
  id: 123,
  user_id: 456,
  type: "SYSTEM", // or "ADMINISTRATOR"
  title: "Pesanan Dibuat",
  message: "Pesanan Anda #ORD-001 berhasil dibuat. Total: Rp 150.000.",
  entity_type: "order", // optional
  entity_id: 789, // optional
  link: "/orders/789", // optional
  is_read: false,
  read_at: null,
  metadata: null, // optional (not used in MVP)
  priority: 0, // default
  created_at: "2025-11-18T10:30:00.000Z", // GMT +7
  updated_at: "2025-11-18T10:30:00.000Z"
}
```

---

## 📝 Notification Types

### SYSTEM
Regular user notifications for their actions or transactions.

**Use for:**
- Order updates
- Payment confirmations
- Account changes
- Product actions
- Shopping cart updates

**Recipients:** Buyers, Sellers, Regular Users

### ADMINISTRATOR
Admin-specific operations and moderation actions.

**Use for:**
- Payment rejections
- Review moderation
- User management
- Administrative tasks

**Recipients:** Admins only

---

## 🌍 Message Guidelines

### Language
All messages **MUST be in Bahasa Indonesia**.

**Good:**
```javascript
message: "Pesanan Anda telah berhasil dibuat."
```

**Bad:**
```javascript
message: "Your order has been created." // ❌ English
```

### Timezone
All timestamps are in **GMT +7 (Asia/Jakarta)**.

This is handled automatically by the database, no action needed.

---

## 🔧 Helper Functions in Middleware

### Get Admin User IDs

```javascript
import { getAdminUserIds } from "../middleware/ecommerceNotificationMiddleware.js";

const adminIds = await getAdminUserIds();
// Returns: [1, 5, 12] (array of admin user_ids)
```

### Order Delivered Notification (Manual)

```javascript
import { orderDeliveredNotification } from "../middleware/ecommerceNotificationMiddleware.js";

// Call from cron job or webhook
await orderDeliveredNotification(
  orderId,
  orderNumber,
  buyerId,
  sellerId
);
```

---

## 🐛 Debugging

### Check Notification Logs

```bash
# Server logs show notification creation
📢 [ECOMMERCE] Registration notification sent to user 123
📢 [ECOMMERCE] Order create notification sent to buyer 456
📢 [ECOMMERCE] Order create notification sent to seller 789
```

### Database Queries

```sql
-- Latest notifications
SELECT id, user_id, type, title, created_at 
FROM notifications 
ORDER BY created_at DESC 
LIMIT 10;

-- Notifications for user
SELECT * FROM notifications 
WHERE user_id = 123 
ORDER BY created_at DESC;

-- Unread notifications
SELECT COUNT(*) FROM notifications 
WHERE user_id = 123 AND is_read = false;

-- Notifications by type
SELECT type, COUNT(*) 
FROM notifications 
GROUP BY type;
```

---

## ⚠️ Common Issues

### Issue: Notification not created

**Check:**
1. Is the endpoint successful? (200-299 status)
2. Is the middleware added to the route?
3. Check server logs for errors
4. Verify user_id is available in request/response

### Issue: Wrong notification type

**Fix:**
```javascript
// For admin operations
type: "ADMINISTRATOR"

// For regular user operations
type: "SYSTEM"
```

### Issue: Notification created but not showing

**Check:**
1. Is user_id correct?
2. Query notifications table directly
3. Check frontend is calling correct API endpoint
4. Verify authentication token is valid

---

## 📚 Examples

### Example 1: Order Status Update

```javascript
// In orderController.js or cron job
if (orderStatus === 'delivered') {
  await ecommerceNotificationService.createNotifications({
    userIds: [buyerId, sellerId],
    type: "SYSTEM",
    title: "Pesanan Sampai",
    message: `Pesanan #${orderNumber} telah sampai ke pembeli.`,
    entityType: "order",
    entityId: orderId,
  });
}
```

### Example 2: Notify All Admins

```javascript
// Get admin IDs
const adminIds = await prisma.users.findMany({
  where: {
    user_roles: { some: { role_type: "admin" } },
    status: "active"
  },
  select: { user_id: true }
}).then(admins => admins.map(a => a.user_id));

// Create notification
await ecommerceNotificationService.createNotifications({
  userIds: adminIds,
  type: "SYSTEM",
  title: "Pembayaran Menunggu Verifikasi",
  message: `Pembayaran pesanan #${orderNumber} menunggu verifikasi Anda.`,
  entityType: "order",
  entityId: orderId,
});
```

### Example 3: Critical Alert

```javascript
await ecommerceNotificationService.createNotifications({
  userIds: [userId],
  type: "SYSTEM",
  title: "Peringatan Keamanan",
  message: "Password Anda telah diubah. Jika bukan Anda, segera hubungi support.",
  entityType: "user",
  entityId: userId,
  priority: 1, // Higher priority
});
```

---

## 🎯 Best Practices

1. **Always use Bahasa Indonesia** for messages
2. **Use SYSTEM type** for user actions, **ADMINISTRATOR** for admin actions
3. **Include entity_type and entity_id** for tracking
4. **Keep messages clear and actionable**
5. **Don't block main operations** - notifications are async
6. **Log notification creation** for debugging
7. **Test notifications** after implementing new features

---

## 📞 Support

For questions or issues:
1. Check `NOTIFICATION_SYSTEM_README.md` in `/modules/ecommerce/docs/`
2. Check `NOTIFICATION_IMPLEMENTATION_COMPLETE.md` for full details
3. Review middleware code in `/modules/ecommerce/middleware/ecommerceNotificationMiddleware.js`

---

**Status:** 🟢 Fully Operational  
**Last Updated:** November 18, 2025
