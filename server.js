
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration - Allow requests from Lovable domain and localhost for development
app.use(cors({
  origin: [
    'https://marketplace-hunter-unite-shop.lovable.app', 
    'http://localhost:8080', 
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable compression
app.use(compression());

// Status endpoint to check if server is running
app.get('/status', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'Marketplace Hunter API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// API route for Mercado Livre search
app.get('/search', async (req, res) => {
  const { query, limit = 20 } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    console.log(`🔍 Backend recebeu requisição para buscar: "${query}" com limite ${limit}`);
    const response = await axios.get('https://api.mercadolibre.com/sites/MLB/search', {
      params: { q: query, limit }
    });
    
    const products = response.data.results.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail.replace('I.jpg', 'W.jpg'),
      permalink: product.permalink,
      shipping: product.shipping || {},
      seller: product.seller || { nickname: 'Vendedor' }
    }));

    console.log(`✅ Backend encontrou ${products.length} produtos para "${query}"`);
    
    res.json(products);
  } catch (error) {
    console.error('🚨 Erro no backend ao buscar produtos:', error.message);
    res.status(500).json({ error: `Erro ao buscar produtos: ${error.message}` });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match a static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Endpoints disponíveis:`);
  console.log(`   - GET /status - Verificar status da API`);
  console.log(`   - GET /search?query=TERMO - Buscar produtos`);
});
