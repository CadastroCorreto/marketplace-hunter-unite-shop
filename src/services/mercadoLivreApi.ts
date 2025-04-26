
export async function searchProducts(query: string, limit = 20) {
  try {
    console.log(`🔍 Buscando produtos para: "${query}"`);
    
    // Use the public API endpoint
    const url = new URL('https://api.mercadolibre.com/sites/MLB/search');
    url.searchParams.append('q', query);
    url.searchParams.append('limit', limit.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.results.length} produtos encontrados`);
    return data.results.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail.replace('I.jpg', 'W.jpg'),
      permalink: product.permalink,
      shipping: product.shipping || {},
      seller: product.seller || { nickname: 'Vendedor' }
    }));
  } catch (error) {
    console.error('🚨 Erro ao buscar produtos:', error);
    throw error;
  }
}
