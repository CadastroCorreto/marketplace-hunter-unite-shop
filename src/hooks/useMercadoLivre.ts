
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/services/mercadoLivreApi';

export function useSearchProducts(query: string, limit = 20) {
  return useQuery({
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
