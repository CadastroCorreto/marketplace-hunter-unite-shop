
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/services/mercadoLivreApi';

export interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  permalink: string;
  shipping: {
    free_shipping: boolean;
  };
  seller: {
    nickname: string;
  };
}

export function useSearchProducts(query: string, limit = 20) {
  return useQuery<Product[]>({
    queryKey: ['mercadoLivre', 'search', query, limit],
    queryFn: () => searchProducts(query, limit),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTrendingProducts(limit = 20) {
  // This is just a search for popular products with a default query
  return useQuery({
    queryKey: ['mercadoLivre', 'trending', limit],
    queryFn: () => searchProducts('ofertas', limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useApiStatus() {
  return useQuery({
    queryKey: ['api', 'status'],
    queryFn: async () => {
      try {
        const url = new URL('/api/status', window.location.origin);
        const response = await fetch(url.toString());
        
        if (!response.ok) {
          throw new Error(`Status da API: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('🚨 Erro ao verificar status da API:', error);
        throw error;
      }
    },
    staleTime: 60 * 1000, // 1 minute
    retry: 3,
  });
}
