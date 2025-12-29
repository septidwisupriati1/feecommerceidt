# E-Commerce Admin API Logs Viewing

## Overview

The E-Commerce Admin API Logs feature provides comprehensive logging and monitoring capabilities for all API requests made to the E-Commerce module. This system automatically captures all requests to `/api/ecommerce/*` endpoints and stores detailed information for analysis, debugging, and auditing purposes.

## Features

- **Automatic Logging**: All API requests to E-Commerce endpoints are automatically logged
- **Detailed Information**: Captures request method, route, status code, request/response bodies, IP address, user agent, and duration
- **Advanced Filtering**: Filter logs by method, status code, date range, route, and user
- **Pagination**: Efficient pagination for large log datasets
- **Statistics Dashboard**: Get insights with aggregated statistics
- **Security**: Admin-only access with JWT authentication
- **Data Sanitization**: Sensitive data (passwords, tokens) automatically redacted
- **Cleanup Utility**: Remove old logs to manage database size

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Filter Options](#filter-options)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Database Schema

### `api_request_logs` Table

| Column | Type | Description |
|--------|------|-------------|
| `log_id` | INT | Primary key, auto-increment |
| `user_id` | INT | User ID (nullable for unauthenticated requests) |
| `request_method` | VARCHAR(10) | HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `route_path` | VARCHAR(500) | Full route path including query parameters |
| `status_code` | INT | HTTP status code (200, 401, 404, etc.) |
| `request_body` | LONGTEXT | Request body as JSON string (sanitized) |
| `response_body` | LONGTEXT | Response body as JSON string (sanitized) |
| `ip_address` | VARCHAR(45) | Client IP address |
| `user_agent` | TEXT | User agent string |
| `duration_ms` | INT | Request duration in milliseconds |
| `error_message` | TEXT | Error message if status >= 400 |
| `created_at` | DATETIME | Timestamp when log was created |

### Indexes

- `idx_api_log_user` - User ID index
- `idx_api_log_method` - Request method index
- `idx_api_log_status` - Status code index
- `idx_api_log_created` - Created date index
- `idx_api_log_route` - Route path index

---

## API Endpoints

### Base URL
```
/api/ecommerce/admin/logs
```

### Authentication
All endpoints require:
- Valid JWT token in Authorization header
- Admin role

### 1. Get All API Logs

**GET** `/api/ecommerce/admin/logs`

Retrieve all API logs with optional filtering, sorting, and pagination.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 50) |
| `method` | string | No | Filter by HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `status_code` | number | No | Filter by exact status code |
| `status_range` | string | No | Filter by status range (2xx, 4xx, 5xx) |
| `date_from` | string | No | Filter from date (YYYY-MM-DD) |
| `date_to` | string | No | Filter to date (YYYY-MM-DD) |
| `user_id` | number | No | Filter by user ID |
| `route` | string | No | Filter by route path (partial match) |
| `sort_by` | string | No | Sort field (created_at, request_method, status_code, duration_ms) |
| `sort_order` | string | No | Sort order (asc, desc) (default: desc) |

#### Response Example

```json
{
  "success": true,
  "message": "API logs retrieved successfully",
  "data": {
    "logs": [
      {
        "log_id": 123,
        "user_id": 5,
        "request_method": "POST",
        "route_path": "/api/ecommerce/auth/login",
        "status_code": 200,
        "request_body": "{\"email\":\"user@example.com\",\"password\":\"[REDACTED]\"}",
        "response_body": "{\"success\":true,\"token\":\"[REDACTED]\"}",
        "ip_address": "127.0.0.1",
        "user_agent": "Mozilla/5.0...",
        "duration_ms": 245,
        "error_message": null,
        "created_at": "2025-10-23T10:30:45.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 10,
      "total_records": 500,
      "per_page": 50,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "method": "POST",
      "status_code": null,
      "status_range": null,
      "date_from": null,
      "date_to": null,
      "user_id": null,
      "route": null
    }
  }
}
```

