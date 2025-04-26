
import React, { useEffect } from 'react';
import ProductCard from '../search/ProductCard';
import { useMercadoLivre } from '@/hooks/useMercadoLivre';
import { useToast } from "@/hooks/use-toast";
import { MOCK_DEALS } from '@/constants/mockDeals';
import { formatMercadoLivreProduct } from '@/utils/productFormatters';
import { LoadingState, ErrorState, EmptyState } from './FeaturedDealsStates';

const FeaturedDeals = () => {
  const { data: mlProducts, isLoading, error, refetch } = useMercadoLivre();
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: `Detalhes: ${error.message || "Erro desconhecido"}`,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const deals = mlProducts?.length 
    ? mlProducts.slice(0, 3).map(formatMercadoLivreProduct)
    : MOCK_DEALS;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ofertas em Destaque</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira as melhores ofertas selecionadas dos principais marketplaces.
          </p>
          {!isLoading && (
            <button 
              onClick={() => refetch()} 
              className="mt-4 px-4 py-2 bg-marketplace-blue text-white rounded-md hover:bg-blue-600"
            >
              Atualizar Ofertas
            </button>
          )}
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
          ) : mlProducts?.length ? (
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
