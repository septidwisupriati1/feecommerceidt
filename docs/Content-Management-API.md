# E-Commerce Admin - Content Management API

Complete API documentation for managing FAQ, Terms of Service, and Privacy Policy in the E-Commerce module.

---

## Base URLs

```
FAQ: /api/ecommerce/admin/faqs
Terms of Service: /api/ecommerce/admin/terms-of-service
Privacy Policy: /api/ecommerce/admin/privacy-policies
```

---

## Authentication

All endpoints require **admin authentication** via Bearer token.

```http
Authorization: Bearer <admin_jwt_token>
```

**How to get admin token:**
```http
POST /api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin123!"
}
```

---

## Table of Contents

1. [FAQ Management](#faq-management)
2. [Terms of Service Management](#terms-of-service-management)
3. [Privacy Policy Management](#privacy-policy-management)
4. [Business Rules](#business-rules)
5. [Error Codes](#error-codes)

---

## FAQ Management

### 1.1 Get All FAQs

**Endpoint:** `GET /api/ecommerce/admin/faqs`

**Query Parameters:**
- `status` (optional) - Filter by status: `active` or `inactive`
- `category` (optional) - Filter by category
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Example Request:**
```http
GET /api/ecommerce/admin/faqs?status=active&page=1&limit=10
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "faqs": [
      {
        "faq_id": 1,
        "question": "Bagaimana cara mendaftar sebagai penjual?",
        "answer": "Anda dapat mendaftar sebagai penjual...",
        "category": "Penjual",
        "order_index": 1,
        "status": "active",
        "created_at": "2025-01-01T00:00:00.000Z",
        "updated_at": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

---

### 1.2 Get FAQ by ID

**Endpoint:** `GET /api/ecommerce/admin/faqs/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "faq": {
      "faq_id": 1,
      "question": "...",
      "answer": "...",
      "category": "Penjual",
      "order_index": 1,
      "status": "active",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "FAQ not found"
}
```

---

### 1.3 Create FAQ

**Endpoint:** `POST /api/ecommerce/admin/faqs`

**Request Body:**
```json
{
  "question": "Bagaimana cara menghubungi customer service?",
  "answer": "Anda dapat menghubungi customer service kami melalui...",
  "category": "Layanan",
  "order_index": 6,
  "status": "active"
}
```

**Fields:**
- `question` (required) - FAQ question
- `answer` (required) - FAQ answer
- `category` (optional, default: "Umum") - FAQ category
- `order_index` (optional, default: 0) - Display order
- `status` (optional, default: "active") - Status: `active` or `inactive`

**Success Response (201):**
```json
{
  "success": true,
  "message": "FAQ created successfully",
  "data": {
    "faq": {
      "faq_id": 6,
      "question": "Bagaimana cara menghubungi customer service?",
      "answer": "Anda dapat menghubungi customer service kami melalui...",
      "category": "Layanan",
      "order_index": 6,
      "status": "active",
      "created_at": "2025-10-27T00:00:00.000Z",
      "updated_at": "2025-10-27T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

400 - Missing required fields:
```json
{
  "success": false,
  "error": "Question and answer are required"
}
```

400 - Invalid status:
```json
{
  "success": false,
  "error": "Status must be either 'active' or 'inactive'"
}
```

---

### 1.4 Update FAQ

**Endpoint:** `PUT /api/ecommerce/admin/faqs/:id`

**Request Body (all fields optional):**
```json
{
  "question": "Updated question",
  "answer": "Updated answer",
  "category": "Updated category",
  "order_index": 10,
  "status": "inactive"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "FAQ updated successfully",
  "data": {
    "faq": { /* updated faq */ }
  }
}
```

---

### 1.5 Delete FAQ

**Endpoint:** `DELETE /api/ecommerce/admin/faqs/:id`

**Success Response (200):**
```json
{
  "success": true,
  "message": "FAQ deleted successfully"
}
```

**Note:** Deletion is permanent. The FAQ record is removed from the database.

---

## Terms of Service Management

### 2.1 Get All Terms of Service

**Endpoint:** `GET /api/ecommerce/admin/terms-of-service`

**Query Parameters:**
- `is_active` (optional) - Filter by active status: `true` or `false`
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "terms": [
      {
        "tos_id": 1,
        "title": "Syarat dan Ketentuan Layanan",
        "content": "# Syarat dan Ketentuan...",
        "version": "1.0",
        "is_active": true,
        "effective_date": "2025-01-01T00:00:00.000Z",
        "created_at": "2025-01-01T00:00:00.000Z",
        "updated_at": "2025-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

---

### 2.2 Get Terms of Service by ID

**Endpoint:** `GET /api/ecommerce/admin/terms-of-service/:id`

---

### 2.3 Create Terms of Service

**Endpoint:** `POST /api/ecommerce/admin/terms-of-service`

**Request Body:**
```json
{
  "title": "Syarat dan Ketentuan Layanan (v2.0)",
  "content": "# Syarat dan Ketentuan Layanan v2.0\n\n## 1. Pendahuluan...",
  "version": "2.0",
  "effective_date": "2025-11-01",
  "is_active": false
}
```

**Fields:**
- `title` (required) - Terms title
- `content` (required) - Terms content (supports Markdown)
- `version` (required) - Version number
- `effective_date` (optional, default: current date) - Date when terms become effective
- `is_active` (optional, default: false) - Active status

**Important:** If `is_active: true`, all other terms will be automatically deactivated.

**Success Response (201):**
```json
{
  "success": true,
  "message": "Terms of service created successfully",
  "data": {
    "terms": { /* created terms */ }
  }
}
```

---

### 2.4 Update Terms of Service

**Endpoint:** `PUT /api/ecommerce/admin/terms-of-service/:id`

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "content": "Updated content",
  "version": "2.1",
  "effective_date": "2025-12-01",
  "is_active": true
}
```

**Important Rules:**
- If `is_active: true`, all other terms will be automatically deactivated
- Cannot set `is_active: false` if this is the only active terms

**Error Response (400) - Cannot deactivate last active:**
```json
{
  "success": false,
  "error": "Cannot deactivate the only active terms of service. Please activate another one first."
}
```

---

### 2.5 Activate Terms of Service

**Endpoint:** `PUT /api/ecommerce/admin/terms-of-service/:id/activate`

**Description:** Sets the specified terms as active and deactivates all others.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Terms of service activated successfully",
  "data": {
    "terms": { /* activated terms */ }
  }
}
```

---

### 2.6 Delete Terms of Service

**Endpoint:** `DELETE /api/ecommerce/admin/terms-of-service/:id`

**Important Rules:**
- Cannot delete the only active terms
- If deleting an active terms and other terms exist, the most recent one will be automatically activated

**Error Response (400):**
```json
{
  "success": false,
  "error": "Cannot delete the only active terms of service. Please activate another one first."
}
```

---

## Privacy Policy Management

Works exactly the same as Terms of Service Management.

**Endpoints:**
- `GET /api/ecommerce/admin/privacy-policies`
- `GET /api/ecommerce/admin/privacy-policies/:id`
- `POST /api/ecommerce/admin/privacy-policies`
- `PUT /api/ecommerce/admin/privacy-policies/:id`
- `PUT /api/ecommerce/admin/privacy-policies/:id/activate`
- `DELETE /api/ecommerce/admin/privacy-policies/:id`

**Same business rules apply:**
- Only ONE policy can be active at a time
- Setting one as active deactivates all others
- Cannot deactivate the last active policy
- Cannot delete the only active policy
- Auto-activation on delete if needed

---

## Business Rules

### FAQ Rules
1. ✓ **Multiple Active:** Can have multiple FAQs active or inactive simultaneously
2. ✓ **Status:** Only `active` or `inactive` allowed
3. ✓ **Delete:** Can delete any FAQ anytime (no restrictions)
4. ✓ **Ordering:** FAQs ordered by `order_index` (ASC) then `created_at` (DESC)

### Terms of Service Rules
1. ⚠️ **Single Active:** Only ONE terms can be active at any time
2. ⚠️ **Auto-Deactivate:** Setting one as active automatically deactivates all others
3. ⚠️ **Mandatory Active:** At least ONE terms must always be active
4. ⚠️ **Cannot Deactivate Last:** Cannot set `is_active: false` if it's the only active terms
5. ⚠️ **Cannot Delete Last Active:** Cannot delete if it's the only active terms
6. ✓ **Auto-Activate on Delete:** If deleting active terms, most recent one becomes active
7. ✓ **First is Active:** First terms created is automatically set as active

### Privacy Policy Rules
Same as Terms of Service rules (1-7 above).

---

## Activity Logging

All operations are automatically logged to `activity_logs` table:

**Actions logged:**
- `FAQ_CREATED` - FAQ created
- `FAQ_UPDATED` - FAQ updated
- `FAQ_DELETED` - FAQ deleted
- `TERMS_CREATED` - Terms created
- `TERMS_UPDATED` - Terms updated
- `TERMS_ACTIVATED` - Terms activated
- `TERMS_DELETED` - Terms deleted
- `PRIVACY_POLICY_CREATED` - Policy created
- `PRIVACY_POLICY_UPDATED` - Policy updated
- `PRIVACY_POLICY_ACTIVATED` - Policy activated
- `PRIVACY_POLICY_DELETED` - Policy deleted

**Log includes:**
- Admin user ID who performed action
- Timestamp
- IP address
- User agent
- Resource type and ID
- Action description

---

## Error Codes

| Status Code | Description |
|------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (no token or invalid token) |
| 403 | Forbidden (not admin) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Testing

Test files available in:
- `modules/ecommerce/tests/FAQ-Management.rest`
- `modules/ecommerce/tests/Terms-Management.rest`
- `modules/ecommerce/tests/Privacy-Policy-Management.rest`

**Test Sequence:**
1. Login as admin to get token
2. Test GET operations
3. Test CREATE operations
4. Test UPDATE operations (including activation logic)
5. Test DELETE operations
6. Test error scenarios

---

## Examples

### Example 1: Creating and Activating New Terms

```http
# Step 1: Create new terms (inactive)
POST /api/ecommerce/admin/terms-of-service
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Terms v2.0",
  "content": "New terms content...",
  "version": "2.0",
  "is_active": false
}

# Step 2: Activate the new terms (deactivates all others)
PUT /api/ecommerce/admin/terms-of-service/2/activate
Authorization: Bearer <admin_token>
```

### Example 2: Managing FAQ Status

```http
# Create active FAQ
POST /api/ecommerce/admin/faqs
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "question": "How to contact support?",
  "answer": "Email us at support@example.com",
  "category": "Support",
  "status": "active"
}

# Later, deactivate it (can have multiple inactive FAQs)
PUT /api/ecommerce/admin/faqs/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "inactive"
}

# Reactivate it
PUT /api/ecommerce/admin/faqs/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "active"
}
```

---

**Implementation Date:** October 27, 2025  
**Module:** E-Commerce  
**Status:** ✓ Complete
