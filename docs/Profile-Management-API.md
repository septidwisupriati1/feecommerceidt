# E-Commerce Profile Management API

Complete profile management system with CRUD operations, profile picture upload, and password change functionality.

---

## Base URL

```
http://localhost:5000/api/ecommerce
```

---

## Table of Contents

1. [Get Profile](#1-get-profile)
2. [Update Profile](#2-update-profile)
3. [Upload Profile Picture](#3-upload-profile-picture)
4. [Delete Profile Picture](#4-delete-profile-picture)
5. [Change Password](#5-change-password)
6. [Testing](#testing)
7. [Error Codes](#error-codes)

---

## Authentication Required

All profile endpoints require authentication. Include JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

Get your token from the login endpoint: `POST /api/ecommerce/auth/login`

---

## 1. Get Profile

Retrieve complete user profile information.

**Endpoint:** `GET /profile`

**Access:** Protected (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user_id": 5,
    "username": "johndoe",
    "email": "john@example.com",
    "full_name": "John Doe",
    "phone": "081234567890",
    "profile_picture": "/uploads/profile-picture/user-5-1234567890.jpg",
    "email_verified": true,
    "status": "active",
    "roles": ["seller"],
    "seller_profile": {
      "seller_id": 3,
      "store_name": "Toko John",
      "store_description": "Best electronics store",
      "rating_average": 4.8
    },
    "created_at": "2025-10-01T02:30:00.000Z",
    "updated_at": "2025-10-15T08:45:00.000Z"
  }
}
```

**Response for Admin (no seller_profile):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user_id": 2,
    "username": "admin",
    "email": "admin@ecommerce.com",
    "full_name": "Admin User",
    "phone": "081234567891",
    "profile_picture": null,
    "email_verified": true,
    "status": "active",
    "roles": ["admin"],
    "seller_profile": null,
    "created_at": "2025-09-01T00:00:00.000Z",
    "updated_at": "2025-10-10T10:00:00.000Z"
  }
}
```

**Error Responses:**

401 Unauthorized - No token:
```json
{
  "success": false,
  "error": "No token provided"
}
```

404 Not Found - User not found:
```json
{
  "success": false,
  "error": "User not found"
}
```

---

## 2. Update Profile

Update user profile information (username, full name, phone).

**Endpoint:** `PUT /profile`

**Access:** Protected (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "johndoe_new",
  "full_name": "John Doe Updated",
  "phone": "081234567899"
}
```

**Fields:**
- `username` (optional) - New username (must be unique)
- `full_name` (optional) - New full name
- `phone` (optional) - New phone number (can be empty string to clear)

**Note:** You can update one, two, or all three fields. Email cannot be changed.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user_id": 5,
    "username": "johndoe_new",
    "email": "john@example.com",
    "full_name": "John Doe Updated",
    "phone": "081234567899",
    "profile_picture": "/uploads/profile-picture/user-5-1234567890.jpg",
    "updated_at": "2025-10-16T03:15:00.000Z"
  }
}
```

**Error Responses:**

400 Bad Request - Username taken:
```json
{
  "success": false,
  "error": "Username already taken"
}
```

404 Not Found - User not found:
```json
{
  "success": false,
  "error": "User not found"
}
```

**Activity Log:** Creates `PROFILE_UPDATED` activity log entry.

---

## 3. Upload Profile Picture

Upload or replace profile picture.

**Endpoint:** `POST /profile/picture`

**Access:** Protected (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
- `profile_picture` (required) - Image file

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)

**File Size Limit:** 2 MB

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "user_id": 5,
    "username": "johndoe",
    "profile_picture": "/uploads/profile-picture/user-5-1697452800000.jpg",
    "updated_at": "2025-10-16T03:20:00.000Z"
  }
}
```

**Notes:**
- Old profile picture is automatically deleted when uploading new one
- File is saved with unique name: `user-{userId}-{timestamp}.{ext}`
- Stored in: `uploads/profile-picture/`

**Error Responses:**

400 Bad Request - No file:
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

400 Bad Request - Invalid file type:
```json
{
  "success": false,
  "error": "Error: File upload only supports the following filetypes - jpeg|jpg|png"
}
```

400 Bad Request - File too large:
```json
{
  "success": false,
  "error": "File too large"
}
```

**Activity Log:** Creates `PROFILE_PICTURE_UPDATED` activity log entry.

---

## 4. Delete Profile Picture

Remove current profile picture.

**Endpoint:** `DELETE /profile/picture`

**Access:** Protected (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile picture deleted successfully"
}
```

**Error Responses:**

400 Bad Request - No picture to delete:
```json
{
  "success": false,
  "error": "No profile picture to delete"
}
```

404 Not Found - User not found:
```json
{
  "success": false,
  "error": "User not found"
}
```

**Activity Log:** Creates `PROFILE_PICTURE_DELETED` activity log entry.

---

## 5. Change Password

Change account password (requires current password verification).

**Endpoint:** `PUT /profile/change-password`

**Access:** Protected (requires JWT token)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Fields:**
- `currentPassword` (required) - Current password for verification
- `newPassword` (required) - New password (min 8 characters)

**Password Requirements:**
- Minimum 8 characters
- Must be different from current password
- Hashed with bcrypt (10 rounds)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**

400 Bad Request - Missing fields:
```json
{
  "success": false,
  "error": "Current password and new password are required"
}
```

400 Bad Request - Password too short:
```json
{
  "success": false,
  "error": "New password must be at least 8 characters long"
}
```

400 Bad Request - Same password:
```json
{
  "success": false,
  "error": "New password must be different from current password"
}
```

401 Unauthorized - Wrong current password:
```json
{
  "success": false,
  "error": "Current password is incorrect"
}
```

404 Not Found - User not found:
```json
{
  "success": false,
  "error": "User not found"
}
```

**Activity Log:** Creates `PASSWORD_CHANGED` activity log entry.

**Security Note:** After password change, existing JWT tokens remain valid until expiration. Consider logging out and re-logging in for security.

---

## Testing

### Quick Test Sequence

#### 1. Login First (Get Token)
```http
POST http://localhost:5000/api/ecommerce/auth/login
Content-Type: application/json

{
  "email": "seller1@ecommerce.com",
  "password": "Seller123!"
}
```

**Save the token from response for next requests.**

---

#### 2. Get Current Profile
```http
GET http://localhost:5000/api/ecommerce/profile
Authorization: Bearer <your-token>
```

---

#### 3. Update Profile
```http
PUT http://localhost:5000/api/ecommerce/profile
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "username": "seller1_updated",
  "full_name": "Seller One Updated",
  "phone": "081234567899"
}
```

---

#### 4. Upload Profile Picture

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/ecommerce/profile/picture \
  -H "Authorization: Bearer <your-token>" \
  -F "profile_picture=@/path/to/image.jpg"
```

**Using REST Client (VS Code extension):**
```http
POST http://localhost:5000/api/ecommerce/profile/picture
Authorization: Bearer <your-token>
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="profile_picture"; filename="profile.jpg"
Content-Type: image/jpeg

< /path/to/profile.jpg
------WebKitFormBoundary--
```

---

#### 5. Delete Profile Picture
```http
DELETE http://localhost:5000/api/ecommerce/profile/picture
Authorization: Bearer <your-token>
```

---

#### 6. Change Password
```http
PUT http://localhost:5000/api/ecommerce/profile/change-password
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "currentPassword": "Seller123!",
  "newPassword": "NewSeller123!"
}
```

---

### Test Accounts

| Email | Password | Role | Has Store |
|-------|----------|------|-----------|
| seller1@ecommerce.com | Seller123! | Seller | ✅ Yes |
| seller2@ecommerce.com | Seller123! | Seller | ✅ Yes |
| admin@ecommerce.com | Admin123! | Admin | ❌ No |

---

### Automated Tests

Run comprehensive profile management tests:
```bash
node test-ecommerce-profile.js
```

**Test Coverage:**
- ✅ Get profile
- ✅ Update profile (username, full_name, phone)
- ✅ Upload profile picture
- ✅ Delete profile picture
- ✅ Change password
- ✅ Error scenarios (invalid token, wrong password, etc.)

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (Validation error) |
| 401 | Unauthorized (Invalid/missing token, wrong password) |
| 404 | Not Found (User not found) |
| 500 | Internal Server Error |

---

## Security Features

### Authentication & Authorization
- ✅ JWT token required for all endpoints
- ✅ Token validation on every request
- ✅ User ID extracted from token (prevents accessing other profiles)

### Password Management
- ✅ Current password verification required
- ✅ Minimum 8 characters
- ✅ Must be different from current password
- ✅ Bcrypt hashing (10 rounds)

### File Upload Security
- ✅ File type validation (only images)
- ✅ File size limit (2 MB)
- ✅ Unique filename generation
- ✅ Automatic cleanup of old files
- ✅ Path traversal prevention

### Activity Logging
All profile actions are logged with:
- User ID
- Action type
- Description
- IP address
- Timestamp

---

## Activity Log Types

Profile management activities logged:

- `PROFILE_UPDATED` - Profile information updated
- `PROFILE_PICTURE_UPDATED` - Profile picture uploaded
- `PROFILE_PICTURE_DELETED` - Profile picture deleted
- `PASSWORD_CHANGED` - Password changed

Query recent activity:
```sql
SELECT action, description, ip_address, created_at
FROM activity_logs
WHERE user_id = 5 AND action LIKE 'PROFILE%'
ORDER BY created_at DESC
LIMIT 10;
```

---

## Database Schema

### Users Table Fields (Relevant to Profile)
```sql
users
├── user_id (PK)
├── username (unique)
├── email (unique, not updatable)
├── password_hash
├── full_name
├── phone
├── profile_picture
├── email_verified
├── status
├── created_at
└── updated_at

user_roles
├── role_id (PK)
├── user_id (FK)
├── role_type (seller/admin)
└── assigned_at

sellers
├── seller_id (PK)
├── user_id (FK)
├── store_name
├── store_description
├── rating_average
└── created_at

activity_logs
├── log_id (PK)
├── user_id (FK)
├── action
├── description
├── ip_address
└── created_at
```

---

## API Response Format

All endpoints return consistent JSON format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Profile Picture Storage

### Directory Structure
```
uploads/
└── profile-picture/
    ├── user-5-1697452800000.jpg
    ├── user-7-1697452900000.png
    └── ...
```

### File Naming Convention
```
user-{userId}-{timestamp}.{extension}
```

**Example:** `user-5-1697452800000.jpg`
- User ID: 5
- Timestamp: 1697452800000
- Extension: jpg

### Access URL
```
http://localhost:5000/uploads/profile-picture/user-5-1697452800000.jpg
```

**Note:** Make sure the `uploads` directory is served statically in your Express app.

---

## Common Use Cases

### 1. Update Username Only
```json
{
  "username": "new_username"
}
```

### 2. Update Full Name Only
```json
{
  "full_name": "New Full Name"
}
```

### 3. Clear Phone Number
```json
{
  "phone": ""
}
```

### 4. Update All Fields
```json
{
  "username": "new_username",
  "full_name": "New Full Name",
  "phone": "081234567899"
}
```

---

## Validation Rules

### Username
- Must be unique
- Cannot change to existing username
- Optional in update request

### Full Name
- Optional in update request
- Can be any string

### Phone
- Optional in update request
- Can be empty string to clear
- No format validation (flexible)

### Profile Picture
- File types: jpeg, jpg, png only
- Max size: 2 MB
- Only one picture per user

### Password
- Minimum 8 characters
- Must be different from current
- Current password verification required

---

## Rate Limiting

Currently not implemented. Recommended for production:
- Profile updates: 10 per hour
- Profile picture upload: 5 per hour
- Password change: 3 per hour
- Get profile: 100 per hour

---

## Integration with Authentication

### Workflow
1. ✅ Register account (`POST /auth/register`)
2. ✅ Verify email (`GET /auth/verify-email`)
3. ✅ Login (`POST /auth/login`) - **Get JWT token**
4. ✅ Get profile (`GET /profile`) - Use token
5. ✅ Update profile (`PUT /profile`) - Use token
6. ✅ Upload picture (`POST /profile/picture`) - Use token
7. ✅ Change password (`PUT /profile/change-password`) - Use token

### Token Management
- Token expires in 7 days
- Include in all profile requests
- Format: `Authorization: Bearer <token>`
- Get new token by logging in again

---

## Troubleshooting

### Common Issues

**"No token provided":**
- Include `Authorization: Bearer <token>` header
- Get token from login endpoint first

**"Username already taken":**
- Choose different username
- Usernames must be unique across all users

**"Current password is incorrect":**
- Verify you're using correct current password
- Password is case-sensitive

**"No file uploaded":**
- Check form-data format
- Field name must be `profile_picture`
- File must be included in request

**"File too large":**
- Image must be under 2 MB
- Compress image before uploading

**Profile picture not displaying:**
- Check if file exists in `uploads/profile-picture/`
- Verify Express serves static files
- Check file permissions

---

## Best Practices

### Security
1. Always validate JWT token
2. Never expose password in responses
3. Log all profile changes
4. Validate file uploads strictly
5. Clean up old files

### User Experience
1. Show current values in update form
2. Allow partial updates
3. Provide clear error messages
4. Validate input on client-side too
5. Show upload progress for images

### Performance
1. Optimize image size before upload
2. Use CDN for profile pictures in production
3. Cache profile data when appropriate
4. Index frequently queried fields

---

## Version Information

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Status:** ✅ Production Ready  
**Dependencies:** bcryptjs, multer, jsonwebtoken

---

## Quick Reference

### All Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/profile` | Get profile | ✅ Required |
| PUT | `/profile` | Update profile | ✅ Required |
| POST | `/profile/picture` | Upload picture | ✅ Required |
| DELETE | `/profile/picture` | Delete picture | ✅ Required |
| PUT | `/profile/change-password` | Change password | ✅ Required |

---

## Example cURL Commands

### Get Profile
```bash
curl http://localhost:5000/api/ecommerce/profile \
  -H "Authorization: Bearer <your-token>"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/ecommerce/profile \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "full_name": "New Name"
  }'
```

### Upload Profile Picture
```bash
curl -X POST http://localhost:5000/api/ecommerce/profile/picture \
  -H "Authorization: Bearer <your-token>" \
  -F "profile_picture=@/path/to/image.jpg"
```

### Delete Profile Picture
```bash
curl -X DELETE http://localhost:5000/api/ecommerce/profile/picture \
  -H "Authorization: Bearer <your-token>"
```

### Change Password
```bash
curl -X PUT http://localhost:5000/api/ecommerce/profile/change-password \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPass123!",
    "newPassword": "NewPass456!"
  }'
```

---

## Related Documentation

- [Authentication API](./README.md) - Register, Login, Logout, Forgot Password
- [Store Management API](./Store-Management-API.md) - Manage seller stores (coming soon)
- [Product Management API](./Product-Management-API.md) - Manage products (coming soon)

---

**Need help?** Check the test files in `modules/ecommerce/tests/Profile-Management.rest` for more examples.

**Ready to manage profiles!** 🚀
