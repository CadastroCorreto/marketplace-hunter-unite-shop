
import { useQuery } from '@tanstack/react-query';

interface MercadoLivreItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  shipping: {
    free_shipping: boolean;
  };
  original_price: number | null;
}

interface MercadoLivreResponse {
  results: MercadoLivreItem[];
}

const fetchFeaturedProducts = async () => {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?category=MLB1051&sort=relevance&limit=3'
  );
  
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos do Mercado Livre');
  }
  
  const data: MercadoLivreResponse = await response.json();
  return data.results;
};

export const useMercadoLivre = () => {
  return useQuery({
    queryKey: ['mercadoLivre', 'featured'],
    queryFn: fetchFeaturedProducts
  });
};
