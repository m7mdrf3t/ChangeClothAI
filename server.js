const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle all content types for API requests
app.use('/api', express.raw({ type: '*/*', limit: '50mb' }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API proxy for ChangeClothesAI
app.post('/api/*', async (req, res) => {
  try {
    const targetUrl = `https://changeclothesai.online${req.path}`;
    
    console.log(`Proxying request to: ${targetUrl}`);
    console.log(`Request headers:`, req.headers);
    
    // Get the raw body as buffer
    const rawBody = req.body;
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        // Don't set Content-Type - let fetch set it automatically for FormData
        // Don't set Origin or Referer - let the API handle it
      },
      body: rawBody
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log(`Response data:`, data);
      
      // Forward the API response as-is
      res.status(response.status).json(data);
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      console.log(`Response text:`, text.substring(0, 200));
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
});

// Handle OPTIONS requests for CORS preflight
app.options('/api/*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

// Handle React Router - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API proxy available at /api/*`);
});
