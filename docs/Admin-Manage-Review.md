# Admin Review Management API Documentation

**Module:** E-Commerce  
**Base URL:** `/api/ecommerce/admin/reviews`  
**Authentication:** Required (Admin Only)  
**Version:** 1.0.0  
**Last Updated:** October 21, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Get All Reviews](#1-get-all-reviews)
   - [Get Review by ID](#2-get-review-by-id)
   - [Update Review Status](#3-update-review-status)
   - [Delete Review](#4-delete-review)
   - [Get Review Statistics](#5-get-review-statistics)
   - [Export Reviews to Excel](#6-export-reviews-to-excel)
4. [Data Models](#data-models)
5. [Review Status Workflow](#review-status-workflow)
6. [Error Codes](#error-codes)
7. [Testing](#testing)

---

## Overview

The Admin Review Management API provides comprehensive endpoints for administrators to moderate and manage product reviews. Admins can approve, reject, or delete reviews, as well as generate analytics and reports.

### Key Features
- ✅ View all product reviews with detailed information
- ✅ Approve or reject reviews (moderation)
- ✅ Advanced filtering by rating, status, text, product, and user
- ✅ Pagination and sorting capabilities
- ✅ Review statistics and analytics
- ✅ Excel export functionality
- ✅ Delete inappropriate reviews
- ✅ Track review trends and distributions

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

### 1. Get All Reviews

Retrieve a paginated list of all product reviews with filtering and sorting options.

**Endpoint:** `GET /api/ecommerce/admin/reviews`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Page number for pagination |
| `limit` | integer | No | 10 | Number of items per page (max: 100) |
| `review_text` | string | No | - | Filter by review text (partial match) |
| `product_id` | integer | No | - | Filter by product ID |
| `user_id` | integer | No | - | Filter by user ID |
| `rating` | integer | No | - | Filter by rating (1-5) |
| `status` | string | No | - | Filter by status: `pending`, `approved`, `rejected` |
| `sort_by` | string | No | created_at | Sort field: `review_id`, `rating`, `created_at`, `updated_at` |
| `sort_order` | string | No | desc | Sort order: `asc`, `desc` |

**Example Requests:**

```http
# Basic - Get all reviews
GET /api/ecommerce/admin/reviews
Authorization: Bearer <token>

# With pagination
GET /api/ecommerce/admin/reviews?page=1&limit=20
Authorization: Bearer <token>

# Filter by status
GET /api/ecommerce/admin/reviews?status=pending
Authorization: Bearer <token>

# Filter by rating
GET /api/ecommerce/admin/reviews?rating=5
Authorization: Bearer <token>

# Filter by review text
GET /api/ecommerce/admin/reviews?review_text=excellent
Authorization: Bearer <token>

# Filter by product
GET /api/ecommerce/admin/reviews?product_id=1
Authorization: Bearer <token>

# Sort by rating descending
GET /api/ecommerce/admin/reviews?sort_by=rating&sort_order=desc
Authorization: Bearer <token>

# Complex query - pending reviews with rating 1-2
GET /api/ecommerce/admin/reviews?status=pending&rating=1&sort_by=created_at&sort_order=desc
Authorization: Bearer <token>

# Multiple filters
GET /api/ecommerce/admin/reviews?review_text=good&rating=5&status=approved&page=1&limit=15
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": {
    "reviews": [
      {
        "review_id": 1,
        "rating": 5,
        "review_text": "Produk sangat bagus, pengiriman cepat!",
        "status": "approved",
        "created_at": "2025-10-20T08:30:00.000Z",
        "updated_at": "2025-10-20T09:00:00.000Z",
        "product": {
          "product_id": 1,
          "name": "Laptop ASUS ROG Strix G15",
          "price": 15000000,
          "seller": {
            "seller_id": 1,
            "store_name": "Toko Elektronik Jaya"
          }
        },
        "user": {
          "user_id": 3,
          "username": "johndoe",
          "full_name": "John Doe",
          "email": "john@example.com"
        }
      },
      {
        "review_id": 2,
        "rating": 4,
        "review_text": "Barang sesuai deskripsi, packing rapih",
        "status": "pending",
        "created_at": "2025-10-21T10:15:00.000Z",
        "updated_at": "2025-10-21T10:15:00.000Z",
        "product": {
          "product_id": 5,
          "name": "Smartphone iPhone 15 Pro",
          "price": 18999000,
          "seller": {
            "seller_id": 2,
            "store_name": "Gadget Store"
          }
        },
        "user": {
          "user_id": 4,
          "username": "janedoe",
          "full_name": "Jane Doe",
          "email": "jane@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 125,
      "total_pages": 13,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

---

### 2. Get Review by ID

Retrieve detailed information about a specific review.

**Endpoint:** `GET /api/ecommerce/admin/reviews/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Review ID |

**Example Request:**

```http
GET /api/ecommerce/admin/reviews/1
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Review retrieved successfully",
  "data": {
    "review_id": 1,
    "rating": 5,
    "review_text": "Produk sangat bagus, pengiriman cepat! Saya sangat puas dengan kualitas barang ini. Recommended seller!",
    "status": "approved",
    "created_at": "2025-10-20T08:30:00.000Z",
    "updated_at": "2025-10-20T09:00:00.000Z",
    "product": {
      "product_id": 1,
      "name": "Laptop ASUS ROG Strix G15",
      "description": "Gaming laptop dengan spesifikasi tinggi",
      "price": 15000000,
      "rating_average": 4.8,
      "total_reviews": 45,
      "seller": {
        "seller_id": 1,
        "store_name": "Toko Elektronik Jaya",
        "rating_average": 4.5
      }
    },
    "user": {
      "user_id": 3,
      "username": "johndoe",
      "full_name": "John Doe",
      "email": "john@example.com",
      "profile_picture": "/uploads/profile/user3.jpg"
    }
  }
}
```

**Error Responses:**

```json
// Invalid ID (400 Bad Request)
{
  "success": false,
  "error": "Invalid review ID"
}

// Review not found (404 Not Found)
{
  "success": false,
  "error": "Review not found"
}
```

---

### 3. Update Review Status

Update the status of a review (approve, reject, or set to pending).

**Endpoint:** `PATCH /api/ecommerce/admin/reviews/:id/status`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Review ID to update |

**Request Body:**

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `status` | string | Yes | `pending`, `approved`, `rejected` | New review status |

**Example Requests:**

```http
# Approve review
PATCH /api/ecommerce/admin/reviews/2/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"
}

# Reject review
PATCH /api/ecommerce/admin/reviews/3/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "rejected"
}

# Set to pending for re-review
PATCH /api/ecommerce/admin/reviews/4/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "pending"
}
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Review status updated successfully",
  "data": {
    "review_id": 2,
    "rating": 4,
    "review_text": "Barang sesuai deskripsi, packing rapih",
    "status": "approved",
    "created_at": "2025-10-21T10:15:00.000Z",
    "updated_at": "2025-10-21T11:00:00.000Z"
  }
}
```

**Error Responses:**

```json
// Missing status (400 Bad Request)
{
  "success": false,
  "error": "Status is required"
}

// Invalid status (400 Bad Request)
{
  "success": false,
  "error": "Invalid status. Must be 'pending', 'approved', or 'rejected'"
}

// Invalid review ID (400 Bad Request)
{
  "success": false,
  "error": "Invalid review ID"
}

// Review not found (404 Not Found)
{
  "success": false,
  "error": "Review not found"
}
```

---

### 4. Delete Review

Permanently delete a review from the system.

**Endpoint:** `DELETE /api/ecommerce/admin/reviews/:id`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Review ID to delete |

**Example Request:**

```http
DELETE /api/ecommerce/admin/reviews/10
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Responses:**

```json
// Invalid review ID (400 Bad Request)
{
  "success": false,
  "error": "Invalid review ID"
}

// Review not found (404 Not Found)
{
  "success": false,
  "error": "Review not found"
}
```

**⚠️ Important Notes:**
- This is a **permanent deletion** (hard delete)
- The review cannot be recovered after deletion
- This will affect product rating calculations
- Use with caution - consider rejecting instead of deleting
- Audit logs should track all deletions

---

### 5. Get Review Statistics

Retrieve comprehensive statistics and analytics about reviews.

**Endpoint:** `GET /api/ecommerce/admin/reviews/statistics`

**Example Request:**

```http
GET /api/ecommerce/admin/reviews/statistics
Authorization: Bearer <token>
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "message": "Review statistics retrieved successfully",
  "data": {
    "overview": {
      "total_reviews": 1250,
      "pending_reviews": 45,
      "approved_reviews": 1180,
      "rejected_reviews": 25,
      "average_rating": 4.3
    },
    "rating_distribution": [
      {
        "rating": 5,
        "count": 620,
        "percentage": 49.6
      },
      {
        "rating": 4,
        "count": 380,
        "percentage": 30.4
      },
      {
        "rating": 3,
        "count": 150,
        "percentage": 12.0
      },
      {
        "rating": 2,
        "count": 60,
        "percentage": 4.8
      },
      {
        "rating": 1,
        "count": 40,
        "percentage": 3.2
      }
    ],
    "status_distribution": [
      {
        "status": "approved",
        "count": 1180,
        "percentage": 94.4
      },
      {
        "status": "pending",
        "count": 45,
        "percentage": 3.6
      },
      {
        "status": "rejected",
        "count": 25,
        "percentage": 2.0
      }
    ],
    "most_reviewed_products": [
      {
        "product_id": 1,
        "product_name": "Laptop ASUS ROG Strix G15",
        "review_count": 145,
        "average_rating": 4.8,
        "store_name": "Toko Elektronik Jaya"
      },
      {
        "product_id": 5,
        "product_name": "Smartphone iPhone 15 Pro",
        "review_count": 132,
        "average_rating": 4.7,
        "store_name": "Gadget Store"
      },
      {
        "product_id": 12,
        "product_name": "Smart TV Samsung 55 inch",
        "review_count": 98,
        "average_rating": 4.5,
        "store_name": "Electronics Hub"
      }
    ],
    "most_active_reviewers": [
      {
        "user_id": 15,
        "username": "techreviewer",
        "full_name": "Tech Reviewer Pro",
        "review_count": 87,
        "average_rating_given": 4.2
      },
      {
        "user_id": 23,
        "username": "shopaholic",
        "full_name": "Sarah Shopping",
        "review_count": 65,
        "average_rating_given": 4.5
      }
    ],
    "recent_trends": {
      "reviews_today": 12,
      "reviews_this_week": 89,
      "reviews_this_month": 345,
      "average_rating_this_month": 4.4,
      "pending_requiring_attention": 45
    }
  }
}
```

---

### 6. Export Reviews to Excel

Export review data to an Excel file with optional filtering.

**Endpoint:** `GET /api/ecommerce/admin/reviews/export/excel`

**Query Parameters:** (Same as Get All Reviews)

| Parameter | Type | Description |
|-----------|------|-------------|
| `review_text` | string | Filter by review text |
| `product_id` | integer | Filter by product ID |
| `user_id` | integer | Filter by user ID |
| `rating` | integer | Filter by rating (1-5) |
| `status` | string | Filter by status: `pending`, `approved`, `rejected` |

**Example Requests:**

```http
# Export all reviews
GET /api/ecommerce/admin/reviews/export/excel
Authorization: Bearer <token>

# Export pending reviews only
GET /api/ecommerce/admin/reviews/export/excel?status=pending
Authorization: Bearer <token>

# Export 5-star reviews
GET /api/ecommerce/admin/reviews/export/excel?rating=5&status=approved
Authorization: Bearer <token>

# Export reviews for specific product
GET /api/ecommerce/admin/reviews/export/excel?product_id=1
Authorization: Bearer <token>

# Export with text filter
GET /api/ecommerce/admin/reviews/export/excel?review_text=excellent&rating=5
Authorization: Bearer <token>
```

**Success Response (200 OK):**

- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename=reviews_export_<timestamp>.xlsx`

**Excel File Contains:**
- Review ID
- Product Name
- Product ID
- Store Name
- Reviewer Name
- Reviewer Email
- Rating (1-5)
- Review Text
- Status
- Created Date
- Updated Date

---

## Data Models

### Review Object

```typescript
{
  review_id: number;
  product_id: number;
  user_id: number;
  rating: number;           // 1-5
  review_text: string;
  status: "pending" | "approved" | "rejected";
  created_at: Date;
  updated_at: Date;
  product: {
    product_id: number;
    name: string;
    price: number;
    rating_average: number;
    total_reviews: number;
    seller: {
      seller_id: number;
      store_name: string;
      rating_average: number;
    };
  };
  user: {
    user_id: number;
    username: string;
    full_name: string;
    email: string;
    profile_picture: string | null;
  };
}
```

### Review Statistics Object

```typescript
{
  overview: {
    total_reviews: number;
    pending_reviews: number;
    approved_reviews: number;
    rejected_reviews: number;
    average_rating: number;
  };
  rating_distribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  status_distribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  most_reviewed_products: Array<{
    product_id: number;
    product_name: string;
    review_count: number;
    average_rating: number;
    store_name: string;
  }>;
  most_active_reviewers: Array<{
    user_id: number;
    username: string;
    full_name: string;
    review_count: number;
    average_rating_given: number;
  }>;
  recent_trends: {
    reviews_today: number;
    reviews_this_week: number;
    reviews_this_month: number;
    average_rating_this_month: number;
    pending_requiring_attention: number;
  };
}
```

---

## Review Status Workflow

### Status Types

1. **Pending** (Default)
   - New reviews start in this state
   - Awaiting admin moderation
   - Not visible to public
   - Requires admin action

2. **Approved**
   - Review has been verified by admin
   - Visible to all users
   - Counted in product ratings
   - Displayed on product pages

3. **Rejected**
   - Review violates policies or is spam
   - Not visible to public
   - Not counted in ratings
   - User may be notified

### Workflow Diagram

```
[User Submits Review]
         ↓
    [PENDING]
         ↓
    [Admin Review]
      ↙     ↘
[APPROVED] [REJECTED]
     ↓          ↓
 [Public]   [Hidden]
```

### Moderation Guidelines

**Approve when:**
- Review is genuine and relevant
- Language is appropriate
- Contains helpful information
- No spam or advertising

**Reject when:**
- Contains offensive language
- Is spam or advertising
- Fake or fraudulent review
- Violates terms of service
- Off-topic or irrelevant

**Set to Pending when:**
- Requires additional review
- Borderline case
- Need more investigation

---

## Error Codes

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions (non-admin) |
| 404 | Not Found | Review not found |
| 500 | Internal Server Error | Server-side error |

---

## Testing

### Automated Test Script

Run the automated test suite:

```bash
node modules/ecommerce/tests/testjs/test-admin-reviews.js
```

### Manual Testing with REST Client

Use the provided REST file:

```
modules/ecommerce/tests/admin-reviews.rest
```

### Test Coverage

The test suite covers:
- ✅ Authentication and authorization
- ✅ Get all reviews with various filters
- ✅ Get review by ID
- ✅ Update review status (approve/reject/pending)
- ✅ Delete reviews
- ✅ Review statistics and analytics
- ✅ Excel export with filters
- ✅ Validation and error handling
- ✅ Edge cases (invalid IDs, status changes)
- ✅ Security (unauthorized access)

### Sample Test Scenarios

1. **Get all pending reviews for moderation**
2. **Approve a pending review**
3. **Reject inappropriate review**
4. **Filter reviews by rating (1-5)**
5. **Search reviews by text content**
6. **Get reviews for specific product**
7. **Export approved 5-star reviews**
8. **View review statistics dashboard**
9. **Handle invalid status updates**
10. **Delete spam reviews**

---

## Best Practices

### Moderation
- Review pending items regularly (daily)
- Set clear moderation guidelines
- Be consistent in approval decisions
- Respond to borderline cases promptly
- Document rejection reasons

### Quality Control
- Check for duplicate reviews
- Verify review authenticity
- Look for spam patterns
- Monitor fake review attempts
- Track repeat violators

### Performance
- Use pagination for large datasets
- Implement caching for statistics
- Index rating and status fields
- Optimize database queries
- Schedule regular cleanup

### User Experience
- Moderate quickly (within 24 hours)
- Be fair and transparent
- Consider user feedback
- Balance strictness and openness
- Maintain review quality

### Analytics
- Monitor review trends
- Track approval rates
- Analyze rating distributions
- Identify top reviewers
- Watch for unusual patterns

---

## Common Use Cases

### 1. Daily Moderation Workflow
```http
# 1. Get pending reviews
GET /api/ecommerce/admin/reviews?status=pending&sort_by=created_at&sort_order=asc

# 2. Review each one and approve/reject
PATCH /api/ecommerce/admin/reviews/:id/status
{
  "status": "approved"  // or "rejected"
}
```

### 2. Handle Spam Reviews
```http
# 1. Find suspicious reviews
GET /api/ecommerce/admin/reviews?rating=5&review_text=spam

# 2. Delete spam reviews
DELETE /api/ecommerce/admin/reviews/:id
```

### 3. Monitor Product Quality
```http
# 1. Get low-rated reviews
GET /api/ecommerce/admin/reviews?rating=1&status=approved

# 2. Check specific product reviews
GET /api/ecommerce/admin/reviews?product_id=123&sort_by=rating&sort_order=asc
```

### 4. Generate Monthly Report
```http
# 1. Get statistics
GET /api/ecommerce/admin/reviews/statistics

# 2. Export all reviews
GET /api/ecommerce/admin/reviews/export/excel
```

---

## Support

For issues or questions:
- Check the automated test results
- Review error responses carefully
- Consult moderation guidelines
- Contact the development team

---

**Document Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Maintained by:** E-Commerce Module Team
