import { getStoredToken } from './mercadoLivreAuth';

export async function fetchFeaturedProducts() {
  try {
    console.log('🌟 Iniciando busca de produtos em destaque...');
    const storedToken = getStoredToken();
    
    console.log('🔑 Token disponível:', !!storedToken);
    
    if (!storedToken) {
      console.warn('❌ Nenhum token encontrado. Precisa autenticar.');
      return [];
    }

    const response = await fetch(
      'https://api.mercadolibre.com/trends/MLB',
      {
        headers: {
          'Authorization': `Bearer ${storedToken.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('🌐 Resposta da API:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta da API:', response.status, errorText);
      return [];
    }
    
    const trends = await response.json();
    
    console.log('📊 Tendências recebidas:', trends.length);
    
    if (!trends || !trends.length) {
      console.log('Nenhuma tendência encontrada, retornando array vazio');
      return [];
    }
    
    const firstThreeTrends = trends.slice(0, 3);
    
    const productDetailsPromises = firstThreeTrends.map(async (trend: any) => {
      const keyword = trend.keyword;
      console.log(`Buscando detalhes para: ${keyword}`);
      
      const searchResponse = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(keyword)}&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${storedToken.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!searchResponse.ok) {
        console.error(`Erro ao buscar detalhes para ${keyword}`);
        return null;
      }
      
      const searchData = await searchResponse.json();
      return searchData.results[0];
    });
    
    const productsDetails = await Promise.all(productDetailsPromises);
    const validProducts = productsDetails.filter(product => product !== null);
    
    console.log('Produtos obtidos com sucesso:', validProducts.length);
    return validProducts;
  } catch (error) {
    console.error('🚨 Erro no fluxo de busca de produtos:', error);
    return [];
  }
}

export async function fetchProductsByQuery(query: string, limit = 20) {
  try {
    const storedToken = getStoredToken();
    
    if (!storedToken) {
      console.log('Sem token disponível');
      return [];
    }

    const url = new URL('https://api.mercadolibre.com/sites/MLB/search');
    url.searchParams.append('q', query);
    url.searchParams.append('sort', 'price_asc');
    url.searchParams.append('limit', limit.toString());
    
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${storedToken.access_token}`,
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}
