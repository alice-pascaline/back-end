# Render Deployment Guide - Blood Donation System

## 🚀 Quick Deployment Steps

### 1. Go to Render.com
- Sign up/login to your account
- Click "New" → "Web Service"

### 2. Connect GitHub
- Choose "Build and deploy from a Git repository"
- Connect your GitHub account
- Select: `alice-pascaline/back-end`

### 3. Configure Service
**Name**: blood-donation-api
**Region**: Choose nearest to your users
**Branch**: main
**Runtime**: Node (latest)
**Build Command**: `npm install`
**Start Command**: `npm start`

### 4. Environment Variables
Add these in Render dashboard:

```
DATABASE_URL=postgresql://donation_6iry_user:PrysCRhWQw8VrBOYtCDlkdQYtCjJtiwf@dpg-d7u8j2v7f7vs73eoloj0-a.oregon-postgres.render.com/donation_6iry
JWT_SECRET=super_secret_key_change_in_production
NODE_ENV=production
```

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)

## 🔧 What I Fixed For You

✅ **Added Start Script**: Render needs `npm start` command
✅ **PostgreSQL Config**: DATABASE_URL already configured
✅ **Dependencies**: pg package installed
✅ **Pushed to GitHub**: Latest code is live

## 📊 Expected Results

After deployment, your API will be available at:
`https://blood-donation-api.onrender.com`

### Health Check
```bash
curl https://blood-donation-api.onrender.com/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Blood Donation API is running",
  "timestamp": "2026-05-07T..."
}
```

## 🐛 Common Issues & Solutions

### If Build Fails
1. Check Render build logs
2. Verify DATABASE_URL is correct
3. Ensure all dependencies are in package.json

### If Database Connection Fails
1. Verify PostgreSQL is running on Render
2. Check DATABASE_URL format
3. Make sure user/password are correct

### If App Doesn't Start
1. Check that PORT=3000 (Render sets this)
2. Verify app.js has no syntax errors
3. Check Render service logs

## 🔄 Auto-Deploy

Every time you push to GitHub main branch:
- Render will automatically redeploy
- No manual intervention needed
- Database migrations run automatically

## 📱 Frontend Integration

Update frontend API URL in production:
```javascript
// frontend/src/services/api.js
const api = axios.create({
  baseURL: 'https://blood-donation-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## 🎯 Success Checklist

- [ ] GitHub repo connected
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Health check passes
- [ ] Frontend API URL updated

Your blood donation system is now ready for production deployment!
