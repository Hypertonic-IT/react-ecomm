# 🧠 INVENTORY BACKEND – COMPLETE IMPLEMENTATION GUIDE

## 📋 Table of Contents
1. [Overview](#overview)
2. [Data Structure](#data-structure)
3. [Backend Flow](#backend-flow)
4. [API Endpoints](#api-endpoints)
5. [Integration Guide](#integration-guide)
6. [Testing](#testing)

---

## 🎯 Overview

### What is Inventory Backend?

The inventory backend system handles:
- ✅ Real-time stock tracking
- ✅ Overselling prevention
- ✅ Order-stock synchronization
- ✅ Returns & cancellations
- ✅ Cart reservations with expiry
- ✅ Complete audit trail

### Key Features

1. **Variant-Level Tracking** - Stock managed per color/size combination
2. **Stock Reservation** - Temporary hold when items added to cart
3. **Automatic Cleanup** - Expired reservations auto-released
4. **History Logging** - Every stock change tracked
5. **Low Stock Alerts** - Automatic notifications
6. **Atomic Operations** - No race conditions

---

## 📊 Data Structure

### 1. ProductInventory Model

```javascript
{
  productId: ObjectId,           // Reference to Product
  productName: String,
  category: String,
  basePrice: Number,
  
  variants: [{
    color: String,
    size: String,
    sku: String,                 // Unique: "TS-BLK-M"
    stock: Number,               // Total stock
    reserved: Number,            // Reserved in carts
    available: Number,           // stock - reserved
    lowStockThreshold: Number,
    price: Number,
    images: [String]
  }],
  
  trackInventory: Boolean,
  allowBackorder: Boolean,
  hideWhenOutOfStock: Boolean,
  
  lowStockAlert: {
    enabled: Boolean,
    threshold: Number,
    notified: Boolean
  },
  
  history: [{
    date: Date,
    action: String,              // ADDED, DEDUCTED, RESERVED, etc.
    quantity: Number,
    reason: String,
    adminId: String,
    adminName: String,
    orderId: ObjectId,
    previousStock: Number,
    newStock: Number,
    notes: String
  }],
  
  lastStockUpdate: Date,
  lastUpdatedBy: String
}
```

### 2. CartReservation Model

```javascript
{
  userId: String,
  sessionId: String,
  items: [{
    productId: ObjectId,
    variantId: ObjectId,
    sku: String,
    quantity: Number,
    reservedAt: Date
  }],
  expiresAt: Date,               // TTL index - auto delete
  status: String                 // ACTIVE, EXPIRED, CONVERTED, CANCELLED
}
```

---

## 🔄 Backend Flow

### Complete User Journey

```
1. User Opens Product Page
   ↓
2. Frontend calls: GET /api/inventory/check/:productId/variant/:variantId
   ↓
3. Backend checks: stock - reserved > 0
   ↓
4. Returns: { available: true/false, actualAvailable: number }
   ↓
5. User Selects Variant & Adds to Cart
   ↓
6. Frontend calls: POST /api/inventory/reserve
   ↓
7. Backend:
   - Checks availability
   - Increments variant.reserved
   - Creates CartReservation with 15min expiry
   - Returns: { success: true, expiresIn: 15 }
   ↓
8a. User Completes Payment (Success)
    ↓
    POST /api/inventory/deduct
    ↓
    Backend:
    - Decrements variant.stock
    - Decrements variant.reserved
    - Marks reservation as CONVERTED
    - Logs history: ORDER_PLACED
    ↓
    Order Confirmed ✅

8b. User Abandons Cart / Payment Fails
    ↓
    POST /api/inventory/release (or auto-expires)
    ↓
    Backend:
    - Decrements variant.reserved
    - Marks reservation as EXPIRED
    - Logs history: CART_EXPIRED
    ↓
    Stock Released ✅

9. User Cancels Order
   ↓
   POST /api/inventory/restore
   ↓
   Backend:
   - Increments variant.stock
   - Logs history: ORDER_CANCELLED
   ↓
   Stock Restored ✅
```

---

## 🔌 API Endpoints

### Admin Endpoints

#### 1. Get All Inventory
```http
GET /api/inventory?category=Men&stockStatus=Low Stock&search=shirt
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 25
}
```

#### 2. Get Product Inventory
```http
GET /api/inventory/product/:productId
```

#### 3. Update Stock (Manual)
```http
PUT /api/inventory/product/:productId/variant/:variantId
Content-Type: application/json

{
  "quantity": 50,
  "reason": "NEW_SHIPMENT",
  "notes": "Received from supplier XYZ"
}
```

#### 4. Get Inventory History
```http
GET /api/inventory/product/:productId/history?limit=50
```

#### 5. Get Low Stock Alerts
```http
GET /api/inventory/alerts/low-stock
```

#### 6. Get Out of Stock Products
```http
GET /api/inventory/alerts/out-of-stock
```

---

### User/Customer Endpoints

#### 1. Check Variant Availability
```http
GET /api/inventory/check/:productId/variant/:variantId?quantity=2
```

**Response:**
```json
{
  "success": true,
  "available": true,
  "stock": 50,
  "reserved": 5,
  "actualAvailable": 45,
  "quantity": 2,
  "canAddToCart": true,
  "message": "In stock"
}
```

#### 2. Reserve Stock (Add to Cart)
```http
POST /api/inventory/reserve
Content-Type: application/json

{
  "userId": "user123",
  "sessionId": "session456",
  "items": [
    {
      "productId": "prod001",
      "variantId": "var001",
      "sku": "TS-BLK-M",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stock reserved successfully",
  "reservation": {...},
  "expiresIn": 15
}
```

#### 3. Release Reserved Stock
```http
POST /api/inventory/release
Content-Type: application/json

{
  "userId": "user123",
  "sessionId": "session456"
}
```

---

### Order Processing Endpoints

#### 1. Deduct Stock (Payment Success)
```http
POST /api/inventory/deduct
Content-Type: application/json

{
  "orderId": "order789",
  "userId": "user123",
  "sessionId": "session456",
  "items": [
    {
      "productId": "prod001",
      "variantId": "var001",
      "sku": "TS-BLK-M",
      "quantity": 2
    }
  ]
}
```

#### 2. Restore Stock (Cancellation/Return)
```http
POST /api/inventory/restore
Content-Type: application/json

{
  "orderId": "order789",
  "items": [
    {
      "productId": "prod001",
      "variantId": "var001",
      "sku": "TS-BLK-M",
      "quantity": 2
    }
  ],
  "reason": "ORDER_CANCELLED"
}
```

---

## 🔗 Integration Guide

### Step 1: Register Routes in server.js

```javascript
const inventoryRoutes = require('./routes/inventoryRoutes');

app.use('/api/inventory', inventoryRoutes);
```

### Step 2: Setup Cleanup Cron Job

```javascript
const cron = require('node-cron');
const { cleanupExpiredReservations } = require('./controllers/InventoryController');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running reservation cleanup...');
  await cleanupExpiredReservations();
});
```

### Step 3: Frontend Integration

#### Product Page
```javascript
// Check availability when variant selected
const checkAvailability = async (productId, variantId, quantity = 1) => {
  const response = await fetch(
    `/api/inventory/check/${productId}/variant/${variantId}?quantity=${quantity}`
  );
  const data = await response.json();
  
  if (data.available) {
    // Enable "Add to Cart" button
  } else {
    // Show "Out of Stock"
  }
};
```

#### Add to Cart
```javascript
const addToCart = async (item) => {
  // Reserve stock
  const response = await fetch('/api/inventory/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.id,
      sessionId: sessionStorage.getItem('sessionId'),
      items: [item]
    })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Show countdown timer: "Reserved for 15 minutes"
    startReservationTimer(data.expiresIn);
  }
};
```

#### Checkout Success
```javascript
const onPaymentSuccess = async (orderId, cartItems) => {
  // Deduct stock
  await fetch('/api/inventory/deduct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId,
      userId: currentUser.id,
      sessionId: sessionStorage.getItem('sessionId'),
      items: cartItems
    })
  });
};
```

#### Cart Abandoned
```javascript
const onCartAbandoned = async () => {
  // Release reserved stock
  await fetch('/api/inventory/release', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: currentUser.id,
      sessionId: sessionStorage.getItem('sessionId')
    })
  });
};
```

---

## 🧪 Testing

### Test Scenarios

#### 1. Basic Stock Check
```bash
curl http://localhost:5001/api/inventory/check/PRODUCT_ID/variant/VARIANT_ID?quantity=1
```

#### 2. Reserve Stock
```bash
curl -X POST http://localhost:5001/api/inventory/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "sessionId": "test-session",
    "items": [{
      "productId": "PRODUCT_ID",
      "variantId": "VARIANT_ID",
      "sku": "TEST-SKU",
      "quantity": 2
    }]
  }'
```

#### 3. Test Overselling Prevention
```javascript
// Scenario: 5 items in stock, 2 users try to buy 3 each

// User 1 reserves 3 items
POST /api/inventory/reserve { quantity: 3 }
// Success: stock=5, reserved=3, available=2

// User 2 tries to reserve 3 items
POST /api/inventory/reserve { quantity: 3 }
// Error: "Only 2 units available"
```

#### 4. Test Expiry
```javascript
// Reserve stock
POST /api/inventory/reserve

// Wait 15+ minutes

// Run cleanup
await cleanupExpiredReservations();

// Check stock - should be released
GET /api/inventory/check/:productId/variant/:variantId
// available should be back to original
```

---

## ⚙️ Configuration

### Inventory Settings

```javascript
const INVENTORY_SETTINGS = {
  RESERVATION_TIME_MINUTES: 15,      // Cart reservation duration
  LOW_STOCK_THRESHOLD: 10,           // When to show low stock alert
  ENABLE_CART_RESERVATION: true,     // Enable/disable reservations
  AUTO_HIDE_OUT_OF_STOCK: false      // Hide out-of-stock products
};
```

---

## 🔒 Security & Best Practices

### 1. Atomic Operations
All stock updates use MongoDB atomic operations to prevent race conditions.

### 2. Transaction Support
For critical operations, wrap in transactions:
```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await inventory.deductStock(...);
  await order.create(...);
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
}
```

### 3. Validation
- Always validate quantity > 0
- Check stock before any operation
- Verify variant exists

### 4. Error Handling
- Graceful degradation if reservation fails
- Fallback to checkout-time stock check
- Proper error messages to users

---

## 📈 Monitoring & Alerts

### Key Metrics to Track
1. **Low Stock Products** - Daily count
2. **Out of Stock Products** - Real-time alerts
3. **Reservation Expiry Rate** - Cart abandonment
4. **Stock Depletion Rate** - Sales velocity
5. **Failed Reservations** - Overselling attempts

### Recommended Alerts
- Email admin when product < 5 units
- Slack notification for out-of-stock
- Daily inventory report
- Weekly stock movement analysis

---

## 🚀 Future Enhancements

### Phase 2
- [ ] Multi-warehouse support
- [ ] Automatic reorder points
- [ ] Supplier integration
- [ ] Barcode/QR scanning
- [ ] Batch operations
- [ ] Advanced analytics

### Phase 3
- [ ] Predictive stock forecasting
- [ ] Seasonal trend analysis
- [ ] Integration with POS systems
- [ ] Mobile inventory app
- [ ] Real-time dashboard

---

## 📞 Support

For issues or questions:
- Backend Team: backend@hypertonic-it.com
- Documentation: /docs/inventory-backend
- Slack: #inventory-system

---

**Built with ❤️ by Hypertonic IT Solutions**
**Version: 1.0.0**
**Last Updated: 2024-01-28**
