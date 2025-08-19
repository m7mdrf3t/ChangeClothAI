const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://changeclothesai.online',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/api': '/api', // Keep the /api prefix
      },
      onProxyReq: function(proxyReq, req, res) {
        // Log the proxy request for debugging
        console.log('Proxying request to:', proxyReq.path);
        console.log('Target URL:', proxyReq.getHeader('host') + proxyReq.path);
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('Proxy response status:', proxyRes.statusCode);
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
};
