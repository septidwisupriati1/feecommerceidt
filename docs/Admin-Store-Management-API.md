# Admin Store Management API Documentation

## Overview
The Admin Store Management API allows administrators to manage seller stores on the e-commerce platform. This includes viewing store lists, managing store statuses (activate/deactivate/suspend), and accessing store statistics.

## Base URL
```
http://localhost:5000/api/ecommerce/admin
```

## Authentication
All endpoints require JWT authentication with admin privileges.
```
Authorization: Bearer <admin_jwt_token>
```

## Endpoints

### 1. Get All Stores
**GET** `/admin/stores`

Retrieve a paginated list of all stores with optional filtering and sorting.

#### Query Parameters
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10, max: 100)
- `status` (string, optional): Filter by status (`active`, `inactive`, `suspended`)
- `search` (string, optional): Search in store name, seller name, email, or location
- `sort_by` (string, optional): Sort field (`created_at`, `updated_at`, `store_name`, `rating_average`, `total_products`, `total_views`) (default: `created_at`)
- `sort_order` (string, optional): Sort order (`asc`, `desc`) (default: `desc`)

#### Response
```json
{
  "success": true,
  "message": "Stores retrieved successfully",
  "data": [
    {
      "seller_id": 1,
      "user_id": 1,
      "store_name": "Toko Elektronik Jaya",
      "store_photo": "/uploads/stores/store1.jpg",
      "location": {
        "province": "DKI Jakarta",
        "regency": "Jakarta Selatan",
        "district": "Kebayoran Baru",
        "village": "Senayan",
        "postal_code": "12190"
      },
      "full_address": "Jl. Senayan No. 123",
      "about_store": "Toko elektronik terpercaya...",
      "status": "active",
      "seller_info": {
        "full_name": "Seller One",
        "email": "seller1@ecommerce.com",
        "phone": "081234567891",
        "email_verified": true,
        "user_status": "active"
      },
      "statistics": {
        "rating_average": 4.5,
        "total_reviews": 50,
        "total_products": 2,
        "active_products": 2
      },
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "stats": {
    "total_stores": 2,
    "by_status": {
      "active": 2,
      "inactive": 0,
      "suspended": 0
    },
    "recent_activity": {
      "last_7_days": 0,
      "last_30_days": 2
    },
    "top_performing_stores": [...],
    "average_rating": 4.75
  }
}
```

#### Example Requests
```bash
# Get all stores
GET /api/ecommerce/admin/stores

# Search stores
GET /api/ecommerce/admin/stores?search=Toko

# Filter by active status
GET /api/ecommerce/admin/stores?status=active

# Sort by rating
GET /api/ecommerce/admin/stores?sort_by=rating_average&sort_order=desc
```

---

### 2. Get Stores Statistics
**GET** `/admin/stores/stats`

Get comprehensive statistics about stores on the platform.

#### Response
```json
{
  "success": true,
  "message": "Stores statistics retrieved successfully",
  "data": {
    "total_stores": 2,
    "by_status": {
      "active": 2,
      "inactive": 0,
      "suspended": 0
    },
    "recent_activity": {
      "last_7_days": 0,
      "last_30_days": 2
    },
    "top_performing_stores": [
      {
        "seller_id": 1,
        "store_name": "Toko Elektronik Jaya",
        "seller_name": "Seller One",
        "rating_average": 4.5,
        "total_views": 1250,
        "total_products": 2
      }
    ],
    "average_rating": 4.75
  }
}
```

---

### 3. Get Single Store Details
**GET** `/admin/stores/:storeId`

Get detailed information about a specific store.

#### Path Parameters
- `storeId` (number, required): The seller ID of the store

#### Response
```json
{
  "success": true,
  "message": "Store retrieved successfully",
  "data": {
    "seller_id": 1,
    "user_id": 1,
    "store_name": "Toko Elektronik Jaya",
    "store_photo": "/uploads/stores/store1.jpg",
    "location": {
      "province": "DKI Jakarta",
      "regency": "Jakarta Selatan",
      "district": "Kebayoran Baru",
      "village": "Senayan",
      "postal_code": "12190"
    },
    "full_address": "Jl. Senayan No. 123",
    "about_store": "Toko elektronik terpercaya...",
    "status": "active",
    "seller_info": {
      "full_name": "Seller One",
      "email": "seller1@ecommerce.com",
      "phone": "081234567891",
      "email_verified": true,
      "user_status": "active",
      "joined_at": "2025-01-15T10:30:00.000Z"
    },
    "statistics": {
      "rating_average": 4.5,
      "total_reviews": 50,
      "total_products": 2,
      "total_views": 1250,
      "active_products_count": 2
    },
    "recent_products": [
      {
        "product_id": 1,
        "name": "Smartphone Android X1",
        "price": 3500000,
        "stock": 50,
        "status": "active",
        "rating_average": 4.7,
        "total_reviews": 25,
        "total_views": 500,
        "created_at": "2025-01-15T10:30:00.000Z"
      }
    ],
    "recent_reports": [
      {
        "report_id": 1,
        "reason": "Product quality issues",
        "status": "pending",
        "created_at": "2025-01-20T08:15:00.000Z",
        "reporter": {
          "full_name": "John Doe",
          "email": "john.doe@example.com"
        }
      }
    ],
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### 4. Update Store Status
**PUT** `/admin/stores/:storeId/status`

Update the status of a store (activate, deactivate, or suspend).

#### Path Parameters
- `storeId` (number, required): The seller ID of the store

#### Request Body
```json
{
  "status": "inactive",
  "reason": "Violation of platform policies"
}
```

#### Parameters
- `status` (string, required): New status (`active`, `inactive`, `suspended`)
- `reason` (string, optional): Reason for the status change

#### Response
```json
{
  "success": true,
  "message": "Store status updated successfully",
  "data": {
    "seller_id": 1,
    "store_name": "Toko Elektronik Jaya",
    "status": "inactive",
    "seller_name": "Seller One",
    "seller_email": "seller1@ecommerce.com",
    "updated_at": "2025-01-20T10:30:00.000Z"
  }
}
```

#### Status Options
- `active`: Store is active and visible to customers
- `inactive`: Store is deactivated but can be reactivated
- `suspended`: Store is suspended due to policy violations

---

## Error Responses

### Common Error Codes
- `400 Bad Request`: Invalid parameters or request body
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: User is not an admin
- `404 Not Found`: Store not found
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Specific Error Examples
```json
// Invalid status
{
  "success": false,
  "error": "Invalid status. Valid statuses: active, inactive, suspended"
}

