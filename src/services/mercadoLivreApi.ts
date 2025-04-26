
export async function searchProducts(query: string, limit = 20) {
  if (!query || query.trim() === '') {
    throw new Error('Termo de busca é obrigatório');
  }
  
  const url = new URL('/search', 'https://marketplace-hunter-unite-shop.onrender.com');
  url.searchParams.append('query', query);
  url.searchParams.append('limit', limit.toString());
  
  console.log(`🔍 Buscando produtos: "${url.toString()}"`);
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error('Erro de conexão com a API. Verifique se o servidor está online.');
  }
  
  const data = await response.json();
  console.log(`✅ ${data.length} produtos encontrados`);
  return data;
}
