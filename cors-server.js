const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3002;

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: false
}));

// Proxy middleware for ChangeClothesAI API
app.use('/api', createProxyMiddleware({
  target: 'https://changeclothesai.online',
  changeOrigin: true,
  secure: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.path} to ${proxyReq.getHeader('host')}${proxyReq.path}`);
    console.log('Request headers:', proxyReq.getHeaders());
    
    // Ensure proper content type for FormData
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      proxyReq.setHeader('Content-Type', req.headers['content-type']);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response: ${proxyRes.statusCode} for ${req.path}`);
    console.log('Response headers:', proxyRes.headers);
    
    // Add CORS headers to the response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`Proxying /api/* to https://changeclothesai.online/api/*`);
});
