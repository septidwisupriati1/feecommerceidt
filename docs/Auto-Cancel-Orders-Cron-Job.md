# Auto-Cancel Orders - Cron Job

## Overview
Automated system that cancels unpaid orders after 24 hours and releases stock back to inventory.

## Quick Info

| Property | Value |
|----------|-------|
| **Purpose** | Cancel orders stuck in "pending" status |
| **Schedule** | Every hour (00:00, 01:00, 02:00, etc.) |
| **Trigger** | Order > 24 hours in "pending" status |
| **Action** | Status: `pending` → `cancelled` + Release stock |

## How It Works

```
Every Hour
  ↓
Find: Orders with status="pending" AND created_at < 24 hours ago
  ↓
For each order:
  1. Release stock (increment by ordered quantity)
  2. Update order status to "cancelled"
  3. Set cancel_reason & cancelled_at
  ↓
Log results
```

## Implementation

**Service:** `modules/ecommerce/services/autoCancelOrderService.js`

**Functions:**
- `autoCancelExpiredOrders()` - Core cancellation logic
- `scheduleAutoCancelOrders()` - Cron scheduler

**Integration:** Added to `index.js` on server startup

```javascript
import { scheduleAutoCancelOrders } from "./modules/ecommerce/services/autoCancelOrderService.js";

// In server startup
scheduleAutoCancelOrders();
```

## Stock Management

**Order Creation:**
```
Product Stock: 50 units
Buyer orders: 3 units
Result: 50 - 3 = 47 units (stock locked)
```

**Auto-Cancel After 24h:**
```
Product Stock: 47 units
Auto-cancel releases: 3 units
Result: 47 + 3 = 50 units (stock available again)
```

## Console Output

**Server Start:**
```
🔄 Auto-cancel orders scheduled to run every hour
```

**Hourly Execution:**
```
🕐 Running scheduled auto-cancel for expired orders
🔍 Checking for expired pending orders...
📦 Found 2 expired pending order(s), processing...
  ✓ Cancelled order ORD-20251115-00001
  ✓ Cancelled order ORD-20251115-00002
✅ Auto-cancel completed: 2 order(s) cancelled
```

**No Expired Orders:**
```
🔍 Checking for expired pending orders...
✅ No expired pending orders found
```

## Manual Testing

Run test script:
```bash
node modules/ecommerce/tests/testjs/test-auto-cancel-orders.js
```

## Order Details

**Cancel Reason:**
```
"Otomatis dibatalkan: Tidak ada pembayaran dalam 24 jam"
```

**Fields Updated:**
- `order_status`: `"pending"` → `"cancelled"`
- `cancelled_at`: Set to current timestamp
- `cancel_reason`: Auto-generated message
- `updated_at`: Set to current timestamp

## Database Query

Find auto-cancelled orders:
```sql
SELECT 
  order_id,
  order_number,
  total_amount,
  cancelled_at,
  cancel_reason
FROM orders
WHERE 
  order_status = 'cancelled'
  AND cancel_reason LIKE '%Otomatis dibatalkan%'
ORDER BY cancelled_at DESC;
```

## Configuration

**Change Schedule (in service file):**
```javascript
// Every hour (current)
cron.schedule("0 * * * *", ...);

// Every 30 minutes
cron.schedule("*/30 * * * *", ...);

// Daily at 2:00 AM
cron.schedule("0 2 * * *", ...);
```

**Change Expiry Duration:**
```javascript
// 24 hours (current)
const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

// 12 hours
const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
```

## Benefits

✅ **Inventory Management** - Prevents indefinite stock locking  
✅ **User Experience** - Stock becomes available for other buyers  
✅ **System Efficiency** - Automatic cleanup, no manual work  
✅ **Data Integrity** - Transaction-based, safe operations  

---

## 📱 Frontend Implementation

### ✅ Admin Auto-Cancel Configuration Page

**Location**: `src/pages/admin/AutoCancelConfigPage.jsx`

