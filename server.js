
const express = require('express');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression and CORS
app.use(compression());
app.use(cors());

// API route for Mercado Livre search
app.get('/api/search', async (req, res) => {
  const { query, limit = 20 } = req.query;

  try {
    console.log(`🔍 Buscando produtos para: "${query}"`);
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

    console.log(`✅ ${products.length} produtos encontrados`);
    res.json(products);
  } catch (error) {
    console.error('🚨 Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// For any request that doesn't match a static file, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
