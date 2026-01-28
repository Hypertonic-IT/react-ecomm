---
description: Master Implementation roadmap for the Hypertonic Enterprise Admin Panel (CMS).
---

# 👑 Hypertonic Enterprise Admin Panel (ERP/CMS)

This is the master plan for the comprehensive Admin Panel based on the User's detailed requirements.

## 1. Authentication & User Management
*Goal: Secure, Role-Based Access Control (RBAC).*
- [ ] **Backend**: Update `User` model to include `role` (Super Admin, Product Manager, Sales Manager, Marketing Manager).
- [ ] **Middleware**: Create `checkRole(['admin', 'editor'])` middleware.
- [ ] **Frontend**:
    - [ ] `AdminLogin.js`: Distinct login screen for staff.
    - [ ] `AdminProtect`: Route wrapper to check permissions.
    - [ ] **Staff Management Page**: Super Admin can add/invite new staff members and assign roles.

## 2. Dashboard Command Center
*Goal: Real-time business intelligence.*
- [ ] **Widgets**:
    - [ ] Total Sales (Daily/Weekly/Monthly) filters.
    - [ ] Active Users & New Registrations.
    - [ ] Inventory Alerts (Low Stock Warning).
- [ ] **Notifications Center**: Bell icon for Payment Failures, New Orders.
- [ ] **Quick Actions**: "Add Product" button, "View Pending Orders" shortcut.

## 3. Product Management (PIM)
*Goal: Advanced Catalog Control.*
- [ ] **Product List**: Datatable with filtering (Category, Stock Status, Price).
- [ ] **Add/Edit Product Form**:
    - [ ] Basic: Name, SKU, Price (Regular/Sale).
    - [ ] Media: Multi-image upload, Video URL.
    - [ ] Inventory: Stock qty, Low stock threshold, Warehouse location (optional).
    - [ ] SEO: Meta Title, Meta Description, Tags.
    - [ ] Variants: Size/Color attributes.
- [ ] **Bulk Tools**: CSV Import/Export.

## 4. Category & Catalog
- [ ] **Categories**: Create/Edit/Delete Categories and Sub-categories.
- [ ] **Attributes**: Manage global sizes (S, M, L) and colors logic.

## 5. Order Management System (OMS)
- [ ] **Order List**: Filter by Status (Pending, Processed, Shipped, Delivered, Returned).
- [ ] **Order Detail View**:
    - [ ] Customer Info & Shipping Address.
    - [ ] Line Items.
    - [ ] **Action Buttons**: "Generate Invoice", "Print Packing Slip", "Ship Order" (Enter tracking #).
- [ ] **Returns Module**: Handle refund requests and inventory restock.

## 6. Customer CRM
- [ ] **Customer List**: Searchable database of all users.
- [ ] **Customer Profile**: View LTV (Lifetime Value), Order History, and Contact Info.
- [ ] **Segmentation**: Tag users as "VIP", "Wholesale", etc.

## 7. Discounts & Marketing
- [ ] **Coupon Engine**: Create codes (`SAVE10`) with expiry and limits.
- [ ] **Banner Manager**: Control Homepage Sliders from Admin.

## 8. Financials & Reporting
- [ ] **Sales Reports**: Graphs for Revenue vs Time.
- [ ] **Exports**: Download Monthly Sales as CSV.

## 9. Settings
- [ ] **Store Config**: Logo, Store Name, Support Email.
- [ ] **Shipping Rules**: Free shipping threshold configuration.

---
## 🚀 Implementation Priority Guide

### Phase A: Security & Roles (Current Focus)
1. Update `User` Model with `role`.
2. Build `AdminLogin` page.

### Phase B: Core Operations (Product & Orders)
1. Build `ProductList` and `AddProduct` pages.
2. Build `OrderList` and `OrderDetail` pages.

### Phase C: Growth Tools (Marketing & CRM)
1. Coupon System.
2. Advanced Analytics.
