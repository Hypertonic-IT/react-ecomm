---
description: Complete guide to deploy React frontend and Node.js backend to cPanel
---

# 🚀 Complete cPanel Deployment Guide for React E-commerce Website

This guide covers deploying both your **React frontend** and **Node.js backend** to cPanel hosting.

---

## 📋 Pre-Deployment Checklist

### What You'll Need:
- ✅ cPanel hosting account with SSH access
- ✅ Domain name pointed to your cPanel server
- ✅ Node.js support on cPanel (version 14+ recommended)
- ✅ MongoDB database (MongoDB Atlas recommended for cloud hosting)
- ✅ Email credentials for nodemailer
- ✅ FTP/SFTP client (FileZilla) or cPanel File Manager access

---

## 🎯 PART 1: Backend Deployment (Node.js + Express)

### Step 1: Prepare Backend for Production

**1.1 Update backend package.json**

Edit `/Users/krishanvarshney/react-ecomm/backend/package.json`:
- Change the start script from `nodemon server.js` to `node server.js`
- Add production script

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

**1.2 Create/Update .env file for production**

Create a production `.env` file with your actual production values:

```env
# Database
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=hypertonic_ecommerce

# Server
PORT=3001
NODE_ENV=production

# JWT
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Frontend URL (your actual domain)
FRONTEND_URL=https://yourdomain.com

# CORS Origin
CORS_ORIGIN=https://yourdomain.com
```

**1.3 Create .htaccess for Node.js app**

Create `/Users/krishanvarshney/react-ecomm/backend/.htaccess`:

```apache
PassengerEnabled On
PassengerAppType node
PassengerStartupFile server.js
PassengerAppRoot /home/yourusername/backend
PassengerNodejs /home/yourusername/nodevenv/backend/14/bin/node
```

### Step 2: Build and Prepare Backend Files

**2.1 Install production dependencies locally**

```bash
cd /Users/krishanvarshney/react-ecomm/backend
npm install --production
```

**2.2 Create a deployment package**

Create a zip file excluding development files:

```bash
cd /Users/krishanvarshney/react-ecomm
zip -r backend-deploy.zip backend -x "backend/node_modules/*" "backend/.env" "backend/*.md" "backend/test_*.js" "backend/check*.js" "backend/seed*.js" "backend/create*.js" "backend/fix*.js" "backend/reset*.js" "backend/update-*.js"
```

### Step 3: Upload Backend to cPanel

**3.1 Access cPanel File Manager**
- Log in to your cPanel account
- Open "File Manager"
- Navigate to your home directory (usually `/home/yourusername/`)

**3.2 Create backend directory**
- Create a new folder called `backend` in your home directory
- Upload `backend-deploy.zip` to this folder
- Extract the zip file
- Delete the zip file after extraction

**3.3 Alternative: Upload via FTP**
- Use FileZilla or any FTP client
- Connect to your cPanel via FTP
- Upload the entire backend folder (excluding node_modules)

### Step 4: Setup Node.js Application in cPanel

**4.1 Access Setup Node.js App**
- In cPanel, find "Setup Node.js App" (under Software section)
- Click "Create Application"

**4.2 Configure Node.js Application**
- **Node.js version**: Select 14.x or higher
- **Application mode**: Production
- **Application root**: `backend`
- **Application URL**: Choose a subdomain (e.g., `api.yourdomain.com`) or use main domain
- **Application startup file**: `server.js`
- **Passenger log file**: Leave default

**4.3 Set Environment Variables**
- In the Node.js app settings, add all your environment variables from `.env`
- Click "Add Variable" for each one:
  - MONGODB_URI
  - DB_NAME
  - PORT
  - NODE_ENV
  - JWT_SECRET
  - JWT_EXPIRE
  - EMAIL_HOST
  - EMAIL_PORT
  - EMAIL_USER
  - EMAIL_PASS
  - FRONTEND_URL
  - CORS_ORIGIN

**4.4 Install Dependencies**
- Copy the command shown in cPanel (looks like: `source /home/username/nodevenv/backend/14/bin/activate`)
- Open "Terminal" in cPanel
- Run the activation command
- Navigate to backend: `cd ~/backend`
- Install dependencies: `npm install --production`

