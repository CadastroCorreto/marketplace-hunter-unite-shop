
export async function searchProducts(query: string, limit = 20) {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Termo de busca é obrigatório');
    }
    
    const url = new URL('/api/search', window.location.origin);
    url.searchParams.append('query', query);
    url.searchParams.append('limit', limit.toString());
    
    console.log(`🔍 Fazendo requisição para: "${url.toString()}"`);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} produtos encontrados:`, data);
    return data;
  } catch (error) {
    console.error('🚨 Erro ao buscar produtos:', error);
    throw error;
  }
}
