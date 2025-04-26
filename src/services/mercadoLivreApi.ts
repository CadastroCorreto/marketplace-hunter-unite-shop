
export async function searchProducts(query: string, limit = 20) {
  try {
    if (!query || query.trim() === '') {
      throw new Error('Termo de busca é obrigatório');
    }
    
    console.log(`🔍 Buscando produtos para: "${query}"`);
    
    // Use our backend API endpoint
    const url = new URL('/api/search', window.location.origin);
    url.searchParams.append('query', query);
    url.searchParams.append('limit', limit.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} produtos encontrados`);
    return data;
  } catch (error) {
    console.error('🚨 Erro ao buscar produtos:', error);
    throw error;
  }
}
