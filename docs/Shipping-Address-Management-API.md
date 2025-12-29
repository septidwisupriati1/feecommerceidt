# Shipping Address Management API Documentation

## 📋 Overview

Comprehensive shipping address management system untuk E-Commerce module dengan support untuk multiple addresses dan **hanya 1 address yang boleh jadi primary/main address** per user.

---

## 🎯 Key Features

### 1. **Multiple Shipping Addresses**
- User bisa memiliki banyak alamat (rumah, kantor, kos, dll)
- Setiap address punya label untuk identifikasi mudah
- Complete Indonesian address format (province, regency, district, village, postal code)

### 2. **Primary Address Management**
- **ONLY ONE address dapat menjadi primary per user**
- First address otomatis jadi primary
- Bisa switch primary address kapan saja
- **Auto-switch** jika primary address dihapus

### 3. **CRUD Operations**
- Create new address
- Read all/single/primary address
- Update address (partial/full)
- Delete address with auto primary management

### 4. **Security & Authorization**
- User hanya bisa access address mereka sendiri
- JWT authentication required
- Activity logging untuk semua operations

---

## 📊 Database Schema

```prisma
model shipping_addresses {
  address_id    Int      @id @default(autoincrement())
  user_id       Int
  label         String   @db.VarChar(50)       // "Rumah", "Kantor", "Kos"
  recipient_name String  @db.VarChar(100)
  phone         String   @db.VarChar(20)
  province      String   @db.VarChar(100)
  regency       String   @db.VarChar(100)
  district      String   @db.VarChar(100)
  village       String   @db.VarChar(100)
  postal_code   String   @db.VarChar(10)
  full_address  String   @db.Text
  is_primary    Boolean  @default(false)       // Only ONE can be true per user
  created_at    DateTime @default(now())
  updated_at    DateTime @default(now())
  
  user          users    @relation(...)
}
```

**Indexes:**
- `fk_shipping_address_user` - Fast lookup by user_id
- `idx_shipping_primary` - Fast primary address queries

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:5000/api/ecommerce/shipping-addresses
```

### Authentication
All endpoints require JWT token:
```
Authorization: Bearer <token>
```

---

## 📝 Endpoint Details

### 1. Get All Addresses
**GET** `/api/ecommerce/shipping-addresses`

Get all shipping addresses for current user, sorted by primary first.

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Shipping addresses retrieved successfully",
  "data": [
    {
      "address_id": 3,
      "user_id": 9,
      "label": "Kantor",
      "recipient_name": "John Doe",
      "phone": "081234567890",
      "province": "DKI Jakarta",
      "regency": "Jakarta Selatan",
      "district": "Kuningan",
      "village": "Kuningan Timur",
      "postal_code": "12950",
      "full_address": "Gedung Plaza Indonesia, Jl. Kuningan No. 88",
      "is_primary": true,
      "created_at": "2025-11-05T02:43:34.000Z",
      "updated_at": "2025-11-05T02:43:34.000Z"
    },
    {
      "address_id": 1,
      "user_id": 9,
      "label": "Rumah",
      "recipient_name": "John Doe",
      "phone": "081234567890",
      "province": "DKI Jakarta",
      "regency": "Jakarta Pusat",
      "district": "Menteng",
      "village": "Menteng",
      "postal_code": "10310",
      "full_address": "Jl. Menteng Raya No. 45, Jakarta Pusat",
      "is_primary": false,
      "created_at": "2025-11-05T02:42:40.000Z",
      "updated_at": "2025-11-05T02:42:40.000Z"
    }
  ]
}
```

---

### 2. Get Primary Address
**GET** `/api/ecommerce/shipping-addresses/primary`

