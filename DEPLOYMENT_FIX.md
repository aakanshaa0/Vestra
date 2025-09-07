# Deployment Configuration Fix

## Problem Fixed
✅ **Fixed the ERR_CONNECTION_REFUSED error** by configuring proper environment variables for API endpoints.

## Changes Made

### 1. Created Configuration Files
- `frontend/src/config/config.js` - Frontend API configuration
- `admin/src/config/config.js` - Admin API configuration

### 2. Updated All API Calls
- **Admin Panel**: Login, Products, Orders, AddProductForm
- **Frontend**: ShopContext (already using backendUrl from context)

### 3. Environment Variables
- `.env` files for local development
- `.env.production` files for production deployment

## 🚀 Deployment Steps

### Step 1: Deploy Your Backend First
1. Deploy your `backend` folder to Vercel/Railway/Heroku
2. Get your backend URL (e.g., `https://your-backend.vercel.app`)

### Step 2: Update Environment Variables

#### For Admin Panel:
Update `admin/.env.production`:
```env
VITE_BACKEND_URL=https://your-actual-backend-url.vercel.app
```

#### For Frontend:
Update `frontend/.env.production`:
```env
VITE_BACKEND_URL=https://your-actual-backend-url.vercel.app
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Step 3: Deploy Frontend & Admin
1. Deploy `frontend` folder to Vercel
2. Deploy `admin` folder to Vercel
3. Ensure environment variables are set in Vercel dashboard

## 🔧 Environment Variable Setup in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `VITE_BACKEND_URL` = `https://your-backend-url`
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `your_stripe_key` (for frontend)

## 🧪 Testing

After deployment, test these endpoints:
- ✅ Admin login
- ✅ Add product
- ✅ View products
- ✅ View orders
- ✅ Frontend product loading
- ✅ User authentication

## 📁 File Structure Updated
```
admin/
├── src/config/config.js          ← NEW
├── .env.production               ← NEW
└── src/pages/
    ├── Login.jsx                 ← UPDATED
    ├── Products.jsx              ← UPDATED
    ├── Orders.jsx                ← UPDATED
    └── AddProductForm.jsx        ← UPDATED

frontend/
├── src/config/config.js          ← NEW
├── .env.production               ← NEW
└── src/context/ShopContext.jsx   ← UPDATED
```

## 🔄 How It Works Now

1. **Development**: Uses `http://localhost:3000` from `.env`
2. **Production**: Uses your deployed backend URL from `.env.production`
3. **Automatic**: Vite automatically picks the right environment file

## ⚠️ Important Notes

1. **Replace the placeholder URL** in `.env.production` files with your actual backend URL
2. **Set environment variables** in your hosting platform (Vercel/Netlify)
3. **Test locally** first with the new configuration
4. **CORS**: Make sure your backend allows requests from your frontend domain

## 🆘 If You Still Get Errors

1. Check browser Network tab for the actual URL being called
2. Verify environment variables are set correctly in Vercel
3. Ensure your backend is deployed and accessible
4. Check CORS configuration in your backend
