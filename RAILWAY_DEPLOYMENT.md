# Railway Deployment Guide - ChangeClothAI

## 🚂 Railway Port Configuration

### **Port: 80 (Default) or Railway's PORT**

Railway automatically assigns a `PORT` environment variable. Your app is configured to use it.

## Quick Deploy

### **Option 1: Use Railway's Dockerfile (Recommended)**

1. **Rename Dockerfile**:
   ```bash
   mv Dockerfile.railway Dockerfile
   ```

2. **Deploy to Railway**:
   - Connect your GitHub repository
   - Railway will auto-detect the Dockerfile
   - Deploy automatically

### **Option 2: Manual Railway Setup**

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```

3. **Initialize Project**:
   ```bash
   railway init
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

## Port Configuration

### **Automatic Port Handling**

Railway will:
- ✅ Set `PORT` environment variable automatically
- ✅ Your app will listen on that port
- ✅ No manual configuration needed

### **Manual Port Override (if needed)**

In Railway dashboard:
1. Go to your project
2. Click "Variables"
3. Add: `PORT=3000` (or any port)

## Environment Variables

### **Required Variables**

Railway automatically provides:
- `PORT` - The port your app should listen on

### **Optional Variables**

You can add these in Railway dashboard:
- `NODE_ENV=production`
- `REACT_APP_API_URL=https://changeclothesai.online`

## Deployment Steps

### **1. Prepare Your Repository**

```bash
# Ensure you have the Railway Dockerfile
cp Dockerfile.railway Dockerfile

# Commit your changes
git add .
git commit -m "Add Railway deployment configuration"
git push
```

### **2. Connect to Railway**

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### **3. Deploy**

Railway will:
- ✅ Detect the Dockerfile
- ✅ Build the Docker image
- ✅ Deploy to production
- ✅ Provide a public URL

## Troubleshooting

### **Port Issues**

If you get port errors:
```bash
# Check Railway logs
railway logs

# Verify PORT is set
railway variables
```

### **Build Issues**

```bash
# Check build logs
railway logs --build

# Rebuild manually
railway up --build
```

### **CORS Issues**

Your app includes nginx proxy for CORS:
- ✅ API calls go through nginx proxy
- ✅ No CORS issues in production
- ✅ Works with ChangeClothesAI API

## Railway Features

### **Auto-Deploy**
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Rollback to previous versions

### **Scaling**
- ✅ Automatic scaling based on traffic
- ✅ Custom scaling rules
- ✅ Resource monitoring

### **Monitoring**
- ✅ Real-time logs
- ✅ Performance metrics
- ✅ Error tracking

## Cost Considerations

### **Railway Pricing**
- **Free Tier**: $5 credit/month
- **Pro**: Pay-as-you-use
- **Team**: Shared billing

### **Optimization**
- ✅ Multi-stage Docker build
- ✅ Alpine Linux base images
- ✅ Optimized nginx configuration

## Post-Deployment

### **1. Test Your App**
- Visit your Railway URL
- Test image upload functionality
- Verify API calls work

### **2. Custom Domain (Optional)**
- Add custom domain in Railway dashboard
- Configure DNS records
- Enable HTTPS

### **3. Monitor Performance**
- Check Railway metrics
- Monitor API usage
- Watch for errors

## Security

### **Railway Security**
- ✅ HTTPS by default
- ✅ Environment variable encryption
- ✅ Secure container isolation

### **Your App Security**
- ✅ Nginx security headers
- ✅ Content Security Policy
- ✅ XSS protection

## Next Steps

1. **Deploy**: Push to Railway
2. **Test**: Verify everything works
3. **Share**: Share your Railway URL
4. **Monitor**: Watch performance and usage

Your ChangeClothesAI app will work perfectly on Railway! 🚂✨
