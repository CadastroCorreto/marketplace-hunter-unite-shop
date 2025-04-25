
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

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

// Configurações da API do Mercado Livre
const ML_CONFIG = {
  client_id: '8588307915989482',
  client_secret: 'MpgbEcbJR1f4WX2D5incLGuMOga2JgTm',
};

const fetchFeaturedProducts = async () => {
  try {
    // Primeiro obtemos o token de acesso
    const tokenResponse = await fetch(
      'https://api.mercadolibre.com/oauth/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: ML_CONFIG.client_id,
          client_secret: ML_CONFIG.client_secret,
        }),
      }
    );

    if (!tokenResponse.ok) {
      console.error('Erro ao obter token:', await tokenResponse.text());
      // Fallback para API pública caso falhe a autenticação
      return fetchPublicFeaturedProducts();
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Agora fazemos a requisição com o token
    const response = await fetch(
      'https://api.mercadolibre.com/sites/MLB/search?category=MLB1051&sort=relevance&limit=3',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Erro na requisição autenticada:', await response.text());
      return fetchPublicFeaturedProducts();
    }

    const data: MercadoLivreResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar produtos com autenticação:', error);
    // Em caso de erro, tentamos a API pública
    return fetchPublicFeaturedProducts();
  }
};

// Método alternativo usando API pública sem autenticação
const fetchPublicFeaturedProducts = async () => {
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?category=MLB1051&sort=relevance&limit=3',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    console.error('Erro na requisição pública:', await response.text());
    throw new Error('Falha ao buscar produtos do Mercado Livre');
  }
  
  const data: MercadoLivreResponse = await response.json();
  return data.results;
};

export const useMercadoLivre = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['mercadoLivre', 'featured'],
    queryFn: fetchFeaturedProducts,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos do Mercado Livre",
          variant: "destructive"
        });
        console.error("Erro ao buscar produtos:", error);
      }
    }
  });
};