Get the main/primary shipping address for checkout.

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Primary address retrieved successfully",
  "data": {
    "address_id": 3,
    "user_id": 9,
    "label": "Kantor",
    "recipient_name": "John Doe",
    "phone": "081234567890",
    "province": "DKI Jakarta",
    "regency": "Jakarta Selatan",
    "district": "Kuningan",
    "village": "Kuningan Timur",
    "postal_code": "12950",
    "full_address": "Gedung Plaza Indonesia, Jl. Kuningan No. 88",
    "is_primary": true,
    "created_at": "2025-11-05T02:43:34.000Z",
    "updated_at": "2025-11-05T02:43:34.000Z"
  }
}
```

**Response 404 Not Found** (No Primary Address):
```json
{
  "success": false,
  "error": "No primary address found. Please set a primary address."
}
```

---

### 3. Get Address by ID
**GET** `/api/ecommerce/shipping-addresses/:addressId`

Get single address details.

**Parameters:**
- `addressId` (path) - Address ID

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": {
    "address_id": 1,
    "user_id": 9,
    "label": "Rumah",
    "recipient_name": "John Doe",
    "phone": "081234567890",
    "province": "DKI Jakarta",
    "regency": "Jakarta Pusat",
    "district": "Menteng",
    "village": "Menteng",
    "postal_code": "10310",
    "full_address": "Jl. Menteng Raya No. 45, Jakarta Pusat",
    "is_primary": false,
    "created_at": "2025-11-05T02:42:40.000Z",
    "updated_at": "2025-11-05T02:42:40.000Z"
  }
}
```

**Response 404 Not Found:**
```json
{
  "success": false,
  "error": "Address not found"
}
```

---

### 4. Create Address
**POST** `/api/ecommerce/shipping-addresses`

Create new shipping address.

**Request Body:**
```json
{
  "label": "Rumah",                                      // Required
  "recipient_name": "John Doe",                          // Required
  "phone": "081234567890",                               // Required
  "province": "DKI Jakarta",                             // Required
  "regency": "Jakarta Pusat",                            // Required
  "district": "Menteng",                                 // Required
  "village": "Menteng",                                  // Required
  "postal_code": "10310",                                // Required
  "full_address": "Jl. Menteng Raya No. 45, Jakarta Pusat", // Required
  "is_primary": false                                    // Optional, default false
}
```

**Auto-Primary Rules:**
1. **First address** → Automatically `is_primary: true`
2. **Subsequent addresses** → `is_primary: false` unless explicitly set
3. **If `is_primary: true` requested** → Previous primary becomes false

**Response 201 Created:**
```json
{
  "success": true,
  "message": "Shipping address created successfully",
  "data": {
    "address_id": 1,
    "user_id": 9,
    "label": "Rumah",
    "recipient_name": "John Doe",
    "phone": "081234567890",
    "province": "DKI Jakarta",
    "regency": "Jakarta Pusat",
    "district": "Menteng",
    "village": "Menteng",
    "postal_code": "10310",
    "full_address": "Jl. Menteng Raya No. 45, Jakarta Pusat",
    "is_primary": true,
    "created_at": "2025-11-05T02:42:40.000Z",
    "updated_at": "2025-11-05T02:42:40.000Z"
  }
}
```

**Response 400 Bad Request:**
```json
{
  "success": false,
  "error": "All address fields are required"
}
```

---

### 5. Update Address
**PUT** `/api/ecommerce/shipping-addresses/:addressId`

Update existing address. Supports partial updates.

**Parameters:**
- `addressId` (path) - Address ID to update

**Request Body** (All fields optional):
```json
{
  "label": "Kantor - Updated",
  "recipient_name": "Jane Doe",
  "phone": "081234567891",
  "province": "DKI Jakarta",
  "regency": "Jakarta Selatan",
  "district": "Kuningan",
  "village": "Kuningan Timur",
  "postal_code": "12950",
  "full_address": "Gedung Plaza Indonesia Lantai 5, Jl. Kuningan No. 88"
}
```

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Shipping address updated successfully",
  "data": {
    "address_id": 2,
    "user_id": 9,
    "label": "Kantor - Updated",
    "recipient_name": "Jane Doe",
    "phone": "081234567891",
    "province": "DKI Jakarta",
    "regency": "Jakarta Selatan",
    "district": "Kuningan",
    "village": "Kuningan Timur",
    "postal_code": "12950",
    "full_address": "Gedung Plaza Indonesia Lantai 5, Jl. Kuningan No. 88",
    "is_primary": false,
    "created_at": "2025-11-05T02:42:57.000Z",
    "updated_at": "2025-11-05T02:44:20.000Z"
  }
}
```

**Note:** Cannot change `is_primary` via this endpoint. Use "Set Primary" endpoint instead.

---

### 6. Set Primary Address
**PUT** `/api/ecommerce/shipping-addresses/:addressId/set-primary`

Set address as primary/main address. **Only ONE address can be primary at a time.**

**Parameters:**
- `addressId` (path) - Address ID to set as primary

**Process:**
1. Check if address exists and belongs to user
2. **Unset ALL other primary addresses** for this user
3. Set specified address as primary
4. Transaction ensures data consistency

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Primary address updated successfully",
  "data": {
    "address_id": 3,
    "user_id": 9,
    "label": "Kantor",
    "recipient_name": "John Doe",
    "phone": "081234567890",
    "province": "DKI Jakarta",
    "regency": "Jakarta Selatan",
    "district": "Kuningan",
    "village": "Kuningan Timur",
    "postal_code": "12950",
    "full_address": "Gedung Plaza Indonesia, Jl. Kuningan No. 88",
    "is_primary": true,
    "created_at": "2025-11-05T02:43:34.000Z",
    "updated_at": "2025-11-05T02:43:34.000Z"
  }
}
```

