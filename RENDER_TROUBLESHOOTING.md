# Render Deployment Troubleshooting

## Error: Exit Code 127

Exit code 127 typically means **command not found** or **build failure** on Render.

## Common Causes & Solutions

### 1. Missing Dependencies
**Problem**: `npm install` fails because packages are missing
**Solution**: Check your `package.json` has all required dependencies

### 2. Build Script Missing
**Problem**: Render can't find build script
**Solution**: Add to `package.json`:
```json
{
  "scripts": {
    "start": "node app.js",
    "build": "echo 'No build needed for Node.js'"
  }
}
```

### 3. Database Connection Issues
**Problem**: Can't connect to PostgreSQL
**Solution**: Verify DATABASE_URL format:
```bash
# Correct format:
postgresql://username:password@host:port/database
```

### 4. Port Issues
**Problem**: App tries to use wrong port
**Solution**: Ensure your app listens to Render's PORT:
```javascript
const PORT = process.env.PORT || 3000;
```

### 5. Environment Variables
**Problem**: Required env vars not set
**Solution**: Add in Render dashboard:
- `DATABASE_URL` (already in your code)
- `JWT_SECRET`
- `NODE_ENV=production`

## Quick Fix Checklist

### In Render Dashboard:
1. **Go to Services → Your Service**
2. **Environment tab**:
   - Add `JWT_SECRET=super_secret_key_change_in_production`
   - Add `NODE_ENV=production`
   - Verify `DATABASE_URL` is correct
3. **Build & Deploy tab**:
   - Click "Manual Deploy"
   - Check "Build Command": `npm install`
   - Check "Start Command": `npm start`

### Debug Steps:
1. **View Build Logs** in Render dashboard
2. **Check specific error** in logs
3. **Fix locally** and push changes
4. **Redeploy** after fixes

## Most Likely Issue:
**Missing start script** - Render needs to know how to run your app.

Add this to package.json if missing:
```json
"scripts": {
  "start": "node app.js"
}
```

## If Still Failing:
1. Copy exact error from Render logs
2. Check it's not a database connection error
3. Verify all environment variables are set
4. Ensure your app.js exports properly