**4.5 Start the Application**
- Go back to "Setup Node.js App"
- Click "Restart" button
- Your backend should now be running!

### Step 5: Setup Subdomain for API (Recommended)

**5.1 Create Subdomain**
- In cPanel, go to "Subdomains"
- Create subdomain: `api.yourdomain.com`
- Point it to the backend directory

**5.2 Update CORS Settings**
- Make sure your backend CORS settings allow your frontend domain

---

## 🎨 PART 2: Frontend Deployment (React)

### Step 6: Prepare Frontend for Production

**6.1 Update API URLs**

Find all API calls in your frontend and update the base URL. Create a config file:

Create `/Users/krishanvarshney/react-ecomm/src/config.js`:

```javascript
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'https://api.yourdomain.com',
  // Add other config variables
};

export default config;
```

**6.2 Create .env.production**

Create `/Users/krishanvarshney/react-ecomm/.env.production`:

```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

**6.3 Update all API calls**

Make sure all your API calls use the config:

```javascript
import config from './config';

// Instead of: axios.get('http://localhost:3001/api/products')
// Use: axios.get(`${config.API_URL}/api/products`)
```

### Step 7: Build React Application

**7.1 Build production bundle**

```bash
cd /Users/krishanvarshney/react-ecomm
npm run build
```

This creates a `build` folder with optimized production files.

**7.2 Test the build locally (optional)**

```bash
npx serve -s build
```

Visit `http://localhost:3000` to verify the build works.

### Step 8: Upload Frontend to cPanel

**8.1 Prepare build folder**

Create a zip of the build folder:

```bash
cd /Users/krishanvarshney/react-ecomm
zip -r frontend-build.zip build/*
```

**8.2 Upload to cPanel**

**Option A: Using File Manager**
- Log in to cPanel
- Go to File Manager
- Navigate to `public_html` (for main domain) or subdomain folder
- Delete default files (index.html, etc.)
- Upload `frontend-build.zip`
- Extract the zip file
- Move all files from `build` folder to `public_html` root
- Delete the empty `build` folder and zip file

**Option B: Using FTP**
- Connect via FTP to your cPanel
- Navigate to `public_html`
- Upload all files from your local `build` folder
- Make sure `index.html` is in the root of `public_html`

### Step 9: Configure React Router for cPanel

**9.1 Create .htaccess for React Router**

Create/edit `/Users/krishanvarshney/react-ecomm/build/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

Upload this `.htaccess` file to `public_html` after uploading your build files.

---

## 🗄️ PART 3: Database Setup

### Step 10: Setup MongoDB Database

**Option A: MongoDB Atlas (Recommended)**

**10.1 Create MongoDB Atlas Account**
- Go to https://www.mongodb.com/cloud/atlas
- Sign up for free tier
- Create a new cluster

**10.2 Configure Database**
- Create database: `hypertonic_ecommerce`
- Create database user with password
- Whitelist IP addresses (add `0.0.0.0/0` for all IPs or your server IP)

**10.3 Get Connection String**
- Click "Connect" → "Connect your application"
- Copy the connection string
- Replace `<password>` with your database password
- Update this in your backend environment variables

**10.4 Seed Initial Data**
- From your local machine, update `.env` with Atlas connection string
- Run seed scripts:

```bash
cd /Users/krishanvarshney/react-ecomm/backend
node seed.js
node seedBlogs.js
node seedCoupons.js
node createSimpleAdmin.js
```

**Option B: cPanel MongoDB (if available)**
- Check if your cPanel has MongoDB support
- Create database via cPanel
- Note the connection details
- Update backend .env accordingly

---

## 🔐 PART 4: Security & SSL Setup

### Step 11: Install SSL Certificate

**11.1 Free SSL with Let's Encrypt**
- In cPanel, go to "SSL/TLS Status"
- Select your domain
- Click "Run AutoSSL"
- Wait for certificate installation

**11.2 Force HTTPS**

Add to the top of your `public_html/.htaccess`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Step 12: Secure Backend

**12.1 Update CORS Settings**

Ensure your backend only accepts requests from your domain:

```javascript
// In your backend CORS config
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
  credentials: true
};
```

**12.2 Environment Variables Security**
- Never commit `.env` files to Git
- Use strong JWT secrets
- Use app-specific passwords for email

---

## 🧪 PART 5: Testing & Verification

### Step 13: Test Your Deployment

**13.1 Test Backend API**
- Visit: `https://api.yourdomain.com/api/products`
- Should return JSON data
- Test other endpoints

