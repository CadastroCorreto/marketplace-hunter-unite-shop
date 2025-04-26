
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/services/mercadoLivreApi';

export function useSearchProducts(query: string, limit = 20) {
  return useQuery({
    queryKey: ['mercadoLivre', 'search', query, limit],
    queryFn: () => searchProducts(query, limit),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
