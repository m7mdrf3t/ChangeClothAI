const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// API proxy for ChangeClothesAI
app.use('/api', express.raw({ type: 'application/octet-stream', limit: '50mb' }));

app.post('/api/*', async (req, res) => {
  try {
    const targetUrl = `https://changeclothesai.online${req.path}`;
    
    console.log(`Proxying request to: ${targetUrl}`);
    
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': req.headers['content-type'],
        'Origin': 'https://changeclothesai.online',
        'Referer': 'https://changeclothesai.online'
      },
      body: req.body
    });

    const data = await response.json();
    
    console.log(`Response status: ${response.status}`);
    
    res.status(response.status).json(data);
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
