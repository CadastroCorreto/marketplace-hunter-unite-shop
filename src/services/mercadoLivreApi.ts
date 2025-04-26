
// API simplificada do Mercado Livre (apenas endpoints públicos)

export async function searchProducts(query: string, limit = 20) {
  try {
    console.log(`🔍 Buscando produtos para: "${query}"`);
    
    const url = new URL('https://api.mercadolibre.com/sites/MLB/search');
    url.searchParams.append('q', query);
    url.searchParams.append('limit', limit.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erro na API do Mercado Livre:', response.status, errorData);
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.results.length} produtos encontrados`);
    return data.results;
  } catch (error) {
    console.error('🚨 Erro ao buscar produtos:', error);
    throw error;
  }
}

export async function getTrendingProducts(limit = 10) {
  try {
    console.log('📈 Buscando produtos em tendência...');
    
    const response = await fetch('https://api.mercadolibre.com/trends/MLB');
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erro na API de tendências:', response.status, errorData);
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const trends = await response.json();
    console.log(`📊 ${trends.length} tendências encontradas`);
    
    if (trends.length === 0) {
      return [];
    }
    
    // Limitamos o número de tendências e buscamos detalhes
    const limitedTrends = trends.slice(0, limit);
    
    const productDetailsPromises = limitedTrends.map(async (trend: any) => {
      const keyword = trend.keyword;
      console.log(`🔎 Buscando detalhes para: ${keyword}`);
      
      const searchResponse = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(keyword)}&limit=1`
      );
      
      if (!searchResponse.ok) {
        console.error(`❌ Erro ao buscar detalhes para ${keyword}`);
        return null;
      }
      
      const searchData = await searchResponse.json();
      return searchData.results[0];
    });
    
    const productsDetails = await Promise.all(productDetailsPromises);
    const validProducts = productsDetails.filter(product => product !== null);
    
    console.log(`✅ ${validProducts.length} produtos em tendência obtidos`);
    return validProducts;
  } catch (error) {
    console.error('🚨 Erro ao buscar tendências:', error);
    return [];
  }
}
