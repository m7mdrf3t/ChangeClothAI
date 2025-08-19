# CORS Bypass Guide for Testing

## Quick Solution: Browser Extension

### Option 1: CORS Unblock (Chrome)
1. Install "CORS Unblock" extension from Chrome Web Store
2. Click the extension icon and enable it
3. Refresh your React app
4. Try the API call again

### Option 2: CORS Everywhere (Firefox)
1. Install "CORS Everywhere" extension
2. Enable it for localhost
3. Refresh your React app

## Alternative: Disable CORS in Chrome

### For macOS:
```bash
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

### For Windows:
```bash
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
```

## Current Status

- ✅ API Endpoint: `https://changeclothesai.online/api/openapi/change-clothes-ai`
- ✅ API Key: Working (hardcoded)
- ✅ Method: POST
- ❌ CORS: Blocked by browser

## Test Steps

1. Install CORS extension or disable CORS in browser
2. Start React app: `npm start`
3. Upload model and garment images
4. Click "Transform Clothes"
5. Should work without 405 errors

## Production Deployment

For production, deploy to a hosting service (Netlify, Vercel, etc.) where CORS won't be an issue.
