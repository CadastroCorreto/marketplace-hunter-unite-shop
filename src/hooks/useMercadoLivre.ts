
import { useQuery } from '@tanstack/react-query';
import { searchProducts, getTrendingProducts } from '@/services/mercadoLivreApi';

// Hook para buscar produtos em tendência
export function useTrendingProducts(limit = 5) {
  return useQuery({
    queryKey: ['mercadoLivre', 'trending', limit],
    queryFn: () => getTrendingProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error('Erro ao buscar produtos em tendência:', error.message);
      }
    }
  });
}

// Hook para buscar produtos por termo
export function useSearchProducts(query: string, limit = 20) {
  return useQuery({
    queryKey: ['mercadoLivre', 'search', query, limit],
    queryFn: () => searchProducts(query, limit),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    meta: {
      onError: (error: Error) => {
        console.error(`Erro ao buscar produtos para "${query}":`, error.message);
      }
    }
  });
}
