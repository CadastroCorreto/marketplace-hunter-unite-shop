
import React from 'react';
import ProductCard from '../search/ProductCard';
import { useTrendingProducts } from '@/hooks/useMercadoLivre';
import { toast } from "sonner";
import { MOCK_DEALS } from '@/constants/mockDeals';
import { formatMercadoLivreProduct } from '@/utils/productFormatters';
import { LoadingState, ErrorState, EmptyState } from './FeaturedDealsStates';

const FeaturedDeals = () => {
  const { data: trendingProducts, isLoading, error, refetch } = useTrendingProducts(3);
  
  // Usar produtos da API ou mockados quando necessário
  const deals = trendingProducts?.length 
    ? trendingProducts.map(formatMercadoLivreProduct)
    : MOCK_DEALS;

  // Notificar erros via toast
  React.useEffect(() => {
    if (error) {
      toast.error("Erro ao carregar produtos", {
        description: `Não foi possível obter produtos em tendência. ${error.message}`
      });
    }
  }, [error]);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ofertas em Destaque</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira as melhores ofertas e tendências do Mercado Livre.
          </p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-marketplace-blue text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Atualizando...' : 'Atualizar Ofertas'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <>
              <ErrorState error={error} showMockDeals />
              {MOCK_DEALS.map((deal) => (
                <ProductCard key={deal.id} {...deal} />
              ))}
            </>
          ) : deals.length ? (
            deals.map((deal) => (
              <ProductCard key={deal.id} {...deal} />
            ))
          ) : (
            <>
              <EmptyState />
              {MOCK_DEALS.map((deal) => (
                <ProductCard key={deal.id} {...deal} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
