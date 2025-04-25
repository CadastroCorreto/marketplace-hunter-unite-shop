
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import ProductCard from '../search/ProductCard';
import { useMercadoLivre } from '@/hooks/useMercadoLivre';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_OTHER_DEALS = [
  {
    id: "1",
    title: "Samsung Galaxy S23 Ultra 256GB",
    price: 5999.99,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_601010-MLU69793276453_062023-F.webp",
    marketplace: {
      id: "mercado-livre",
      name: "Mercado Livre",
      logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png"
    },
    discount: 15,
    freeShipping: true,
    rating: 4.8
  },
  {
    id: "2",
    title: "Apple iPhone 15 Pro 128GB",
    price: 6999.99,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_963302-MLU72535748608_102023-F.webp",
    marketplace: {
      id: "amazon",
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
    },
    discount: 10,
    freeShipping: true,
    rating: 4.9
  },
  {
    id: "3",
    title: "Xbox Series X 1TB",
    price: 3999.99,
    image: "https://http2.mlstatic.com/D_NQ_NP_2X_735281-MLU72648617369_112023-F.webp",
    marketplace: {
      id: "magazine-luiza",
      name: "Magazine Luiza",
      logo: "https://logodownload.org/wp-content/uploads/2014/07/magazine-luiza-logo-0.png"
    },
    discount: 20,
    freeShipping: true,
    rating: 4.7
  }
];

const FeaturedDeals = () => {
  const { data: mlProducts, isLoading, error, refetch } = useMercadoLivre();
  const { toast } = useToast();
  
  useEffect(() => {
    // Exibir informações de debug no console
    console.log('Estado do carregamento:', isLoading);
    console.log('Dados recebidos:', mlProducts);
    console.log('Erro (se houver):', error);
    
    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: `Detalhes: ${error.message || "Erro desconhecido"}`,
        variant: "destructive"
      });
    }
  }, [mlProducts, isLoading, error, toast]);
  
  const formatMercadoLivreProduct = (mlProduct: any) => ({
    id: mlProduct.id,
    title: mlProduct.title,
    price: mlProduct.price,
    image: mlProduct.thumbnail.replace('I.jpg', 'W.jpg'),
    marketplace: {
      id: "mercado-livre",
      name: "Mercado Livre",
      logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png"
    },
    discount: mlProduct.original_price 
      ? Math.round(((mlProduct.original_price - mlProduct.price) / mlProduct.original_price) * 100)
      : 0,
    freeShipping: mlProduct.shipping?.free_shipping || false,
    rating: 4.8
  });

  // Use os produtos do Mercado Livre se estiverem disponíveis, senão use os dados simulados
  const deals = mlProducts?.length 
    ? mlProducts.slice(0, 3).map(formatMercadoLivreProduct)
    : MOCK_OTHER_DEALS;

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
            <>
              {[1, 2, 3].map((n) => (
                <Card key={n} className="overflow-hidden p-4 flex flex-col">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="w-3/4 h-5 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-4" />
                  <Skeleton className="w-full h-10 mt-auto" />
                </Card>
              ))}
            </>
          ) : error ? (
            <>
              <Alert variant="destructive" className="col-span-full mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  Não foi possível carregar os produtos do Mercado Livre. Mostrando ofertas alternativas.
                  <p className="mt-2 text-sm font-mono bg-gray-100 p-2 rounded">
                    Erro: {error.message}
                  </p>
                </AlertDescription>
              </Alert>
              {MOCK_OTHER_DEALS.map((deal) => (
                <ProductCard key={deal.id} {...deal} />
              ))}
            </>
          ) : mlProducts?.length ? (
            deals.map((deal) => (
              <ProductCard key={deal.id} {...deal} />
            ))
          ) : (
            <>
              <Alert className="col-span-full mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Informação</AlertTitle>
                <AlertDescription>
                  Nenhum produto encontrado na API do Mercado Livre. Verifique se sua conta está conectada corretamente.
                </AlertDescription>
              </Alert>
              {MOCK_OTHER_DEALS.map((deal) => (
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
