# CORS Solution Guide for ChangeClothesAI

## Current Issue
The ChangeClothesAI API doesn't include CORS headers, which prevents browser-based requests from localhost.

## Solutions Implemented

### 1. CORS Proxy Server (Recommended)
- **File**: `cors-server.js`
- **Port**: 3002
- **Usage**: `npm run cors-server`
- **Status**: ✅ Running

This proxy server handles CORS by:
- Forwarding requests to `https://changeclothesai.online`
- Adding CORS headers to responses
- Logging all requests for debugging

### 2. Enhanced Error Handling
- Better JSON parsing error handling
- Specific CORS error detection
- Detailed error messages for users

## How to Use

### Option A: Use the CORS Proxy Server
1. Start the CORS server: `npm run cors-server`
2. Start the React app: `npm start`
3. The app will automatically use the proxy at `http://localhost:3002`

### Option B: Browser Extension (Quick Fix)
1. Install "CORS Unblock" extension for Chrome/Firefox
2. Enable it for localhost
3. Use the original API endpoint

### Option C: Production Deployment
1. Build the app: `npm run build`
2. Deploy to Netlify/Vercel/etc.
3. CORS issues typically don't occur in production

## Testing the Current Setup

1. **CORS Server**: Running on port 3002
2. **React App**: Should be running on port 3000/3001
3. **API Calls**: Will go through `http://localhost:3002/api/...`

## Troubleshooting

### If you get "Proxy error":
- Check if the CORS server is running
- Verify the API key is correct
- Check browser console for detailed errors

### If you get "404 Not Found":
- The proxy is working but the API endpoint might be wrong
- Verify the API endpoint URL

### If you get "Failed to fetch":
- CORS server might not be running
- Start it with: `npm run cors-server`

## Alternative: Direct API Call with CORS Bypass

If the proxy doesn't work, you can temporarily disable CORS in your browser:

### Chrome:
1. Close all Chrome instances
2. Open terminal and run:
   ```bash
   open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
   ```

### Firefox:
1. Install "CORS Everywhere" extension
2. Enable it for localhost

## Production Considerations

For production deployment:
1. Remove the CORS proxy dependency
2. Contact ChangeClothesAI to add CORS headers
3. Or deploy the proxy server alongside your app
4. Use environment variables for API endpoints

## Current Status

- ✅ CORS Proxy Server: Running on port 3002
- ✅ Enhanced Error Handling: Implemented
- ✅ API Integration: Ready for testing
- 🔄 React App: Ready to start

Try uploading images and making API calls now!