**Response 200 OK** (Already Primary):
```json
{
  "success": true,
  "message": "This address is already set as primary",
  "data": {
    "address_id": 3,
    "is_primary": true,
    ...
  }
}
```

---

### 7. Delete Address
**DELETE** `/api/ecommerce/shipping-addresses/:addressId`

Delete shipping address.

**Parameters:**
- `addressId` (path) - Address ID to delete

**Auto-Switch Primary:**
If deleting primary address:
1. Delete the address
2. **Automatically set most recent remaining address as primary**
3. If no addresses left, no primary address

**Response 200 OK:**
```json
{
  "success": true,
  "message": "Shipping address deleted successfully"
}
```

**Response 404 Not Found:**
```json
{
  "success": false,
  "error": "Address not found"
}
```

---

## 🔐 Security Features

### 1. **Authorization**
- User can only access their own addresses
- JWT token required for all endpoints
- Token validation on every request

### 2. **Data Ownership**
```javascript
// Controller checks user ownership
const address = await prisma.shipping_addresses.findFirst({
  where: {
    address_id: addressId,
    user_id: userId, // ✅ Ensures user owns this address
  },
});
```

### 3. **Activity Logging**
All operations logged:
- `SHIPPING_ADDRESS_CREATED`
- `SHIPPING_ADDRESS_UPDATED`
- `PRIMARY_ADDRESS_CHANGED`
- `SHIPPING_ADDRESS_DELETED`

---

## 🎯 Primary Address Constraint

### **One Primary Rule**

**Only ONE address can have `is_primary = true` per user at any time.**

### Implementation Methods:

#### 1. **Transaction-Based Unset**
```javascript
await prisma.$transaction(async (tx) => {
  // Unset all primary addresses
  await tx.shipping_addresses.updateMany({
    where: { user_id: userId, is_primary: true },
    data: { is_primary: false },
  });
  
  // Set new primary
  await tx.shipping_addresses.update({
    where: { address_id: addressId },
    data: { is_primary: true },
  });
});
```

#### 2. **Auto-Switch on Delete**
```javascript
if (wasPrimary) {
  const remainingAddresses = await prisma.shipping_addresses.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 1,
  });
  
  if (remainingAddresses.length > 0) {
    await prisma.shipping_addresses.update({
      where: { address_id: remainingAddresses[0].address_id },
      data: { is_primary: true },
    });
  }
}
```

---

## 📊 Use Cases

### Use Case 1: First-Time User Setup
```
1. User registers as buyer
2. User creates first address → AUTO becomes primary
3. User can proceed to checkout immediately
```

### Use Case 2: Multiple Addresses
```
1. User has Rumah (primary), Kantor, Kos
2. User wants deliveries to office → Set Kantor as primary
3. All other addresses remain available
4. Next checkout uses Kantor address automatically
```

### Use Case 3: Address Deletion
```
1. User has 3 addresses, Kantor is primary
2. User deletes Kantor address
3. System AUTO-SWITCHES primary to most recent address (Kos)
4. User always has primary address (if any addresses exist)
```

### Use Case 4: Checkout Flow
```
1. Buyer adds products to cart
2. Goes to checkout
3. GET /shipping-addresses/primary → Shows default address
4. Buyer can choose different address from GET /shipping-addresses
5. Buyer can add new address during checkout
6. Set selected address as primary for future orders
```

---

## 🧪 Testing

### Test File Location
```
/modules/ecommerce/tests/Shipping-Address-Management.rest
```