**13.2 Test Frontend**
- Visit: `https://yourdomain.com`
- Navigate through all pages
- Test user registration/login
- Test product browsing
- Test cart functionality
- Test admin panel

**13.3 Check Browser Console**
- Open Developer Tools (F12)
- Check for any errors
- Verify API calls are working

**13.4 Test on Mobile**
- Test responsive design
- Check all features work on mobile

---

## 🔄 PART 6: Updates & Maintenance

### Step 14: Updating Your Application

**For Backend Updates:**

```bash
# 1. Make changes locally
# 2. Test locally
# 3. Create new zip
cd /Users/krishanvarshney/react-ecomm
zip -r backend-update.zip backend -x "backend/node_modules/*"

# 4. Upload to cPanel
# 5. Extract and replace files
# 6. In cPanel Terminal:
cd ~/backend
npm install --production
# 7. Restart app in "Setup Node.js App"
```

**For Frontend Updates:**

```bash
# 1. Make changes locally
# 2. Build new version
cd /Users/krishanvarshney/react-ecomm
npm run build

# 3. Create zip
zip -r frontend-update.zip build/*

# 4. Upload to cPanel public_html
# 5. Extract and replace files
# 6. Clear browser cache and test
```

### Step 15: Setup Automated Backups

**15.1 Database Backups**
- In MongoDB Atlas, enable automated backups
- Or use cPanel backup wizard

**15.2 File Backups**
- Use cPanel "Backup Wizard"
- Schedule regular backups
- Download backups to local storage

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot GET /" on React routes
**Solution**: Make sure `.htaccess` is properly configured in `public_html`

### Issue 2: CORS errors
**Solution**: 
- Check backend CORS settings
- Verify FRONTEND_URL in backend .env
- Ensure SSL is installed on both frontend and backend

### Issue 3: Backend not starting
**Solution**:
- Check Node.js app logs in cPanel
- Verify all environment variables are set
- Check MongoDB connection string
- Run `npm install` again in Terminal

### Issue 4: 404 on API calls
**Solution**:
- Verify API URL in frontend config
- Check subdomain DNS settings
- Verify backend is running in cPanel

### Issue 5: Images not loading
**Solution**:
- Check file permissions (755 for folders, 644 for files)
- Verify upload paths in backend
- Check if uploads folder exists

### Issue 6: White screen on frontend
**Solution**:
- Check browser console for errors
- Verify all environment variables
- Check if build was successful
- Clear browser cache

---

## 📊 Monitoring & Logs

### Accessing Logs

**Backend Logs:**
- cPanel → Setup Node.js App → View logs
- Or via Terminal: `tail -f ~/logs/passenger.log`

**Error Logs:**
- cPanel → Metrics → Errors

**Access Logs:**
- cPanel → Metrics → Raw Access

---

## ✅ Post-Deployment Checklist

- [ ] Backend API is accessible and returning data
- [ ] Frontend loads without errors
- [ ] All routes work (no 404s)
- [ ] User registration/login works
- [ ] Product listing and details work
- [ ] Cart functionality works
- [ ] Admin panel is accessible
- [ ] Email notifications work
- [ ] SSL certificate is installed
- [ ] HTTPS redirect is working
- [ ] Mobile responsive design works
- [ ] All images load correctly
- [ ] Database connection is stable
- [ ] Backups are configured

---

## 🎉 Congratulations!

Your React e-commerce website is now live on cPanel! 

**Important URLs to bookmark:**
- Frontend: `https://yourdomain.com`
- Backend API: `https://api.yourdomain.com`
- Admin Panel: `https://yourdomain.com/admin`
- cPanel: `https://yourdomain.com:2083`

**Next Steps:**
- Set up Google Analytics
- Configure SEO settings
- Set up email marketing
- Monitor performance
- Plan regular updates

---

## 📞 Need Help?

If you encounter issues:
1. Check the Common Issues section above
2. Review cPanel error logs
3. Check browser console for frontend errors
4. Verify all environment variables
5. Contact your hosting provider for server-specific issues