---

### 2. Get Single API Log

**GET** `/api/ecommerce/admin/logs/:logId`

Retrieve detailed information for a specific log entry.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `logId` | number | Yes | Log ID (path parameter) |

#### Response Example

```json
{
  "success": true,
  "message": "API log retrieved successfully",
  "data": {
    "log_id": 123,
    "user_id": 5,
    "request_method": "POST",
    "route_path": "/api/ecommerce/products",
    "status_code": 201,
    "request_body": "{\"name\":\"Product Name\",\"price\":99.99}",
    "response_body": "{\"success\":true,\"data\":{\"product_id\":456}}",
    "ip_address": "192.168.1.100",
    "user_agent": "PostmanRuntime/7.29.2",
    "duration_ms": 156,
    "error_message": null,
    "created_at": "2025-10-23T14:22:33.000Z"
  }
}
```

---

### 3. Get API Logs Statistics

**GET** `/api/ecommerce/admin/logs/statistics`

Get aggregated statistics about API requests.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `date_from` | string | No | Filter from date (YYYY-MM-DD) |
| `date_to` | string | No | Filter to date (YYYY-MM-DD) |

#### Response Example

```json
{
  "success": true,
  "message": "API logs statistics retrieved successfully",
  "data": {
    "total_requests": 1250,
    "successful_requests": 1100,
    "client_errors": 120,
    "server_errors": 30,
    "success_rate": "88.00",
    "average_duration_ms": 178,
    "requests_by_method": [
      { "method": "GET", "count": 650 },
      { "method": "POST", "count": 400 },
      { "method": "PUT", "count": 150 },
      { "method": "DELETE", "count": 50 }
    ],
    "top_routes": [
      {
        "route_path": "/api/ecommerce/browse/products",
        "request_count": 245,
        "avg_duration_ms": 89
      },
      {
        "route_path": "/api/ecommerce/auth/login",
        "request_count": 180,
        "avg_duration_ms": 156
      }
    ],
    "top_users": [
      { "user_id": 5, "request_count": 345 },
      { "user_id": 12, "request_count": 289 }
    ],
    "date_range": {
      "from": "2025-10-01",
      "to": "2025-10-23"
    }
  }
}
```

---

### 4. Cleanup Old Logs

**DELETE** `/api/ecommerce/admin/logs/cleanup`

Delete old API logs to manage database size.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `days` | number | No | Delete logs older than X days (default: 90) |

#### Response Example

```json
{
  "success": true,
  "message": "Successfully deleted logs older than 90 days",
  "data": {
    "deleted_count": 450,
    "cutoff_date": "2025-07-25T00:00:00.000Z"
  }
}
```

---

## Filter Options

### By HTTP Method
Filter logs by specific HTTP methods:
- `GET` - Read operations
- `POST` - Create operations
- `PUT` - Update operations
- `DELETE` - Delete operations
- `PATCH` - Partial update operations

**Example:**
```
GET /api/ecommerce/admin/logs?method=POST
```

---

### By Status Code

#### Exact Status Code
Filter by a specific HTTP status code:

**Example:**
```
GET /api/ecommerce/admin/logs?status_code=401
```

#### Status Code Range
Filter by status code ranges:
- `2xx` - Successful responses (200-299)
- `4xx` - Client errors (400-499)
- `5xx` - Server errors (500-599)

**Example:**
```
GET /api/ecommerce/admin/logs?status_range=4xx
```

---

### By Date Range

Filter logs by date range using ISO date format (YYYY-MM-DD).

**Example:**
```
GET /api/ecommerce/admin/logs?date_from=2025-10-01&date_to=2025-10-23
```

