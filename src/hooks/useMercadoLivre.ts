
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

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
}

const CLIENT_ID = '8929831647860533';
const CLIENT_SECRET = 'YlqxRH5mfavRBWJLZhFv5ppZxDJFgEgD';

const getAccessToken = async (): Promise<string> => {
  const response = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });

  if (!response.ok) {
    throw new Error('Falha ao obter token de acesso');
  }

  const data: AuthResponse = await response.json();
  return data.access_token;
};

const fetchFeaturedProducts = async () => {
  const accessToken = await getAccessToken();
  
  const response = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?category=MLB1051&sort=relevance&limit=3',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    }
  );
  
  if (!response.ok) {
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

