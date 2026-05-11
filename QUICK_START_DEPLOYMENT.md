# 🚀 Quick Start: Deploy to cPanel

This is a simplified guide to get you started quickly. For detailed instructions, see `.agent/workflows/cpanel-deployment.md`

## 📦 What You'll Deploy

- **Frontend**: React application → `public_html`
- **Backend**: Node.js/Express API → `~/backend`
- **Database**: MongoDB Atlas (cloud)

---

## ⚡ Quick Steps

### 1️⃣ Prepare Your Files (5 minutes)

Run the automated preparation script:

```bash
./deploy-prep.sh
```

Choose option **5** to create both deployment packages.

This will create:
- `backend-deploy.zip` - Your backend files
- `frontend-deploy.zip` - Your frontend files

### 2️⃣ Setup MongoDB Atlas (10 minutes)

1. Go to https://cloud.mongodb.com
2. Sign up (free tier is fine)
3. Create a new cluster
4. Create database: `kayaroop_ecommerce`
5. Create a database user with password
6. Whitelist all IPs: `0.0.0.0/0`
7. Get connection string (Connect → Drivers)
8. Save this connection string - you'll need it!

### 3️⃣ Upload Backend (15 minutes)

**In cPanel:**

1. **File Manager** → Navigate to home directory
2. Create folder: `backend`
3. Upload `backend-deploy.zip` to this folder
4. Extract the zip file
5. Delete the zip file

**Setup Node.js:**

1. **Setup Node.js App** (in Software section)
2. Click "Create Application"
3. Configure:
   - Node.js version: **14.x or higher**
   - Application mode: **Production**
   - Application root: `backend`
   - Application startup file: `server.js`

4. **Add Environment Variables** (click "Add Variable" for each):
   ```
   MONGODB_URI = your_mongodb_atlas_connection_string
   DB_NAME = kayaroop_ecommerce
   PORT = 3001
   NODE_ENV = production
   JWT_SECRET = your_super_secure_random_string_here
   JWT_EXPIRE = 7d
   EMAIL_HOST = smtp.gmail.com
   EMAIL_PORT = 587
   EMAIL_USER = your_email@gmail.com
   EMAIL_PASS = your_gmail_app_password
   FRONTEND_URL = https://yourdomain.com
   CORS_ORIGIN = https://yourdomain.com
   ```

5. **Install Dependencies:**
   - Copy the activation command shown (looks like: `source /home/username/nodevenv/backend/14/bin/activate`)
   - Open **Terminal** in cPanel
   - Paste and run the activation command
   - Run: `cd ~/backend`
   - Run: `npm install --production`

6. **Start the app:**
   - Go back to "Setup Node.js App"
   - Click **Restart**

7. **Create subdomain** (recommended):
   - Go to **Subdomains**
   - Create: `api.yourdomain.com`
   - Point to: `backend` folder

### 4️⃣ Upload Frontend (10 minutes)

**Before uploading, update your API URL:**

1. Create `.env.production` in your project:
   ```env
   REACT_APP_API_URL=https://api.yourdomain.com
   ```

2. Rebuild frontend:
   ```bash
   npm run build
   ```

3. Recreate frontend package:
   ```bash
   ./deploy-prep.sh
   ```
   Choose option **4**

**In cPanel:**

1. **File Manager** → Navigate to `public_html`
2. Delete all default files (index.html, etc.)
3. Upload `frontend-deploy.zip`
4. Extract the zip file
5. **Important**: Move all files from the `build` folder to `public_html` root
6. Delete the empty `build` folder and zip file

### 5️⃣ Install SSL (5 minutes)

1. In cPanel, go to **SSL/TLS Status**
2. Select your domain
3. Click **Run AutoSSL**
4. Wait for installation to complete

### 6️⃣ Seed Database (5 minutes)

**From your local machine:**

1. Update your local `backend/.env` with MongoDB Atlas connection string
2. Run these commands:
   ```bash
   cd backend
   node seed.js
   node seedBlogs.js
   node seedCoupons.js
   node createSimpleAdmin.js
   ```

3. Note the admin credentials shown!

### 7️⃣ Test Everything (10 minutes)

**Backend Test:**
- Visit: `https://api.yourdomain.com/api/products`
- Should see JSON product data

**Frontend Test:**
- Visit: `https://yourdomain.com`
- Browse products
- Try login/register
- Test cart
- Login to admin panel: `https://yourdomain.com/admin`

---

## ✅ Success Checklist

- [ ] Backend API returns data at `https://api.yourdomain.com/api/products`
- [ ] Frontend loads at `https://yourdomain.com`
- [ ] All pages work (no 404 errors)
- [ ] Can register/login
- [ ] Products display correctly
- [ ] Cart works
- [ ] Admin panel accessible
- [ ] SSL certificate installed (🔒 in browser)

---

## 🆘 Common Issues

### Backend not starting?
- Check Node.js app logs in cPanel
- Verify all environment variables are set
- Make sure MongoDB connection string is correct

### Frontend shows white screen?
- Check browser console (F12) for errors
- Verify `.env.production` has correct API URL
- Clear browser cache

### API calls failing?
- Check CORS settings in backend
- Verify API URL in frontend
- Make sure backend is running

### 404 on routes?
- Make sure `.htaccess` is in `public_html`
- Check file was extracted properly

---

## 📚 Need More Help?

- **Full Guide**: `.agent/workflows/cpanel-deployment.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Prep Script**: `./deploy-prep.sh`

---

## 🎉 That's It!

Your website should now be live! 

**Important URLs:**
- Website: `https://yourdomain.com`
- API: `https://api.yourdomain.com`
- Admin: `https://yourdomain.com/admin`

**Next Steps:**
- Set up regular backups
- Monitor error logs
- Configure email notifications
- Add Google Analytics
- Optimize performance

---

**Total Time**: ~60 minutes (first time)
**Difficulty**: Intermediate

Good luck! 🚀
