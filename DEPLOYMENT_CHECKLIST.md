# 🚀 Quick Deployment Checklist

Use this checklist alongside the full deployment guide: `.agent/workflows/cpanel-deployment.md`

## 📝 Before You Start

- [ ] cPanel login credentials ready
- [ ] Domain name configured
- [ ] MongoDB Atlas account created (or cPanel MongoDB access)
- [ ] Email credentials for nodemailer
- [ ] FTP client installed (FileZilla) or File Manager access ready

---

## 🔧 Backend Deployment

### Preparation
- [ ] Update `backend/package.json` - change start script to `node server.js`
- [ ] Create production `.env` file with real values
- [ ] Create `.htaccess` for Node.js app
- [ ] Create deployment zip: `zip -r backend-deploy.zip backend -x "backend/node_modules/*" "backend/.env" "backend/*.md" "backend/test_*.js" "backend/check*.js" "backend/seed*.js"`

### Upload
- [ ] Create `backend` folder in cPanel home directory
- [ ] Upload and extract `backend-deploy.zip`
- [ ] Delete zip file after extraction

### Configuration
- [ ] Setup Node.js App in cPanel
- [ ] Configure Node.js version (14+)
- [ ] Set Application root: `backend`
- [ ] Set Startup file: `server.js`
- [ ] Add all environment variables from `.env`
- [ ] Run: `source /home/username/nodevenv/backend/14/bin/activate`
- [ ] Run: `cd ~/backend && npm install --production`
- [ ] Restart application

### Subdomain (Optional but Recommended)
- [ ] Create subdomain: `api.yourdomain.com`
- [ ] Point to backend directory
- [ ] Update CORS settings in backend

---

## 🎨 Frontend Deployment

### Preparation
- [ ] Create `src/config.js` with API URL configuration
- [ ] Create `.env.production` with production values
- [ ] Update all API calls to use config
- [ ] Build production: `npm run build`
- [ ] Test build locally: `npx serve -s build`
- [ ] Create zip: `zip -r frontend-build.zip build/*`

### Upload
- [ ] Navigate to `public_html` in cPanel File Manager
- [ ] Delete default files
- [ ] Upload and extract `frontend-build.zip`
- [ ] Move files from `build` folder to `public_html` root
- [ ] Delete empty `build` folder and zip

### Configuration
- [ ] Create `.htaccess` for React Router in `public_html`
- [ ] Add compression and caching rules
- [ ] Test all routes work

---

## 🗄️ Database Setup

### MongoDB Atlas
- [ ] Create MongoDB Atlas account
- [ ] Create cluster (free tier)
- [ ] Create database: `hypertonic_ecommerce`
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0 or server IP)
- [ ] Copy connection string
- [ ] Update backend environment variables

### Seed Data
- [ ] Update local `.env` with Atlas connection
- [ ] Run: `node seed.js`
- [ ] Run: `node seedBlogs.js`
- [ ] Run: `node seedCoupons.js`
- [ ] Run: `node createSimpleAdmin.js`

---

## 🔐 Security & SSL

### SSL Certificate
- [ ] Install Let's Encrypt SSL via cPanel
- [ ] Go to SSL/TLS Status
- [ ] Run AutoSSL for your domain
- [ ] Add HTTPS redirect to `.htaccess`

### Security Settings
- [ ] Update CORS to only allow your domain
- [ ] Verify JWT_SECRET is strong
- [ ] Use app-specific passwords for email
- [ ] Never commit `.env` files

---

## 🧪 Testing

### Backend Testing
- [ ] Visit: `https://api.yourdomain.com/api/products`
- [ ] Test other API endpoints
- [ ] Check response format

### Frontend Testing
- [ ] Visit: `https://yourdomain.com`
- [ ] Test all page navigation
- [ ] Test user registration
- [ ] Test user login
- [ ] Test product browsing
- [ ] Test product details
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test admin panel login
- [ ] Test admin features

### Browser Testing
- [ ] Check browser console (F12) for errors
- [ ] Verify API calls work
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile devices

---

## 🔄 Maintenance

### Backups
- [ ] Enable MongoDB Atlas automated backups
- [ ] Setup cPanel backup schedule
- [ ] Download initial backup to local storage

### Monitoring
- [ ] Bookmark backend logs location
- [ ] Bookmark error logs location
- [ ] Set up uptime monitoring (optional)

---

## 📋 Important URLs

Write down your URLs here:

- **Frontend**: https://___________________
- **Backend API**: https://___________________
- **Admin Panel**: https://___________________/admin
- **cPanel**: https://___________________:2083
- **MongoDB Atlas**: https://cloud.mongodb.com

---

## 🆘 Quick Troubleshooting

**White screen?**
- Check browser console
- Verify build was successful
- Clear cache

**API not working?**
- Check backend is running in cPanel
- Verify environment variables
- Check CORS settings

**Routes giving 404?**
- Check `.htaccess` in public_html
- Verify React Router configuration

**Images not loading?**
- Check file permissions (755/644)
- Verify uploads folder exists
- Check image paths

---

## ✅ Final Checklist

- [ ] Website loads without errors
- [ ] All features work correctly
- [ ] SSL is installed and working
- [ ] Backups are configured
- [ ] Monitoring is set up
- [ ] Documentation is updated
- [ ] Admin credentials are saved securely

---

**🎉 Deployment Complete!**

For detailed instructions on any step, refer to: `.agent/workflows/cpanel-deployment.md`
