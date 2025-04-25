import React from 'react';
import { Card } from "@/components/ui/card";
import ProductCard from '../search/ProductCard';
import { useMercadoLivre } from '@/hooks/useMercadoLivre';

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
  const { data: mlProducts, isLoading, error } = useMercadoLivre();
  
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
    freeShipping: mlProduct.shipping.free_shipping,
    rating: 4.8
  });

  const deals = [
    ...(mlProducts ? [formatMercadoLivreProduct(mlProducts[0])] : []),
    ...MOCK_OTHER_DEALS.slice(1)
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ofertas em Destaque</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Confira as melhores ofertas selecionadas dos principais marketplaces.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              Carregando ofertas...
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-8 text-red-600">
              Erro ao carregar ofertas do Mercado Livre
            </div>
          ) : (
            deals.map((deal) => (
              <ProductCard key={deal.id} {...deal} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
