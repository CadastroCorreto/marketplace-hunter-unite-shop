
export async function searchProducts(query: string, limit = 20) {
  if (!query || query.trim() === '') {
    throw new Error('Termo de busca é obrigatório');
  }
  
  // Use the Render backend URL to proxy the request to Mercado Livre
  const url = new URL('/search', 'https://marketplace-hunter-unite-shop.onrender.com');
  url.searchParams.append('query', query);
  url.searchParams.append('limit', limit.toString());
  
  console.log(`🔍 Buscando produtos via backend proxy: "${url.toString()}"`);
  
  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} produtos encontrados via proxy backend`);
    return data;
  } catch (error) {
    console.error('🚨 Erro ao buscar produtos:', error);
    throw new Error('Erro de conexão com o backend. Verifique se o servidor está online.');
  }
}
