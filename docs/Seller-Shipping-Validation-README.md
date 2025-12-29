# Seller Shipping Validation with RajaOngkir API

## Overview
This feature enables sellers to input shipping information (courier + tracking number) for orders and automatically validates the tracking numbers via RajaOngkir API after 3 hours. The system filters unsupported carriers from buyer's shipping cost calculation.

## Table of Contents
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Background Validation](#background-validation)
- [Integration Guide](#integration-guide)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Architecture

### Components
1. **Services**
   - `rajaOngkirService.js` - RajaOngkir API integration
   - `shippingValidationService.js` - Background validation logic

2. **Controllers**
   - `sellerShippingController.js` - Shipping endpoints for sellers
   - `shippingCostController.js` - Updated to filter carriers

3. **Routes**
   - `sellerShippingRoutes.js` - Seller shipping management

4. **Scheduler**
   - Runs every 10 minutes in `index.js`
   - Validates orders 3+ hours after shipping input

### Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  Seller inputs shipping info (courier + tracking number)    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │ Order status → "shipped"      │
         │ Validation → "pending"        │
         │ shipped_at → current time     │
         └───────────────┬───────────────┘
                         │
                    Wait 3 hours
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Background Scheduler         │
         │  (runs every 10 minutes)      │
         └───────────────┬───────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  Call RajaOngkir Track API    │
         │  GET /track/waybill           │
         └───────────────┬───────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
  ┌──────────────┐              ┌──────────────┐
  │ Valid        │              │ Invalid      │
  │ Status: valid│              │ Status: invalid│
  └──────────────┘              └──────────────┘
```

---

## Database Schema

### Enums Added

#### `courier_code`
```prisma
enum courier_code {
  jne
  sicepat
  sap
  ninja
  jnt
  tiki
  wahana
  pos
  lion
}
```

#### `shipping_validation_status`
```prisma
enum shipping_validation_status {
  pending_validation
  valid
  invalid
}
```

### `orders` Table Updates

New/Modified Fields:
```prisma
model orders {
  // ... existing fields ...
  
  courier_name                  courier_code?                @map("courier_name")
  shipping_validation_status    shipping_validation_status?  @default(pending_validation)
  shipping_validation_message   String?                      @db.VarChar(500)
  shipping_last_validated_at    DateTime?
  
  // ... existing fields ...
}
```

---

## API Endpoints

### 1. Input Shipping Information

**POST** `/api/ecommerce/seller/orders/:orderId/shipping`

**Auth:** Required (Seller JWT)

**Request Body:**
```json
{
  "courier_name": "jne",
  "tracking_number": "JNE123456789"
}
```

**Validation Rules:**
- `courier_name`: Must be valid enum (jne, sicepat, sap, ninja, jnt, tiki, wahana, pos, lion)
- `tracking_number`: 5-50 characters
- Order must be in `processing` status
- Shipping info cannot already exist

**Response (200):**
```json
{
  "success": true,
  "message": "Shipping information saved successfully. Validation will be performed automatically after 3 hours.",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20240115-001",
    "order_status": "shipped",
    "courier_name": "jne",
    "tracking_number": "JNE123456789",
    "shipped_at": "2024-01-15T10:30:00.000Z",
    "shipping_validation_status": "pending_validation"
  }
}
```

**Error Cases:**
- `400` - Invalid courier code
- `400` - Order not in processing status
- `400` - Shipping info already exists
- `404` - Order not found

---

### 2. Get Shipping Status

**GET** `/api/ecommerce/seller/orders/:orderId/shipping-status`

**Auth:** Required (Seller JWT)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order_id": 1,
    "order_number": "ORD-20240115-001",
    "order_status": "shipped",
    "courier_name": "jne",
    "tracking_number": "JNE123456789",
    "shipped_at": "2024-01-15T10:30:00.000Z",
    "shipping_validation_status": "valid",
    "shipping_validation_message": "Package delivered",
    "shipping_last_validated_at": "2024-01-15T14:00:00.000Z"
  }
}
```

---

### 3. Manual Validation (Testing)

**POST** `/api/ecommerce/seller/orders/:orderId/validate-shipping`

**Auth:** Required (Seller JWT)

**Purpose:** Trigger immediate validation (bypasses 3-hour wait)

**Response (200):**
```json
{
  "success": true,
  "message": "Shipping validation completed",
  "data": {
    "order_id": 1,
    "order_number": "ORD-20240115-001",
    "is_valid": true,
    "validation_message": "Shipment found and in transit",
    "delivery_status": "DELIVERED"
  }
}
```

---

### 4. Updated Order Endpoints

**GET** `/api/ecommerce/seller/orders` (List)
**GET** `/api/ecommerce/seller/orders/:orderId` (Detail)

Both endpoints now include shipping validation fields:
```json
{
  "order_id": 1,
  "order_status": "shipped",
  "courier_name": "jne",
  "tracking_number": "JNE123456789",
  "shipping_validation_status": "valid",
  "shipping_validation_message": "Delivered successfully",
  "shipping_last_validated_at": "2024-01-15T14:00:00.000Z"
}
```

---

## Background Validation

### Scheduler Configuration

**Location:** `index.js`

**Interval:** Every 10 minutes

```javascript
const VALIDATION_INTERVAL = 10 * 60 * 1000; // 10 minutes
setInterval(async () => {
  await processPendingShippingValidation();
}, VALIDATION_INTERVAL);
```

### Validation Logic

1. **Query Criteria:**
   - `order_status = 'shipped'`
   - `shipping_validation_status = 'pending_validation'`
   - `shipped_at <= (NOW - 3 hours)`
   - `tracking_number IS NOT NULL`
   - `courier_name IS NOT NULL`

2. **Batch Size:** 50 orders per run

3. **Process:**
   - Call RajaOngkir tracking API
   - Update order validation status
   - Create activity log
   - Handle errors gracefully

4. **One-Time Validation:**
   - Valid orders → never re-validated
   - Invalid orders → remain invalid (manual intervention)
   - Errors → keep pending (retry next cycle)

---

## RajaOngkir API Integration

### Tracking Endpoint

**URL:** `{BASE_URL_RAJA_ONGKIR}/track/waybill`

**Method:** GET

**Headers:**
```
inputapikey: {SHIPPING_COST_API_KEY}
Content-Type: application/json
```

**Query Parameters:**
```
waybill: {tracking_number}
courier: {courier_code}
```

### Example Request
```bash
GET https://api.rajaongkir.com/track/waybill?waybill=JNE123456789&courier=jne
Headers:
  inputapikey: your-api-key
```

### Response Structure
```json
{
  "rajaongkir": {
    "status": {
      "code": 200,
      "description": "OK"
    },
    "result": {
      "delivered": true,
      "summary": {
        "courier_code": "jne",
        "waybill_number": "JNE123456789",
        "status": "DELIVERED"
      },
      "manifest": [
        {
          "manifest_code": "1",
          "manifest_description": "Package received",
          "manifest_date": "2024-01-15",
          "manifest_time": "10:00"
        }
      ]
    }
  }
}
```

### Validation Logic

**Valid Tracking:**
- `status.code = 200`
- `result.delivered = true`
- OR `result.summary.status` contains delivery keywords

**Invalid Tracking:**
- `status.code = 400` (not found)
- Empty or missing result
- Error message in response

---

## Carrier Filtering

### Buyer Shipping Cost

**Endpoint:** `POST /api/ecommerce/buyer/shipping-cost/calculate`

**Filtered Carriers:** `ide`, `sentral`, `rex`

**Reason:** These carriers are not supported for seller tracking validation

**Implementation:** `shippingCostController.js`

```javascript
const excludedCarriers = ['ide', 'sentral', 'rex'];

if (result.data && Array.isArray(result.data)) {
  for (const courier of result.data) {
    const courierCode = (courier.courier_code || '').toLowerCase();
    
    // Skip excluded carriers
    if (excludedCarriers.includes(courierCode)) {
      continue;
    }
    
    shippingOptions.push(courier);
  }
}
```

**Buyers will only see:**
- jne, sicepat, sap, ninja, jnt, tiki, wahana, pos, lion

---

## Integration Guide

### Prerequisites

1. **Environment Variables**
   ```env
   SHIPPING_COST_API_KEY=your-rajaongkir-api-key
   BASE_URL_RAJA_ONGKIR=https://api.rajaongkir.com
   ```

2. **Database Migration**
   ```bash
   npm run db:reset:ecommerce
   npm run db:generate
   ```

3. **Server Restart**
   ```bash
   npm run dev
   ```

### Frontend Integration

#### 1. Input Shipping Form (Seller Dashboard)

```javascript
// POST shipping info
const inputShipping = async (orderId, courierName, trackingNumber) => {
  const response = await fetch(
    `${API_BASE}/seller/orders/${orderId}/shipping`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sellerToken}`
      },
      body: JSON.stringify({
        courier_name: courierName,
        tracking_number: trackingNumber
      })
    }
  );
  
  return response.json();
};
```

#### 2. Display Validation Status

```javascript
// Get shipping status
const getShippingStatus = async (orderId) => {
  const response = await fetch(
    `${API_BASE}/seller/orders/${orderId}/shipping-status`,
    {
      headers: {
        'Authorization': `Bearer ${sellerToken}`
      }
    }
  );
  
  return response.json();
};

