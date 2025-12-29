# Admin User Management API Documentation

**Module:** E-Commerce  
**Base URL:** `/api/ecommerce/admin/users`  
**Authentication:** Required (Admin Only)  
**Version:** 1.0.0  
**Last Updated:** October 21, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Get All Users](#1-get-all-users)
   - [Get User by ID](#2-get-user-by-id)
   - [Create User](#3-create-user)
   - [Update User](#4-update-user)
   - [Delete User](#5-delete-user-soft-delete)
   - [Get User Statistics](#6-get-user-statistics)
   - [Export Users to Excel](#7-export-users-to-excel)
4. [Data Models](#data-models)
5. [Error Codes](#error-codes)
6. [Testing](#testing)

---

## Overview

The Admin User Management API provides comprehensive endpoints for administrators to manage user accounts in the e-commerce platform. This includes creating, reading, updating, and deleting users, as well as generating reports and statistics.

### Key Features
- ✅ Full CRUD operations on user accounts
- ✅ Advanced filtering and search capabilities
- ✅ Pagination and sorting
- ✅ User statistics and analytics
- ✅ Excel export functionality
- ✅ Role-based access control (RBAC)
- ✅ Soft delete for data preservation

---

## Authentication

All endpoints require admin authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <admin_jwt_token>
```

### Getting Admin Token

```http
POST /api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "admin",
      "email": "admin@ecommerce.com",
      "roles": ["admin"]
    }
  }
}
```

---

## Endpoints

### 1. Get All Users

Retrieve a paginated list of all users with optional filtering and sorting.

**Endpoint:** `GET /api/ecommerce/admin/users`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of items per page (max: 100) |
| `username` | string | No | - | Filter by username (partial match) |
| `email` | string | No | - | Filter by email (partial match) |
| `full_name` | string | No | - | Filter by full name (partial match) |
| `role_type` | string | No | - | Filter by role: `admin`, `seller` |
| `status` | string | No | - | Filter by status: `active`, `inactive`, `suspended` |
| `email_verified` | boolean | No | - | Filter by email verification status |
| `sort_by` | string | No | created_at | Sort field: `user_id`, `username`, `email`, `full_name`, `created_at`, `updated_at` |
| `sort_order` | string | No | desc | Sort order: `asc`, `desc` |

**Example Requests:**

```http
# Basic - Get all users
GET /api/ecommerce/admin/users
Authorization: Bearer <token>

# With pagination
GET /api/ecommerce/admin/users?page=1&limit=20
Authorization: Bearer <token>

# Filter by username
GET /api/ecommerce/admin/users?username=john
Authorization: Bearer <token>

# Filter by status and role
GET /api/ecommerce/admin/users?status=active&role_type=seller
Authorization: Bearer <token>

# Complex query
GET /api/ecommerce/admin/users?status=active&email_verified=true&sort_by=username&sort_order=asc&page=1&limit=15
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "user_id": 2,
        "username": "seller1",
        "email": "seller1@ecommerce.com",
        "full_name": "John Doe",
        "phone": "081234567890",
        "profile_picture": "/uploads/profile/user2.jpg",
        "email_verified": true,
        "email_verified_at": "2025-10-17T03:30:18.000Z",
        "status": "active",
        "created_at": "2025-10-17T03:30:18.000Z",
        "updated_at": "2025-10-21T02:12:19.000Z",
        "roles": [
          {
            "role_id": 2,
            "role_type": "seller"
          }
        ],
        "seller_profile": {
          "seller_id": 1,
          "store_name": "Toko Elektronik Jaya",
          "rating_average": 4.5,
          "total_reviews": 50
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### 2. Get User by ID

Retrieve detailed information about a specific user.

**Endpoint:** `GET /api/ecommerce/admin/users/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID |

**Example Request:**

```http
GET /api/ecommerce/admin/users/2
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user_id": 2,
    "username": "seller1",
    "email": "seller1@ecommerce.com",
    "full_name": "John Doe",
    "phone": "081234567890",
    "profile_picture": "/uploads/profile/user2.jpg",
    "email_verified": true,
    "email_verified_at": "2025-10-17T03:30:18.000Z",
    "status": "active",
    "created_at": "2025-10-17T03:30:18.000Z",
    "updated_at": "2025-10-21T02:12:19.000Z",
    "roles": [
      {
        "role_id": 2,
        "role_type": "seller",
        "created_at": "2025-10-17T03:30:18.000Z",
        "updated_at": "2025-10-17T03:30:18.000Z"
      }
    ],
    "seller_profile": {
      "seller_id": 1,
      "store_name": "Toko Elektronik Jaya",
      "store_photo": "/uploads/stores/store1.jpg",
      "province": "DKI Jakarta",
      "regency": "Jakarta Selatan",
      "district": "Kebayoran Baru",
      "village": "Senayan",
      "postal_code": "12190",
      "full_address": "Jl. Senayan No. 123",
      "about_store": "Toko elektronik terpercaya",
      "rating_average": 4.5,
      "total_reviews": 50,
      "total_products": 5,
      "total_views": 1250,
      "created_at": "2025-10-17T03:30:18.000Z",
      "updated_at": "2025-10-17T03:30:18.000Z"
    },
    "recent_activity": [
      {
        "log_id": 45,
        "action": "login",
        "description": "User logged in",
        "resource_type": "auth",
        "resource_id": null,
        "ip_address": "192.168.1.100",
        "created_at": "2025-10-21T08:30:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**

```json
// Invalid ID (400 Bad Request)
{
  "success": false,
  "error": "Invalid user ID"
}

// User not found (404 Not Found)
{
  "success": false,
  "error": "User not found"
}
```

---

### 3. Create User

Create a new user account (admin or seller).

**Endpoint:** `POST /api/ecommerce/admin/users`

**Request Body:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `username` | string | Yes | 3-50 chars, unique | Username for login |
| `email` | string | Yes | Valid email, unique | User email address |
| `password` | string | Yes | Min 6 chars | User password (will be hashed) |
| `full_name` | string | No | Max 100 chars | User's full name |
| `phone` | string | No | Max 20 chars | Phone number |
| `profile_picture` | string | No | URL | Profile picture URL |
| `role_type` | string | No | `admin`, `seller` | User role (default: `seller`) |
| `status` | string | No | `active`, `inactive`, `suspended` | Account status (default: `active`) |
| `email_verified` | boolean | No | - | Email verification status (default: `false`) |

**Example Request:**

```http
POST /api/ecommerce/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "081234567890",
  "role_type": "seller",
  "status": "active",
  "email_verified": true
}
```

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": 7,
    "username": "johndoe",
    "email": "johndoe@example.com",
    "full_name": "John Doe",
    "phone": "081234567890",
    "profile_picture": null,
    "email_verified": true,
    "status": "active",
    "created_at": "2025-10-21T10:00:00.000Z",
    "updated_at": "2025-10-21T10:00:00.000Z",
    "role": {
      "role_id": 10,
      "role_type": "seller"
    }
  }
}
```

**Error Responses:**

```json
// Missing required fields (400 Bad Request)
{
  "success": false,
  "error": "Username, email, and password are required"
}

// Invalid email format (400 Bad Request)
{
  "success": false,
  "error": "Invalid email format"
}

// Weak password (400 Bad Request)
{
  "success": false,
  "error": "Password must be at least 6 characters long"
}

// Duplicate username (409 Conflict)
{
  "success": false,
  "error": "Username already exists"
}

// Duplicate email (409 Conflict)
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 4. Update User

Update an existing user's information.

**Endpoint:** `PUT /api/ecommerce/admin/users/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID to update |

**Request Body (all fields optional):**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `username` | string | 3-50 chars, unique | New username |
| `email` | string | Valid email, unique | New email address |
| `password` | string | Min 6 chars | New password (will be hashed) |
| `full_name` | string | Max 100 chars | Updated full name |
| `phone` | string | Max 20 chars | Updated phone number |
| `profile_picture` | string | URL | Updated profile picture |
| `role_type` | string | `admin`, `seller` | Updated role |
| `status` | string | `active`, `inactive`, `suspended` | Updated status |
| `email_verified` | boolean | - | Email verification status |

**Example Requests:**

```http
# Update full profile
PUT /api/ecommerce/admin/users/7
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Michael Doe",
  "phone": "081999888777",
  "status": "active",
  "email_verified": true
}

# Change password only
PUT /api/ecommerce/admin/users/7
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "NewSecurePass456!"
}

# Suspend user
PUT /api/ecommerce/admin/users/7
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "suspended"
}

# Promote to admin
PUT /api/ecommerce/admin/users/7
Authorization: Bearer <token>
Content-Type: application/json

{
  "role_type": "admin"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user_id": 7,
    "username": "johndoe",
    "email": "johndoe@example.com",
    "full_name": "John Michael Doe",
    "phone": "081999888777",
    "profile_picture": null,
    "email_verified": true,
    "status": "active",
    "created_at": "2025-10-21T10:00:00.000Z",
    "updated_at": "2025-10-21T10:30:00.000Z",
    "role": {
      "role_type": "seller"
    }
  }
}
```

**Error Responses:**

```json
// Invalid user ID (400 Bad Request)
{
  "success": false,
  "error": "Invalid user ID"
}

// User not found (404 Not Found)
{
  "success": false,
  "error": "User not found"
}

// Duplicate username (409 Conflict)
{
  "success": false,
  "error": "Username already exists"
}

// Invalid email format (400 Bad Request)
{
  "success": false,
  "error": "Invalid email format"
}
```

---

### 5. Delete User (Soft Delete)

Deactivate a user account (sets status to 'inactive'). This is a soft delete operation.

**Endpoint:** `DELETE /api/ecommerce/admin/users/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | User ID to delete |

**Example Request:**

```http
DELETE /api/ecommerce/admin/users/7
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "user_id": 7,
    "username": "johndoe",
    "email": "johndoe@example.com",
    "status": "inactive",
    "updated_at": "2025-10-21T11:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// Invalid user ID (400 Bad Request)
{
  "success": false,
  "error": "Invalid user ID"
}

// User not found (404 Not Found)
{
  "success": false,
  "error": "User not found"
}

// Cannot delete self (403 Forbidden)
{
  "success": false,
  "error": "You cannot delete your own account"
}

// Cannot delete last admin (403 Forbidden)
{
  "success": false,
  "error": "Cannot delete the last active admin user"
}
```

**⚠️ Important Notes:**
- Admins cannot delete their own accounts
- The system prevents deletion of the last active admin
- This is a soft delete - the user record remains in the database with status 'inactive'
- Related data (seller profiles, products, etc.) are preserved

---

### 6. Get User Statistics

Retrieve comprehensive statistics about users.

**Endpoint:** `GET /api/ecommerce/admin/users/statistics`

**Example Request:**

```http
GET /api/ecommerce/admin/users/statistics
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "overview": {
      "total_users": 125,
      "active_users": 110,
      "inactive_users": 10,
      "suspended_users": 5,
      "verified_emails": 95,
      "unverified_emails": 30
    },
    "by_role": {
      "total_admins": 3,
      "total_sellers": 122
    },
    "recent_registrations": {
      "today": 5,
      "this_week": 23,
      "this_month": 47
    },
    "recent_users": [
      {
        "user_id": 125,
        "username": "newuser",
        "email": "newuser@example.com",
        "full_name": "New User",
        "roles": ["seller"],
        "status": "active",
        "created_at": "2025-10-21T09:00:00.000Z"
      }
    ]
  }
}
```

---

### 7. Export Users to Excel

Export user data to an Excel file with optional filtering.

**Endpoint:** `GET /api/ecommerce/admin/users/export/excel`

**Query Parameters:** (Same as Get All Users)

| Parameter | Type | Description |
|-----------|------|-------------|
| `username` | string | Filter by username |
| `email` | string | Filter by email |
| `role_type` | string | Filter by role: `admin`, `seller` |
| `status` | string | Filter by status: `active`, `inactive`, `suspended` |
| `email_verified` | boolean | Filter by verification status |

**Example Requests:**

```http
# Export all users
GET /api/ecommerce/admin/users/export/excel
Authorization: Bearer <token>

# Export active sellers only
GET /api/ecommerce/admin/users/export/excel?status=active&role_type=seller
Authorization: Bearer <token>

# Export verified users
GET /api/ecommerce/admin/users/export/excel?email_verified=true
Authorization: Bearer <token>
```

**Success Response (200 OK):**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename=users_export_<timestamp>.xlsx`

**Excel File Contains:**
- User ID
- Username
- Email
- Full Name
- Phone
- Roles
- Email Verified
- Status
- Created At
- Updated At

---

## Data Models

### User Object

```typescript
{
  user_id: number;
  username: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  profile_picture: string | null;
  email_verified: boolean;
  email_verified_at: Date | null;
  status: "active" | "inactive" | "suspended";
  created_at: Date;
  updated_at: Date;
  roles: Role[];
  seller_profile?: SellerProfile;
  recent_activity?: ActivityLog[];
}
```

### Role Object

```typescript
{
  role_id: number;
  role_type: "admin" | "seller";
  created_at: Date;
  updated_at: Date;
}
```

### Seller Profile Object

```typescript
{
  seller_id: number;
  store_name: string;
  store_photo: string | null;
  province: string;
  regency: string;
  district: string;
  village: string;
  postal_code: string;
  full_address: string;
  about_store: string | null;
  rating_average: number;
  total_reviews: number;
  total_products: number;
  total_views: number;
  created_at: Date;
  updated_at: Date;
}
```

### Activity Log Object

```typescript
{
  log_id: number;
  action: string;
  description: string | null;
  resource_type: string | null;
  resource_id: number | null;
  ip_address: string | null;
  created_at: Date;
}
```

---

## Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (non-admin) |
| 404 | Not Found | User not found |
| 409 | Conflict | Duplicate username or email |
| 500 | Internal Server Error | Server-side error |

---

## Testing

### Automated Test Script

Run the automated test suite:

```bash
node modules/ecommerce/tests/testjs/test-admin-users.js
```

### Manual Testing with REST Client

Use the provided REST file:

```
modules/ecommerce/tests/admin-users.rest
```

### Test Coverage

The test suite covers:
- ✅ Authentication and authorization
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Filtering and search
- ✅ Pagination and sorting
- ✅ User statistics
- ✅ Excel export
- ✅ Validation and error handling
- ✅ Edge cases and security

### Sample Test Scenarios

1. **Get all users with pagination**
2. **Filter users by role and status**
3. **Create new seller account**
4. **Update user information**
5. **Soft delete user account**
6. **Prevent admin self-deletion**
7. **Prevent deleting last admin**
8. **Handle duplicate username/email**
9. **Validate email format**
10. **Export filtered users to Excel**

---

## 📱 Frontend Implementation

### ✅ Admin User Management Page

**Location**: `src/pages/admin/KelolaUserPage.jsx`

**Route**: `/admin/kelola-user` (Protected Route - Admin only)

**API Service**: `src/services/adminUserAPI.js`

**Features Implemented**:

#### 1. **User Statistics Dashboard** ✅
- Total users count
- Active users count
- Inactive users count
- Verified users count
- Real-time statistics refresh
- Loading states

#### 2. **User Table with Filters** ✅
```jsx
// Filters available:
- Search by username/email (debounced)
- Filter by role (admin/seller/buyer)
- Filter by status (active/inactive/suspended)
- Filter by email verification status
- Combined filters
- Pagination (10 users per page)
```

#### 3. **User CRUD Operations** ✅

**Create User**:
```jsx
// Modal form fields:
{
  username: string,
  email: string (validated),
  password: string (min 6 chars),
  full_name: string,
  phone: string,
  role_type: 'admin' | 'seller' | 'buyer',
  status: 'active' | 'inactive',
  email_verified: boolean
}

await createUser(formData);
```

**Update User**:
```jsx
// Pre-filled form (password optional)
await updateUser(userId, formData);
```

**Delete User**:
```jsx
// Soft delete with confirmation
await deleteUser(userId);
```

**View User Details**:
```jsx
// Modal showing:
- Personal information
- Account status
- Email verification status
- Role information
- Created/Updated dates
```

#### 4. **Export to Excel** ✅
```jsx
const handleExport = async () => {
  const blob = await exportUsersToExcel({
    role_type: roleFilter,
    status: statusFilter,
    email_verified: verifiedFilter
  });
  
  // Auto download Excel file
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `users_${Date.now()}.xlsx`;
  a.click();
};
```

#### 5. **UI Components** ✅
- Statistics cards with role icons
- Searchable data table
- Role badges (color-coded)
- Status badges (Active/Inactive/Suspended)
- Email verification badges
- Action buttons (View/Edit/Delete)
- Modal forms with validation
- Toast notifications
- Pagination controls

#### 6. **Integration Example**

```javascript
// src/services/adminUserAPI.js
export const getUsers = async (params = {}) => {
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v != null)
  ).toString();
  
  const url = `${API_URL}/admin/users?${queryString}`;
  
  const response = await fetch(url, {
    headers: getAuthHeaders() // JWT token
  });

  const result = await response.json();
  return {
    success: true,
    data: result.data.users,
    pagination: result.data.pagination
  };
};

// Component usage:
const fetchUsers = async () => {
  const params = {
    page: currentPage,
    limit: 10,
    username: searchQuery,
    role_type: roleFilter,
    status: statusFilter,
    email_verified: verifiedFilter,
    sort_by: 'created_at',
    sort_order: 'desc'
  };
  
  const result = await getUsers(params);
  setUsers(result.data);
  setPagination(result.pagination);
};
```

#### 7. **Validation & Error Handling** ✅
- Email format validation
- Password strength requirements
- Unique username/email check
- Try-catch for all API calls
- User-friendly error messages
- Fallback mode support
- Console debugging logs

---

## Best Practices

### Security
- Always validate and sanitize user input
- Use strong password requirements (min 6 chars, consider complexity)
- Implement rate limiting for failed login attempts
- Log all admin actions for audit trails
- Use HTTPS in production

### Performance
- Use pagination for large datasets
- Implement caching for statistics
- Index frequently queried fields (username, email, status)
- Optimize database queries with proper relations

### Data Management
- Use soft deletes to preserve data integrity
- Maintain audit logs for compliance
- Regular database backups
- Archive inactive users periodically

---

## Support

For issues or questions:
- Check the automated test results
- Review error responses carefully
- Consult the main project documentation
- Contact the development team

---

**Document Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Maintained by:** E-Commerce Module Team