**Route**: `/admin/auto-cancel-config` (Protected Route - Admin only)

**API Service**: `src/services/adminAutoCancelAPI.js`

**Navigation**: Admin Dashboard → Auto-Cancel Config atau langsung ke `/admin/auto-cancel-config`

**Features Implemented**:

#### 1. **Real-time Statistics Dashboard** ✅
- Total auto-cancelled orders (all time)
- Today's auto-cancelled orders  
- This week's auto-cancelled orders
- Total stock released back to inventory
- Total amount of cancelled orders (Rupiah format)

#### 2. **Cron Job Configuration Panel** ✅
**Display:**
- Schedule description (human-readable)
- Cron expression: `"0 * * * *"`
- Expiry duration: 24 hours
- Status: Active/Inactive badge
- Next run time
- Last run time

**Actions:**
- Edit Configuration (opens modal)
- Trigger Manual Run (execute now button)

#### 3. **Configuration Editor** ✅
```jsx
{
  expiry_duration_hours: 24,    // 1-72 hours
  schedule: "0 * * * *",         // Cron expression  
  is_enabled: true               // Toggle on/off
}

// Schedule Presets:
- Every hour: "0 * * * *"
- Every 30 minutes: "*/30 * * * *"
- Every 2 hours: "0 */2 * * *"
- Daily at 00:00: "0 0 * * *"
- Daily at 02:00: "0 2 * * *"
```

#### 4. **Auto-Cancelled Orders Table** ✅
**Columns:**
- Order Number
- Buyer (name + email)
- Total Amount (Rupiah)
- Total Items
- Created At
- Cancelled At
- Reason badge

**Features:**
- Pagination (20 items/page)
- Date range filter (from/to)
- Real-time data refresh
- Empty state handling

#### 5. **API Integration**

```javascript
// src/services/adminAutoCancelAPI.js
const API_URL = 'http://localhost:5000/api/ecommerce/admin/auto-cancel';

// Get orders
GET /api/ecommerce/admin/auto-cancel/orders?page=1&limit=20&date_from=&date_to=

// Get statistics  
GET /api/ecommerce/admin/auto-cancel/statistics

// Get/Update config
GET /api/ecommerce/admin/auto-cancel/config
PUT /api/ecommerce/admin/auto-cancel/config

// Manual trigger
POST /api/ecommerce/admin/auto-cancel/trigger
```

#### 6. **Usage Example**

```jsx
// Component initialization
useEffect(() => {
  fetchOrders();
  fetchStatistics();
  fetchConfig();
}, []);

// Trigger manual run
const handleTriggerManual = async () => {
  const result = await triggerManualRun();
  alert(`✅ ${result.data.cancelled_count} orders cancelled`);
  fetchAll(); // Refresh all data
};

// Update configuration
const handleUpdateConfig = async (config) => {
  await updateCronConfiguration(config);
  fetchConfig(); // Refresh config
};
```

#### 7. **UI Components** ✅
- Statistics cards (5 cards, color-coded)
- Configuration panel (editable)
- Modal form for config editing
- Orders data table
- Pagination controls
- Date range filters
- Loading states
- Empty states

#### 8. **Fallback Mode** ✅
Works offline with dummy data for development without backend

---

## Error Handling

- Uses database transactions
- Individual order failures don't stop processing
- All errors are logged
- Stock and order status remain consistent

## Related Features

- **Manual Cancel:** `PUT /api/ecommerce/buyer/orders/:orderId/cancel`
- **Order Creation:** `POST /api/ecommerce/buyer/orders/checkout`
- **Order Status Flow:** `pending → paid → processing → shipped → delivered → completed`

---

**File:** `modules/ecommerce/services/autoCancelOrderService.js`  
**Test:** `modules/ecommerce/tests/testjs/test-auto-cancel-orders.js`  
**Full Docs:** `Panduan API/Auto-Cancel-Orders-README.md`
