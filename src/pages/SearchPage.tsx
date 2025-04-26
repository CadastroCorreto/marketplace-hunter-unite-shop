
import React from 'react';
import SearchForm from '@/components/search/SearchForm';
import ProductCard from '@/components/search/ProductCard';
import { useSearchProducts, useApiStatus } from '@/hooks/useMercadoLivre';
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import MercadoLivreProductTable from '@/components/marketplaces/MercadoLivreProductTable';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: products, isLoading, error } = useSearchProducts(searchQuery);
  const { data: apiStatus, isLoading: isCheckingApi, error: apiError } = useApiStatus();

  const handleSearch = (query: string) => {
    if (!query || query.trim() === '') {
      toast.error('Por favor, digite um termo de busca');
      return;
    }
    
    setSearchQuery(query);
    toast.success(`Buscando por "${query}"`);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Busca no Mercado Livre</h1>
      
      {/* API Status Indicator */}
      <div className="max-w-2xl mx-auto mb-4">
        {isCheckingApi ? (
          <Alert className="bg-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" />
              <AlertDescription>Verificando conexão com a API...</AlertDescription>
            </div>
          </Alert>
        ) : apiError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro de conexão com a API. Verifique se o servidor está online.
            </AlertDescription>
          </Alert>
        ) : apiStatus ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              API conectada com sucesso! {apiStatus.message}
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
      
      <div className="max-w-2xl mx-auto mb-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao buscar produtos: {error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.
          </AlertDescription>
        </Alert>
      )}

      {searchQuery && !isLoading && products && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.thumbnail}
                marketplace={{
                  id: "mercado-livre",
                  name: "Mercado Livre",
                  logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png"
                }}
                freeShipping={product.shipping?.free_shipping}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhum produto encontrado para "{searchQuery}"</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
