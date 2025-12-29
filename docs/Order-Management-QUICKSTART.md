# Quick Start Guide - E-Commerce Order Management

## ✅ Implementation Complete!

The order management system has been successfully implemented with the following features:

### 🎯 Features Implemented

1. **Order Creation (Checkout per Seller)**
   - Creates order from cart items for one seller at a time
   - Automatic stock locking (First Come First Served)
   - Snapshot of shipping address and product details
   - Manual transfer payment with seller's bank account

2. **Stock Management**
   - Stock is automatically locked when order is created
   - Stock is restored when order is cancelled
   - Transaction-based to prevent race conditions

3. **Payment Management**
   - Manual transfer payment method
   - Upload payment proof (images)
   - Payment status tracking

4. **Order Management**
   - View all orders with pagination
   - Filter by status
   - View order detail
   - Cancel order (only pending orders)

### 📁 Files Created/Modified

#### New Files:
- `modules/ecommerce/controllers/orderController.js` - Order business logic
- `modules/ecommerce/routes/orderRoutes.js` - API routes
- `modules/ecommerce/middleware/uploadMiddleware.js` - File upload middleware
- `modules/ecommerce/tests/orderRoutes.rest` - API testing file
- `Panduan API/Order-Management-README.md` - Complete documentation

#### Modified Files:
- `prisma/schema-ecommerce.prisma` - Added orders & order_items tables, enums
- `index.js` - Registered order routes

#### Database:
- `orders` table - Main order information
- `order_items` table - Order line items
- New enums: `payment_method`, `payment_status`, `order_status`

### 🚀 How to Test

#### 1. Prerequisites
```bash
# Server is already running on http://localhost:3000
# You need:
- A buyer account with JWT token
- At least one shipping address
- Products in cart from a seller
- Seller's bank account ID
```

#### 2. Testing Flow

**Step 1: Add Items to Cart**
```http
POST http://localhost:3000/api/ecommerce/buyer/cart
Authorization: Bearer YOUR_BUYER_TOKEN
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

**Step 2: View Cart (Grouped by Seller)**
```http
GET http://localhost:3000/api/ecommerce/buyer/cart
Authorization: Bearer YOUR_BUYER_TOKEN
```

**Step 3: Get Seller's Bank Account**
```http
GET http://localhost:3000/api/ecommerce/buyer/products/1
# Or check seller profile to get bank_account_id
```

**Step 4: Create Order (Checkout)**
```http
POST http://localhost:3000/api/ecommerce/buyer/orders/checkout
Authorization: Bearer YOUR_BUYER_TOKEN
Content-Type: application/json

{
  "seller_id": 1,
  "shipping_address_id": 1,
  "bank_account_id": 1,
  "buyer_notes": "Mohon kirim dengan bubble wrap"
}
```

**Step 5: View Orders**
```http
GET http://localhost:3000/api/ecommerce/buyer/orders
Authorization: Bearer YOUR_BUYER_TOKEN
```

**Step 6: Get Order Detail**
```http
GET http://localhost:3000/api/ecommerce/buyer/orders/1
Authorization: Bearer YOUR_BUYER_TOKEN
```

**Step 7: Upload Payment Proof (Optional)**
```http
POST http://localhost:3000/api/ecommerce/buyer/orders/1/payment-proof
Authorization: Bearer YOUR_BUYER_TOKEN
Content-Type: multipart/form-data

[Upload payment_proof image file]
```

**Step 8: Cancel Order (Optional - only pending)**
```http
PUT http://localhost:3000/api/ecommerce/buyer/orders/1/cancel
Authorization: Bearer YOUR_BUYER_TOKEN
Content-Type: application/json

{
  "cancel_reason": "Saya berubah pikiran"
}
```

### 📊 Order Status Flow

```
1. pending → Order created, waiting for payment
2. paid → Payment proof uploaded, waiting seller confirmation
3. processing → Seller confirmed (future feature)
4. shipped → Order shipped (future feature)
5. delivered → Order delivered (future feature)
6. completed → Order completed (future feature)
7. cancelled → Order cancelled (stock restored)
```

### 🔒 Stock Locking Example

**Scenario:**
- Product A has 5 items in stock
- User 1 adds 5 items to cart
- User 2 adds 3 items to cart

**What happens:**
1. User 1 checks out first → Order created, stock becomes 0 ✅
2. User 2 tries to checkout → Error: "Stok tidak cukup" ❌
3. User 1 cancels order → Stock restored to 5 ✅
4. User 2 can now checkout → Order created, stock becomes 2 ✅

**First Come First Served!**

### 📝 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ecommerce/buyer/orders/checkout` | Create order from cart |
| GET | `/api/ecommerce/buyer/orders` | Get all orders |
| GET | `/api/ecommerce/buyer/orders?status=pending` | Filter by status |
| GET | `/api/ecommerce/buyer/orders/:orderId` | Get order detail |
| POST | `/api/ecommerce/buyer/orders/:orderId/payment-proof` | Upload payment proof |
| PUT | `/api/ecommerce/buyer/orders/:orderId/cancel` | Cancel order |