**Single Date (Today's logs):**
```
GET /api/ecommerce/admin/logs?date_from=2025-10-23&date_to=2025-10-23
```

---

### By Route Path

Filter logs by partial route match. Use this to find all requests to a specific endpoint or endpoint group.

**Examples:**
```
# All auth-related requests
GET /api/ecommerce/admin/logs?route=/auth

# All product-related requests
GET /api/ecommerce/admin/logs?route=/products

# Specific endpoint
GET /api/ecommerce/admin/logs?route=/auth/login
```

---

### By User ID

Filter logs by a specific user's activity.

**Example:**
```
GET /api/ecommerce/admin/logs?user_id=5
```

---

### Combined Filters

Combine multiple filters for precise log retrieval:

**Example:**
```
GET /api/ecommerce/admin/logs?method=POST&status_range=4xx&date_from=2025-10-01&route=/auth
```

This finds all failed POST requests to auth endpoints in October 2025.

---

## Usage Examples

### 1. View Recent API Activity

Get the last 50 API requests:

```bash
curl -X GET "http://localhost:5000/api/ecommerce/admin/logs?limit=50&sort_by=created_at&sort_order=desc" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 2. Monitor Failed Login Attempts

Find all 401 (Unauthorized) responses on login endpoint:

```bash
curl -X GET "http://localhost:5000/api/ecommerce/admin/logs?route=/auth/login&status_code=401" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 3. Track User Activity

View all requests made by a specific user:

```bash
curl -X GET "http://localhost:5000/api/ecommerce/admin/logs?user_id=5&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 4. Identify Slow Endpoints

Find the slowest API calls:

```bash
curl -X GET "http://localhost:5000/api/ecommerce/admin/logs?sort_by=duration_ms&sort_order=desc&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 5. Monitor Server Errors

Get all 5xx server errors:

```bash
curl -X GET "http://localhost:5000/api/ecommerce/admin/logs?status_range=5xx" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 6. Daily Activity Report

Get today's API activity statistics:

```bash
curl -X GET "http://localhost:5000/api/ecommerce/admin/logs/statistics?date_from=2025-10-23&date_to=2025-10-23" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 7. Cleanup Old Logs

Delete logs older than 30 days:

```bash
curl -X DELETE "http://localhost:5000/api/ecommerce/admin/logs/cleanup?days=30" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Testing

### REST Client Testing

Use the provided REST file for manual testing:

**File:** `modules/ecommerce/tests/api-logs.rest`

1. Open the file in VS Code with REST Client extension
2. Update the `@token` variable with your admin JWT token
3. Click "Send Request" above any test case

### Automated Testing

Run the automated test suite:

```bash
node modules/ecommerce/tests/api-logs.test.js
```

**Test Coverage:**
- ✓ Admin authentication
- ✓ Get all logs with pagination
- ✓ Filter by HTTP method
- ✓ Filter by status code
- ✓ Filter by status range
- ✓ Filter by date range
- ✓ Filter by route path
- ✓ Sort operations
- ✓ Get single log details
- ✓ Statistics retrieval
- ✓ Old logs cleanup
- ✓ Error handling
- ✓ Combined filters

---

## Best Practices

### 1. Regular Log Cleanup

Schedule regular cleanup to prevent database bloat:

```bash
# Delete logs older than 90 days (recommended)
DELETE /api/ecommerce/admin/logs/cleanup?days=90
```

### 2. Use Appropriate Filters

Use specific filters to reduce response size and improve performance:

```bash
# Good - Specific filter
GET /api/ecommerce/admin/logs?route=/products&date_from=2025-10-23

# Less efficient - No filters with large dataset
GET /api/ecommerce/admin/logs?limit=1000
```

### 3. Monitor Critical Endpoints

Regularly check logs for:
- Authentication endpoints (failed logins)
- Payment/transaction endpoints (errors)
- Data modification endpoints (audit trail)

### 4. Analyze Performance

Use duration sorting to identify slow endpoints:

```bash
GET /api/ecommerce/admin/logs?sort_by=duration_ms&sort_order=desc&limit=20
```

### 5. Security Monitoring

Monitor for suspicious activity:
- Multiple failed login attempts from same IP
- Unusual number of requests from single user
- Unauthorized access attempts (401/403 errors)

---

## Troubleshooting

### Issue: No logs appearing

**Possible Causes:**
1. Middleware not properly registered
2. Requests not matching `/api/ecommerce/*` pattern
3. Database connection issues

**Solution:**
- Check `index.js` has `apiLogMiddleware` registered
- Verify database connection
- Check Prisma schema migration status

---

### Issue: Large response body size

**Problem:** Response times slow due to large request/response bodies in logs.

**Solution:**
- The middleware automatically truncates responses with >100 items
- Use pagination with smaller `limit` values
- Filter by specific date ranges to reduce dataset

---

### Issue: Sensitive data in logs

**Problem:** Concerned about passwords or tokens in logs.

**Solution:**
- The middleware automatically redacts sensitive fields:
  - `password`, `password_hash`
  - `token`, `access_token`, `refresh_token`
  - `email_verification_token`, `password_reset_token`
- Sensitive fields are replaced with `[REDACTED]`

---

### Issue: Permission denied

**Error:** `Access denied. Required roles: admin`

**Solution:**
- Ensure you're logged in as admin user
- Verify JWT token is valid and not expired
- Check token includes admin role

---

### Issue: Statistics showing zero

**Problem:** Statistics endpoint returns all zeros.

**Solution:**
- No logs exist for the specified date range
- Check date format (YYYY-MM-DD)
- Try without date filters to see all-time stats

---

## Security Considerations

### Authentication & Authorization

- **JWT Required**: All endpoints require valid JWT token
- **Admin Only**: Only users with admin role can access logs
- **Token Validation**: Tokens checked against blacklist

### Data Sanitization

Sensitive data automatically redacted:
- Passwords and password hashes
- Authentication tokens
- Email verification tokens
- Password reset tokens

### Rate Limiting

Consider implementing rate limiting for log endpoints to prevent abuse:
- Recommended: 100 requests per hour per admin
- Use middleware like `express-rate-limit`

### Audit Trail

The logging system itself creates an audit trail:
- Who accessed what data
- When administrative actions were performed
- What changes were made

---

## Performance Optimization

### Database Indexes

The schema includes optimized indexes for common queries:
- User ID queries: `idx_api_log_user`
- Method filtering: `idx_api_log_method`
- Status filtering: `idx_api_log_status`
- Date range queries: `idx_api_log_created`
- Route filtering: `idx_api_log_route`

### Query Tips

1. **Use date ranges** for large datasets
2. **Limit results** with pagination
3. **Use specific filters** instead of broad searches
4. **Regular cleanup** to maintain performance

---

## Migration Instructions

### 1. Run Prisma Migration

```bash
# Generate Prisma client
npm run db:generate

# Run migration
npx prisma migrate dev --schema=./prisma/schema-ecommerce.prisma --name add_api_request_logs
```

### 2. Verify Migration

```bash
# Check migration status
npx prisma migrate status --schema=./prisma/schema-ecommerce.prisma
```

### 3. Test Logging

1. Start the server
2. Make any E-Commerce API request
3. Check logs: `GET /api/ecommerce/admin/logs`

---

## API Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (not admin role) |
| 404 | Not Found (log ID doesn't exist) |
| 500 | Internal Server Error |

---

## Support

For issues or questions:
1. Check logs for error messages
2. Review database connection status
3. Verify Prisma schema migrations
4. Check middleware registration in `index.js`

---

## Changelog

### Version 1.0.0 (2025-10-23)
- Initial release
- Automatic logging for all E-Commerce API requests
- Admin-only log viewing with filtering
- Statistics dashboard
- Old logs cleanup utility
- Comprehensive test suite
- Security features (data sanitization, admin-only access)

---

**Last Updated:** October 23, 2025
**Module:** E-Commerce
**Access Level:** Admin Only