// UI Display
const ValidationBadge = ({ status }) => {
  const badges = {
    pending_validation: { text: 'Pending', color: 'yellow' },
    valid: { text: 'Valid', color: 'green' },
    invalid: { text: 'Invalid', color: 'red' }
  };
  
  const badge = badges[status];
  return <span className={`badge-${badge.color}`}>{badge.text}</span>;
};
```

#### 3. Manual Validation Button (Optional)

```javascript
const triggerManualValidation = async (orderId) => {
  const response = await fetch(
    `${API_BASE}/seller/orders/${orderId}/validate-shipping`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sellerToken}`
      }
    }
  );
  
  return response.json();
};
```

---

## Testing

### Automated Test File

**Location:** `modules/ecommerce/tests/test-seller-shipping-validation.rest`

### Test Scenarios

#### 1. Happy Path
```rest
POST http://localhost:5000/api/ecommerce/seller/orders/1/shipping
Authorization: Bearer {{sellerToken}}

{
  "courier_name": "jne",
  "tracking_number": "JNE123456789"
}
```

**Expected:** Status changes to `shipped`, validation `pending`

#### 2. Error Cases

**Invalid Courier:**
```json
{ "courier_name": "invalid", "tracking_number": "TEST123" }
```
**Expected:** `400 Bad Request`

**Wrong Order Status:**
- Order in `pending` or `paid` status
**Expected:** `400 Bad Request`

**Duplicate Shipping:**
- Already has tracking number
**Expected:** `400 Bad Request`

#### 3. Validation Testing

**Manual Trigger:**
```rest
POST http://localhost:5000/api/ecommerce/seller/orders/1/validate-shipping
Authorization: Bearer {{sellerToken}}
```

**Check Status:**
```rest
GET http://localhost:5000/api/ecommerce/seller/orders/1/shipping-status
Authorization: Bearer {{sellerToken}}
```

#### 4. Carrier Filter Test

```rest
POST http://localhost:5000/api/ecommerce/buyer/shipping-cost/calculate
Authorization: Bearer {{buyerToken}}

{
  "shipping_address_id": 1,
  "products": [{ "product_id": 1, "quantity": 2 }]
}
```

**Verify:** Response does NOT contain `ide`, `sentral`, or `rex`

---

## Troubleshooting

### Issue: Validation not running

**Solution:**
1. Check server logs for scheduler startup message
2. Verify `SHIPPING_COST_API_KEY` and `BASE_URL_RAJA_ONGKIR` in `.env`
3. Ensure `shipped_at` is at least 3 hours old

### Issue: RajaOngkir API timeout

**Symptoms:** Orders stuck in `pending_validation` with error message

**Solution:**
1. Check API key validity
2. Verify network connectivity
3. Increase timeout in `rajaOngkirService.js` (default: 10s)

### Issue: Tracking number not found

**Symptoms:** Validation returns `invalid` status

**Possible Causes:**
1. Incorrect tracking number
2. Courier hasn't updated tracking yet
3. Tracking number not in RajaOngkir system

**Solution:**
- Wait 24 hours for courier to update
- Manually verify tracking number
- Contact courier for confirmation

### Issue: Carriers still showing in buyer shipping cost

**Solution:**
1. Verify filter logic in `shippingCostController.js`
2. Check API response structure from delivery service
3. Ensure `courier_code` field is lowercase

---

## Environment Variables

```env
# Required for RajaOngkir API
SHIPPING_COST_API_KEY=your-rajaongkir-api-key
BASE_URL_RAJA_ONGKIR=https://api.rajaongkir.com

# Database (must be set)
ECOMMERCE_DATABASE_URL=mysql://user:password@localhost:3306/ecommerce_db
```

---

## Activity Logs

All shipping operations are logged:

1. **SHIPPING_VALIDATION** - Automatic validation result
2. **SHIPPING_VALIDATION_MANUAL** - Manual validation trigger
3. **ORDER_SHIPPED** - Seller inputs shipping info

Query logs:
```sql
SELECT * FROM activity_logs 
WHERE action LIKE '%SHIPPING%' 
ORDER BY created_at DESC;
```

---

## Notifications

### Buyer Notification

When seller inputs shipping info:
```json
{
  "user_id": "<buyer_id>",
  "message": "Your order <order_number> has been shipped via <courier>",
  "type": "order_shipped",
  "related_order_id": "<order_id>"
}
```

---

## API Response Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Shipping info saved |
| 400 | Bad Request | Invalid courier code |
| 403 | Forbidden | Not a seller |
| 404 | Not Found | Order not found |
| 500 | Server Error | Database error |

---

## Future Enhancements

1. **Re-validation:** Allow re-validation for invalid tracking
2. **Webhooks:** Real-time updates from courier
3. **SMS Notifications:** Alert sellers about invalid tracking
4. **Analytics Dashboard:** Track validation success rates
5. **Multi-Package Support:** Handle orders with multiple shipments

---

## Support

For issues or questions:
1. Check server logs: `console.log` output
2. Review activity logs in database
3. Test with manual validation endpoint
4. Verify RajaOngkir API connectivity

---

## Version History

- **v1.0.0** (2024-01-15)
  - Initial implementation
  - Background validation every 10 minutes
  - Carrier filtering for buyer shipping cost
  - Manual validation endpoint for testing