### Key Test Cases
1. ✅ Create first address (auto primary)
2. ✅ Create second address (not primary)
3. ✅ Set address as primary (switch primary)
4. ✅ Verify only ONE primary per user
5. ✅ Update address (partial/full)
6. ✅ Delete primary address (auto-switch)
7. ✅ Get all addresses (primary first)
8. ✅ Get primary address
9. ✅ Authorization (user can't access others' addresses)
10. ✅ Validation (required fields)

### SQL Verification Query
```sql
SELECT 
  user_id,
  address_id,
  label,
  is_primary
FROM shipping_addresses
WHERE user_id = 9
ORDER BY is_primary DESC, created_at DESC;
```

**Expected Result:** Only ONE row has `is_primary = 1`

---

## 🚀 Frontend Integration Examples

### Get Primary Address for Checkout
```javascript
const response = await fetch('/api/ecommerce/shipping-addresses/primary', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { data } = await response.json();
console.log('Default address:', data);
```

### List All Addresses (Primary First)
```javascript
const response = await fetch('/api/ecommerce/shipping-addresses', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { data } = await response.json();

// Primary address always first
const primaryAddress = data[0]; // ✅ is_primary: true
```

### Switch Primary Address
```javascript
const switchPrimary = async (addressId) => {
  const response = await fetch(
    `/api/ecommerce/shipping-addresses/${addressId}/set-primary`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  if (response.ok) {
    console.log('Primary address updated!');
    // Refresh address list
    loadAddresses();
  }
};
```

---

## 📈 Performance Considerations

### Indexes
- ✅ `user_id` - Fast user address lookup
- ✅ `is_primary` - Fast primary address queries

### Query Optimization
```javascript
// Fast: Get primary address (uses index)
await prisma.shipping_addresses.findFirst({
  where: {
    user_id: userId,
    is_primary: true, // Uses idx_shipping_primary
  },
});

// Fast: Get all addresses sorted
await prisma.shipping_addresses.findMany({
  where: { user_id: userId }, // Uses fk_shipping_address_user
  orderBy: [
    { is_primary: 'desc' }, // Primary first
    { created_at: 'desc' }
  ],
});
```

---

## 🐛 Troubleshooting

### Issue: Multiple Primary Addresses
**Solution:** Run cleanup script
```sql
-- Find users with multiple primary addresses
SELECT user_id, COUNT(*) as primary_count
FROM shipping_addresses
WHERE is_primary = true
GROUP BY user_id
HAVING COUNT(*) > 1;

-- Fix: Keep most recent, unset others
UPDATE shipping_addresses SET is_primary = false
WHERE address_id NOT IN (
  SELECT address_id FROM (
    SELECT address_id
    FROM shipping_addresses
    WHERE user_id = ? AND is_primary = true
    ORDER BY created_at DESC
    LIMIT 1
  ) tmp
) AND user_id = ? AND is_primary = true;
```

### Issue: No Primary Address After Delete
**Reason:** Logic handles this automatically
**Verification:**
```javascript
// Check if auto-switch worked
const addresses = await prisma.shipping_addresses.findMany({
  where: { user_id: userId },
  orderBy: { is_primary: 'desc' }
});

if (addresses.length > 0 && !addresses[0].is_primary) {
  console.error('Auto-switch failed!');
}
```

---

## ✅ Implementation Checklist

### Database
- [x] Create `shipping_addresses` table
- [x] Add indexes for performance
- [x] Add foreign key to users table
- [x] Test constraints

### Backend
- [x] Create `shippingAddressController.js`
- [x] Implement all CRUD operations
- [x] Implement primary address constraint
- [x] Implement auto-switch on delete
- [x] Add activity logging
- [x] Create `shippingAddressRoutes.js`
- [x] Register routes in `index.js`

### Testing
- [x] Create REST test file
- [x] Test all positive cases
- [x] Test negative cases
- [x] Verify primary constraint
- [x] Test authorization

### Documentation
- [x] Create comprehensive API docs
- [x] Add usage examples
- [x] Add troubleshooting guide

---

## 📞 Support

### Documentation Files
- **API Tests**: `/modules/ecommerce/tests/Shipping-Address-Management.rest`
- **This Guide**: `/modules/ecommerce/docs/Shipping-Address-Management-API.md`

### Related Features
- User Profile Management
- Checkout System (future)
- Order Management (future)

---

**🎉 Shipping Address Management Implementation Complete!**

Last Updated: 2025-11-05  
Version: 1.0.0
