# Ecommerce Notification System

Simple, REST-based notification system for the ecommerce module. Allows admins to send notifications to users and users to manage their notifications.

## Overview

- **Database:** Ecommerce DB only (`ecommerce_db`)
- **Base Route:** `/api/ecommerce/notifications`
- **Authentication:** Required (JWT)
- **Authorization:** Role-based (owner/admin)

## Features

✅ **User Features:**
- List notifications with filters (unread, type, pagination)
- Get unread notification count
- Mark single notification as read
- Mark all notifications as read
- Delete own notifications

✅ **Admin Features:**
- Create direct notifications to specific users
- Broadcast notifications to multiple users
- Delete any notification
- Full CRUD access

✅ **Technical:**
- Pagination (default: 20 per page, max: 100)
- Hard delete (no soft delete)
- Priority support (0-3)
- Metadata JSON field for flexible data
- Entity linking (entityType, entityId, link)

## Database Schema

```sql
CREATE TABLE `notifications` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `type` VARCHAR(100) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `entity_type` VARCHAR(50) NULL,
  `entity_id` INT NULL,
  `link` VARCHAR(500) NULL,
  `is_read` BOOLEAN NOT NULL DEFAULT false,
  `read_at` DATETIME(0) NULL,
  `metadata` JSON NULL,
  `priority` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_notification_user_read_created` (`user_id`, `is_read`, `created_at`),
  INDEX `idx_notification_user` (`user_id`),
  INDEX `idx_notification_type` (`type`),
  INDEX `idx_notification_created` (`created_at`)
);
```

## API Endpoints

### User Endpoints (Authenticated)

#### 1. Get Notifications
```http
GET /api/ecommerce/notifications
```

**Query Parameters:**
- `unread` (boolean): Filter by read status (`true` or `false`)
- `type` (string): Filter by notification type
- `page` (number): Page number (default: 1)
- `pageSize` (number): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "user_id": 123,
        "type": "ORDER_PLACED",
        "title": "Order Confirmed",
        "message": "Your order #1001 has been confirmed",
        "entity_type": "order",
        "entity_id": 1001,
        "link": "/ecommerce/orders/1001",
        "is_read": false,
        "read_at": null,
        "metadata": {"orderId": 1001},
        "priority": 1,
        "created_at": "2025-11-06T10:30:00.000Z",
        "updated_at": "2025-11-06T10:30:00.000Z"
      }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 42,
    "totalPages": 3
  },
  "message": "Notifications retrieved successfully"
}
```

#### 2. Get Unread Count
```http
GET /api/ecommerce/notifications/unread-count
```

**Query Parameters:**
- `type` (string, optional): Filter by notification type

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  },
  "message": "Unread count retrieved successfully"
}
```

#### 3. Mark Single Notification as Read
```http
PATCH /api/ecommerce/notifications/:id/read
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "is_read": true,
    "read_at": "2025-11-06T11:00:00.000Z"
  },
  "message": "Notification marked as read"
}
```

#### 4. Mark All Notifications as Read
```http
PATCH /api/ecommerce/notifications/mark-all-read
```

**Query Parameters:**
- `type` (string, optional): Mark only notifications of this type

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  },
  "message": "5 notification(s) marked as read"
}
```

#### 5. Delete Notification
```http
DELETE /api/ecommerce/notifications/:id
```

**Response:**
```json
{
  "success": true,
  "data": { "id": 1 },
  "message": "Notification deleted successfully"
}
```

### Admin Endpoints

#### 6. Create Notification(s)
```http
POST /api/ecommerce/notifications
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "userIds": [123, 456],
  "type": "ADMIN_BROADCAST",
  "title": "Flash Sale Alert!",
  "message": "Get up to 70% off this weekend only!",
  "entityType": "promotion",
  "entityId": 501,
  "link": "/ecommerce/flash-sale",
  "metadata": {"campaign": "weekend-2025"},
  "priority": 2
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 2
  },
  "message": "2 notification(s) created successfully"
}
```

## Notification Types

Common notification types (you can define your own):

