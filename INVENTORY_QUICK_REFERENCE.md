# 🚀 INVENTORY SYSTEM - QUICK REFERENCE

## 📍 Access Points

### Admin Panel
```
URL: http://localhost:3000/admin/inventory
Features: View, Edit, History, Bulk Upload, Alerts
```

### API Base
```
URL: http://localhost:5001/api/inventory
```

---

## 🔥 Most Used APIs

### 1. Check Stock (User Side)
```bash
GET /api/inventory/check/:productId/variant/:variantId?quantity=1

Response:
{
  "available": true,
  "actualAvailable": 45,
  "canAddToCart": true
}
```

### 2. Reserve Stock (Add to Cart)
```bash
POST /api/inventory/reserve
Body: {
  "userId": "user123",
  "sessionId": "session456",
  "items": [{ "productId": "...", "variantId": "...", "sku": "TS-BLK-M", "quantity": 2 }]
}
```

### 3. Deduct Stock (Payment Success)
```bash
POST /api/inventory/deduct
Body: {
  "orderId": "order789",
  "items": [...]
}
```

### 4. Update Stock (Admin)
```bash
PUT /api/inventory/product/:productId/variant/:variantId
Body: {
  "quantity": 50,
  "reason": "NEW_SHIPMENT"
}
```

---

## 🎨 UI Components

### Stock Indicators
```
🟢 Green  = In Stock (>10 units)
🟠 Orange = Low Stock (1-10 units)
🔴 Red    = Out of Stock (0 units)
```

### Status Badges
```css
.status-badge.status-success  /* Green */
.status-badge.status-warning  /* Orange */
.status-badge.status-danger   /* Red */
.status-badge.status-primary  /* Blue */
.status-badge.status-neutral  /* Gray */
```

### Stock Indicator Dots
```css
.stock-indicator.stock-in   /* Green dot */
.stock-indicator.stock-low  /* Orange dot */
.stock-indicator.stock-out  /* Red dot */
```

---

## ⚡ Quick Commands

### Install Dependencies
```bash
cd backend
npm install node-cron
```

### Start Server (with Cron)
```bash
cd backend
npm start
# Cron job auto-starts (cleanup every 5 min)
```

### Test Endpoints
```bash
# Check availability
curl http://localhost:5001/api/inventory/check/PRODUCT_ID/variant/VARIANT_ID

# Get all inventory
curl http://localhost:5001/api/inventory

# Get low stock alerts
curl http://localhost:5001/api/inventory/alerts/low-stock
```

---

## 🔄 Stock Flow States

```
Available Stock = Total Stock - Reserved Stock

States:
├─ AVAILABLE     → Can be added to cart
├─ RESERVED      → In someone's cart (15 min hold)
├─ DEDUCTED      → Order confirmed
└─ RESTORED      → Order cancelled/returned
```

---

## 📊 History Actions

```
ADDED      → New shipment / Manual add
DEDUCTED   → Order placed
RESERVED   → Added to cart
RELEASED   → Cart expired / abandoned
RETURNED   → Order cancelled / returned
ADJUSTED   → Manual correction
```

---

## ⏰ Timers & Schedules

```
Cart Reservation: 15 minutes
Cleanup Cron Job: Every 5 minutes
Low Stock Check: Real-time
```

---

## 🎯 Common Scenarios

### Scenario 1: User Buys Product
```
1. Check availability ✅
2. Reserve stock (15 min) ⏰
3. User pays → Deduct stock ✅
4. Reservation marked CONVERTED
```

### Scenario 2: Cart Abandoned
```
1. Reserve stock (15 min) ⏰
2. User leaves → Auto-expires
3. Cron job releases stock ✅
4. Reservation marked EXPIRED
```

### Scenario 3: Order Cancelled
```
1. Order placed (stock deducted) ❌
2. User cancels
3. Restore stock ✅
4. History logged: ORDER_CANCELLED
```

### Scenario 4: Admin Updates Stock
```
1. Admin opens inventory page
2. Clicks edit on product
3. Enters new quantity + reason
4. Stock updated ✅
5. History logged with admin name
```

---

## 🐛 Troubleshooting

### Issue: Stock not updating
```
✓ Check if inventory route is registered
✓ Verify ProductInventory model exists
✓ Check MongoDB connection
✓ Look at server logs
```

### Issue: Reservation not expiring
```
✓ Verify cron job is running
✓ Check server.js has cron setup
✓ Ensure node-cron is installed
✓ Check TTL index on CartReservation
```

### Issue: Overselling happening
```
✓ Enable cart reservation
✓ Check atomic operations
✓ Verify stock checks before deduct
✓ Test concurrent requests
```

---

## 📱 Frontend Integration

### Product Page
```javascript
// Check if variant available
const checkStock = async (variantId) => {
  const res = await fetch(`/api/inventory/check/${productId}/variant/${variantId}`);
  const data = await res.json();
  setIsAvailable(data.available);
};
```

### Cart Page
```javascript
// Reserve stock on add to cart
const addToCart = async (item) => {
  await fetch('/api/inventory/reserve', {
    method: 'POST',
    body: JSON.stringify({
      userId: user.id,
      sessionId: getSessionId(),
      items: [item]
    })
  });
};
```

### Checkout Success
```javascript
// Deduct stock after payment
const onPaymentSuccess = async (orderId) => {
  await fetch('/api/inventory/deduct', {
    method: 'POST',
    body: JSON.stringify({
      orderId,
      items: cartItems
    })
  });
};
```

---

## 🔐 Security Notes

- ✅ All stock updates are atomic
- ✅ Validation on all inputs
- ✅ Admin attribution logged
- ✅ No direct stock manipulation
- ✅ Confirmation for large changes

---

## 📈 Monitoring

### Key Metrics
```
- Total Products
- In Stock Count
- Low Stock Count
- Out of Stock Count
- Active Reservations
- Expired Reservations (daily)
```

### Alerts
```
- Low stock < 10 units
- Out of stock products
- Failed reservations
- Large stock changes
```

---

## 🎓 Best Practices

1. **Always check availability** before showing "Add to Cart"
2. **Reserve stock** when adding to cart
3. **Show timer** for reservation expiry
4. **Deduct on payment**, not on order creation
5. **Restore on cancellation** immediately
6. **Log all changes** with reason
7. **Monitor low stock** daily
8. **Run cleanup** regularly

---

## 📞 Quick Help

**Backend Issues**: Check `/backend/INVENTORY_BACKEND_GUIDE.md`
**Frontend Issues**: Check `/src/modules/admin/pages/Inventory/README.md`
**Full Summary**: Check `/INVENTORY_SYSTEM_SUMMARY.md`

---

**🎉 You're all set! Happy coding!**
