const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://changeclothesai.online',
      changeOrigin: true,
      secure: true,
      // Add these settings for better FormData handling
      timeout: 30000, // 30 second timeout
      proxyTimeout: 30000,
      // Buffer the request body to handle ForxmData properly
      buffer: true,
      pathRewrite: {
        '^/api': '/api', // Keep the /api prefix
      },
      onProxyReq: function(proxyReq, req, res) {
        // Log the proxy request for debugging
        console.log('Proxying request to:', proxyReq.path);
        console.log('Target URL:', proxyReq.getHeader('host') + proxyReq.path);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Authorization:', req.headers['authorization'] ? 'Present' : 'Missing');
        
        // Ensure Content-Length is set properly for FormData
        if (req.headers['content-length']) {
          proxyReq.setHeader('Content-Length', req.headers['content-length']);
        }
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('Proxy response status:', proxyRes.statusCode);
        console.log('Proxy response headers:', proxyRes.headers);
        
        // Add CORS headers to the response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
      },
    })
  );
  
  // Add explicit CORS handling for preflight requests
  app.use('/api/*', (req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.sendStatus(200);
    } else {
      next();
    }
  });
};