- `ORDER_PLACED` - Order has been placed
- `ORDER_STATUS_UPDATED` - Order status changed
- `ORDER_SHIPPED` - Order has been shipped
- `ORDER_DELIVERED` - Order delivered
- `ORDER_CANCELED` - Order canceled
- `PAYMENT_CONFIRMED` - Payment received
- `PAYMENT_FAILED` - Payment failed
- `REFUND_PROCESSED` - Refund completed
- `NEW_REVIEW_RECEIVED` - Product review received (seller)
- `LOW_STOCK_WARNING` - Product stock low (seller)
- `ADMIN_BROADCAST` - Admin announcement
- `ADMIN_DIRECT` - Direct admin message
- `SYSTEM_MAINTENANCE` - System notification

## Priority Levels

- `0` - Normal (default)
- `1` - Medium
- `2` - High
- `3` - Critical/Urgent

## Usage Examples

### Example 1: User Checks Unread Notifications

```javascript
// Get unread notifications
GET /api/ecommerce/notifications?unread=true&page=1&pageSize=20

// Mark one as read
PATCH /api/ecommerce/notifications/123/read

// Check updated count
GET /api/ecommerce/notifications/unread-count
```

### Example 2: Admin Sends Broadcast

```javascript
POST /api/ecommerce/notifications
{
  "userIds": [101, 102, 103, 104],
  "type": "ADMIN_BROADCAST",
  "title": "New Feature Available!",
  "message": "Check out our new wishlist feature",
  "link": "/ecommerce/wishlist",
  "priority": 1
}
```

### Example 3: Filter by Type

```javascript
// Get only order-related notifications
GET /api/ecommerce/notifications?type=ORDER_PLACED

// Mark all order notifications as read
PATCH /api/ecommerce/notifications/mark-all-read?type=ORDER_PLACED
```

## Testing

### Automated Tests

Run the automated test suite:

```bash
node modules/ecommerce/tests/notifications.test.js
```

**Prerequisites:**
- Server running at `http://localhost:5000`
- Test user account (buyer@example.com / password123)
- Test admin account (admin@example.com / admin123)

The test suite covers:
- ✅ Authentication (user and admin)
- ✅ Unauthorized access blocking
- ✅ Create notifications (admin only)
- ✅ Broadcast notifications
- ✅ Get notifications with filters
- ✅ Unread count
- ✅ Pagination
- ✅ Mark as read (single and all)
- ✅ Delete notifications
- ✅ Security (role-based access)

### Manual REST Tests

Use the REST file at `REST Testing/ecommerce-notifications.http` with VS Code REST Client extension.

## Authorization

### User Permissions
- **Read:** Own notifications only
- **Update:** Mark own notifications as read
- **Delete:** Own notifications only

### Admin Permissions
- **Create:** Any notification for any user(s)
- **Read:** All notifications
- **Update:** Any notification
- **Delete:** Any notification

## Files

- **Service:** `services/ecommerceNotificationService.js`
- **Controller:** `modules/ecommerce/controllers/notificationsController.js`
- **Routes:** `modules/ecommerce/routes/notificationsRoutes.js`
- **Tests:** `modules/ecommerce/tests/notifications.test.js`
- **REST Tests:** `REST Testing/ecommerce-notifications.http`

## Error Handling

Common error responses:

**401 Unauthorized:**
```json
{
  "error": "Access token required",
  "message": "Please provide a valid JWT token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Notification not found or access denied"
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": "userIds must be a non-empty array"
}
```

## Future Enhancements

- [ ] Automatic notifications on events (order placed, payment confirmed, etc.)
- [ ] Email notifications
- [ ] Push notifications
- [ ] WebSocket/SSE for real-time updates
- [ ] Notification templates
- [ ] Bulk operations
- [ ] Notification preferences per user
- [ ] Read receipts tracking

## Notes

- Hard delete only (no soft delete)
- No foreign key constraint to `users` table
- Metadata field allows flexible JSON data
- Migrations stored in `prisma/migrations-ecommerce/`
- Separate from TalentHub and E-Training notification systems
