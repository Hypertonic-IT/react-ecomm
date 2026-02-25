# 🏗️ Deployment Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR DOMAIN                              │
│                    https://yourdomain.com                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   cPanel Server  │
                    └─────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
    ┌───────────────────┐       ┌───────────────────┐
    │   Frontend (React) │       │  Backend (Node.js) │
    │   ~/public_html    │       │    ~/backend       │
    └───────────────────┘       └───────────────────┘
                │                           │
                │                           │
                ▼                           ▼
         Static Files              API Endpoints
         - HTML/CSS/JS              - /api/products
         - Images                   - /api/auth
         - Fonts                    - /api/orders
                                    - etc.
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │  MongoDB Atlas   │
                                  │  (Cloud Database)│
                                  └─────────────────┘
```

---

## File Structure on cPanel

```
/home/yourusername/
│
├── public_html/                    # Frontend (React Build)
│   ├── index.html                  # Main HTML file
│   ├── .htaccess                   # React Router config + SSL
│   ├── static/
│   │   ├── css/                    # Compiled CSS
│   │   ├── js/                     # Compiled JavaScript
│   │   └── media/                  # Images, fonts, etc.
│   ├── favicon.ico
│   └── manifest.json
│
├── backend/                        # Backend (Node.js)
│   ├── server.js                   # Entry point
│   ├── .htaccess                   # Node.js Passenger config
│   ├── package.json
│   ├── node_modules/               # Dependencies (installed on server)
│   ├── src/
│   │   ├── config/                 # Configuration files
│   │   ├── controllers/            # Route controllers
│   │   ├── models/                 # MongoDB models
│   │   ├── routes/                 # API routes
│   │   ├── middleware/             # Custom middleware
│   │   └── utils/                  # Helper functions
│   └── uploads/                    # User uploaded files
│
└── logs/                           # Application logs
    └── passenger.log               # Node.js app logs
```

---

## Request Flow

### Frontend Request (User visits website)

```
User Browser
    │
    ▼
https://yourdomain.com
    │
    ▼
cPanel Server (Apache/LiteSpeed)
    │
    ▼
public_html/index.html
    │
    ▼
React App Loads
    │
    ▼
React Router handles navigation
```

### API Request (Frontend calls backend)

```
React App
    │
    ▼
axios.get('https://api.yourdomain.com/api/products')
    │
    ▼
cPanel Server
    │
    ▼
Passenger (Node.js handler)
    │
    ▼
backend/server.js
    │
    ▼
Express Routes
    │
    ▼
Controllers
    │
    ▼
MongoDB Atlas (Cloud)
    │
    ▼
Response ← ← ← ← ← ←
    │
    ▼
React App receives data
    │
    ▼
UI Updates
```

---

## Domain Configuration

### Option 1: Subdomain for API (Recommended)

```
Main Domain:
https://yourdomain.com → ~/public_html (Frontend)

Subdomain:
https://api.yourdomain.com → ~/backend (Backend API)
```

**Advantages:**
- Clean separation
- Better organization
- Easier SSL management
- Professional structure

### Option 2: Same Domain with Path

```
Frontend:
https://yourdomain.com → ~/public_html

Backend:
https://yourdomain.com/api → ~/backend
```

**Note:** Requires additional .htaccess configuration

---

## Environment Variables Flow

### Development (Local)

```
Frontend:
.env.local
├── REACT_APP_API_URL=http://localhost:3001

Backend:
.env
├── MONGODB_URI=mongodb://localhost:27017/ecommerce
├── FRONTEND_URL=http://localhost:3000
└── NODE_ENV=development
```

### Production (cPanel)

```
Frontend:
.env.production
├── REACT_APP_API_URL=https://api.yourdomain.com

Backend:
Environment Variables (set in cPanel)
├── MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
├── FRONTEND_URL=https://yourdomain.com
└── NODE_ENV=production
```

---

## SSL/HTTPS Flow

```
User Request (HTTP)
    │
    ▼
http://yourdomain.com
    │
    ▼
.htaccess Redirect Rule
    │
    ▼
https://yourdomain.com (HTTPS)
    │
    ▼
SSL Certificate (Let's Encrypt)
    │
    ▼
Encrypted Connection
    │
    ▼
Secure Content Delivery
```

---

## Database Connection

```
Backend (cPanel Server)
    │
    ▼
MongoDB Driver
    │
    ▼
Internet
    │
    ▼
MongoDB Atlas Cluster
    │
    ├── Replica Set 1 (Primary)
    ├── Replica Set 2 (Secondary)
    └── Replica Set 3 (Secondary)
    │
    ▼
Database: hypertonic_ecommerce
    │
    ├── Collection: users
    ├── Collection: products
    ├── Collection: orders
    ├── Collection: categories
    ├── Collection: blogs
    └── Collection: coupons
```

---

## Deployment Workflow

```
Local Development
    │
    ├── Make changes
    ├── Test locally
    └── Commit to Git (optional)
    │
    ▼
Build Process
    │
    ├── Frontend: npm run build
    └── Backend: Update package.json
    │
    ▼
Create Packages
    │
    ├── backend-deploy.zip
    └── frontend-deploy.zip
    │
    ▼
Upload to cPanel
    │
    ├── Backend → ~/backend
    └── Frontend → ~/public_html
    │
    ▼
Configure on Server
    │
    ├── Set environment variables
    ├── Install dependencies
    └── Restart applications
    │
    ▼
Test & Verify
    │
    ├── Test API endpoints
    ├── Test frontend pages
    └── Check logs
    │
    ▼
🎉 Live!
```

---

## Security Layers

```
┌─────────────────────────────────────────┐
│         SSL/TLS Encryption              │  ← HTTPS
├─────────────────────────────────────────┤
│         Helmet.js Headers               │  ← Security headers
├─────────────────────────────────────────┤
│         CORS Protection                 │  ← Origin validation
├─────────────────────────────────────────┤
│         Rate Limiting                   │  ← DDoS protection
├─────────────────────────────────────────┤
│         JWT Authentication              │  ← User auth
├─────────────────────────────────────────┤
│         Input Sanitization              │  ← XSS/Injection prevention
├─────────────────────────────────────────┤
│         MongoDB Sanitization            │  ← NoSQL injection prevention
└─────────────────────────────────────────┘
```

---

## Monitoring & Logs

```
Application Logs
    │
    ├── Backend Logs
    │   ├── ~/logs/passenger.log
    │   └── cPanel → Metrics → Errors
    │
    ├── Frontend Logs
    │   └── Browser Console (F12)
    │
    └── Database Logs
        └── MongoDB Atlas Dashboard
```

---

## Backup Strategy

```
Regular Backups
    │
    ├── Database (MongoDB Atlas)
    │   ├── Automated daily backups
    │   └── Point-in-time recovery
    │
    ├── Files (cPanel)
    │   ├── Weekly full backups
    │   └── Download to local storage
    │
    └── Code (Git Repository)
        └── Version control
```

---

## Performance Optimization

```
Frontend
    │
    ├── Minified JS/CSS
    ├── Compressed images
    ├── Browser caching (.htaccess)
    ├── Gzip compression
    └── CDN (optional)

Backend
    │
    ├── Database indexing
    ├── Query optimization
    ├── Response caching
    ├── Connection pooling
    └── Rate limiting

Database
    │
    ├── Proper indexing
    ├── Query optimization
    └── Replica sets (Atlas)
```

---

This architecture provides a scalable, secure, and maintainable deployment structure for your e-commerce application.