// Store not found
{
  "success": false,
  "error": "Store not found"
}

// Admin access required
{
  "success": false,
  "error": "Admin access required"
}
```

---

## Testing

### Prerequisites
1. Start the server: `npm start` or `node index.js`
2. Ensure database is seeded with admin user and seller data
3. Login as admin to get JWT token

### Test Script
Run the automated test script:
```bash
cd modules/ecommerce/tests/testsh
chmod +x test-admin-store-management.sh
./test-admin-store-management.sh
```

### Manual Testing with REST Client
Use the provided `Admin-Store-Management-REST.rest` file in VS Code with REST Client extension.

---

## Database Schema

### seller_profiles Table
```sql
CREATE TABLE seller_profiles (
  seller_id       INT PRIMARY KEY AUTO_INCREMENT,
  user_id         INT NOT NULL UNIQUE,
  store_name      VARCHAR(100) NOT NULL,
  store_photo     TEXT,
  province        VARCHAR(100) NOT NULL,
  regency         VARCHAR(100) NOT NULL,
  district        VARCHAR(100) NOT NULL,
  village         VARCHAR(100) NOT NULL,
  postal_code     VARCHAR(10) NOT NULL,
  full_address    TEXT NOT NULL,
  about_store     TEXT,
  status          ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  rating_average  DECIMAL(3,2) DEFAULT 0.00,
  total_reviews   INT DEFAULT 0,
  total_products  INT DEFAULT 0,
  total_views     INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_seller_status (status),
  INDEX idx_seller_rating (rating_average)
);
```

---

## Activity Logging

All store status updates are logged in the `activity_logs` table with:
- Action: `STORE_STATUS_UPDATED`
- Resource Type: `seller_profile`
- Resource ID: Store seller_id
- User ID: Admin user ID
- IP Address and User Agent

---

## 📱 Frontend Implementation

### ✅ Admin Store Management Page

**Location**: `src/pages/admin/KelolaStorePage.jsx`

**Route**: `/admin/kelola-store` (Protected Route - Admin only)

**API Service**: `src/services/adminStoreAPI.js`

**Features Implemented**:

#### 1. **Store Statistics** ✅
- Total stores count
- Active stores
- Inactive stores  
- Suspended stores
- Average store rating
- Real-time refresh

#### 2. **Store Listing & Filters** ✅
```jsx
// Available filters:
- Search by store name
- Filter by status (active/inactive/suspended)
- Sort by rating, name, created_at
- Pagination (10 stores per page)
```

#### 3. **Store Management** ✅

**View Store Details**:
```jsx
// Modal showing:
- Store name and photo
- Seller information
- Address (province, regency, district, village)
- Store description
- Rating and review count
- Total products and views
- Status and dates
```

**Update Store Status**:
```jsx
// Change status: active ↔ inactive ↔ suspended
await updateStoreStatus(storeId, { 
  status: 'suspended',
  admin_notes: 'Violates policy'
});
```

#### 4. **UI Components** ✅
- Statistics cards with store metrics
- Store table with photos
- Status badges (color-coded)
- Rating stars display
- Action buttons (View/Edit Status)
- Modal for store details
- Toast notifications

#### 5. **Integration Code**

```javascript
// src/services/adminStoreAPI.js
export const getStores = async (params = {}) => {
  const url = `${API_URL}/admin/stores?${queryString}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders()
  });

  return await response.json();
};

// Component usage:
const fetchStores = async () => {
  const params = {
    page: currentPage,
    limit: 10,
    search: searchQuery,
    status: statusFilter,
    sort_by: 'rating_average',
    sort_order: 'desc'
  };
  
  const result = await getStores(params);
  setStores(result.data);
};
```

---

## Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **Authorization**: Only admin users can access these endpoints
3. **Input Validation**: All inputs are validated for type and format
4. **SQL Injection Protection**: Uses parameterized queries
5. **Audit Trail**: All changes are logged for accountability

---

## Performance Notes

- List endpoints support pagination to handle large datasets
- Database indexes on frequently queried fields (status, rating, etc.)
- Statistics are cached and computed efficiently
- Search uses optimized database queries with proper indexing