### 🎨 Frontend Integration Tips

**Cart Page:**
```javascript
// Show cart grouped by seller
sellers.forEach(seller => {
  // Display seller info
  // Display seller items
  // Show "Checkout" button per seller
  // Pass seller_id to checkout
});
```

**Checkout Page:**
```javascript
// 1. Select shipping address (dropdown)
// 2. Show seller's bank accounts (dropdown)
// 3. Show order summary
// 4. Add buyer notes (textarea)
// 5. Submit order
```

**Payment Page (After Order Created):**
```javascript
// Show bank account details for transfer:
// - Bank Name
// - Account Number
// - Account Name
// - Total Amount

// Upload payment proof form
// After upload, status changes to "paid"
```

**Order List Page:**
```javascript
// Show orders with status badges
// Filter by status dropdown
// Pagination
// Click to view detail
```

**Order Detail Page:**
```javascript
// Show complete order information
// Show payment status
// Show shipping address
// Show items list
// Show timeline (created_at, paid_at, etc.)
// "Cancel" button (if status = pending)
// "Upload Payment" button (if status = pending and no proof)
```

### 🔐 Security Features

1. **Authentication Required:** All endpoints require valid JWT token
2. **Authorization:** Users can only access their own orders
3. **Transaction Safety:** All operations use database transactions
4. **Stock Validation:** Real-time stock checking before order creation
5. **File Validation:** Payment proof upload validates file type & size

### 📦 Database Structure

**orders table:**
- Order header information
- Shipping address snapshot
- Payment information
- Status tracking
- Timestamps for each status change

**order_items table:**
- Product snapshot (name, price, image)
- Variant information
- Quantity and pricing

**Why Snapshot?**
- Order data remains unchanged even if product is modified/deleted
- Historical accuracy for reporting
- Legal compliance for transactions

### 🛠️ Development Notes

**Transaction Usage:**
```javascript
// All critical operations use transactions
await prisma.$transaction(async (tx) => {
  // 1. Validate
  // 2. Create order
  // 3. Update stock (LOCK)
  // 4. Clear cart
  // If any step fails, all changes rollback
});
```

**Stock Locking Implementation:**
```javascript
// Decrement stock immediately on order
await tx.products.update({
  where: { product_id },
  data: { stock: { decrement: quantity } }
});

// Restore stock on cancellation
await tx.products.update({
  where: { product_id },
  data: { stock: { increment: quantity } }
});
```

### 🐛 Common Issues & Solutions

**Issue 1: "Stok tidak cukup"**
- Solution: Another user checked out first. Stock is locked for their order.

**Issue 2: "Order tidak bisa dibatalkan"**
- Solution: Only pending orders can be cancelled. Once paid, seller must process.

**Issue 3: "Alamat pengiriman tidak ditemukan"**
- Solution: Create shipping address first via `/api/ecommerce/shipping-addresses`

**Issue 4: "Tidak ada item dari seller ini di keranjang"**
- Solution: Add items to cart first. Make sure items are from the specified seller.

### 📚 Related Documentation

- **Complete API Documentation:** `Panduan API/Order-Management-README.md`
- **API Testing File:** `modules/ecommerce/tests/orderRoutes.rest`
- **Database Schema:** `prisma/schema-ecommerce.prisma`
- **Cart API:** Check existing cart documentation

### ✨ Next Steps (Future Features)

Phase 2:
- [ ] Seller order management endpoints
- [ ] Automatic shipping cost calculation
- [ ] Order status updates by seller
- [ ] Delivery tracking

Phase 3:
- [ ] Virtual Account payment integration
- [ ] E-wallet integration
- [ ] Multi-seller checkout in one transaction
- [ ] Rating & review system

### 🎉 Success!

Your order management system is now ready to use! The implementation includes:
- ✅ Complete order creation flow
- ✅ Automatic stock locking
- ✅ Payment proof upload
- ✅ Order cancellation with stock restoration
- ✅ Transaction safety
- ✅ Complete documentation
- ✅ REST API test file

**Start testing with the REST file:** `modules/ecommerce/tests/orderRoutes.rest`

---

**Questions or Issues?**
Refer to the complete documentation in `Panduan API/Order-Management-README.md`
