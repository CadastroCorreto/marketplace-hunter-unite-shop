
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

// APP tradicional (Server-side)
// Suas credenciais do Mercado Livre - atualizadas para as novas credenciais
// IMPORTANTE: Para aplicações front-end, considere usar o método de autorização apropriado
// ou mover esta lógica para um backend
const CLIENT_ID = '5508932736729572';
const CLIENT_SECRET = 'EiDuaVchmQNUoYsJoQQgjsZpWQYUNvQE';

const getAccessToken = async (): Promise<string> => {
  console.log('Tentando obter token de acesso do Mercado Livre...');
  
  try {
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
      const errorText = await response.text();
      console.error('Falha na autenticação:', response.status, errorText);
      throw new Error(`Falha ao obter token de acesso: ${response.status} - ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    console.log('Token de acesso obtido com sucesso:', data.access_token.substring(0, 10) + '...');
    return data.access_token;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    throw error;
  }
};

const fetchFeaturedProducts = async () => {
  try {
    console.log('Iniciando busca de produtos em destaque...');
    const accessToken = await getAccessToken();
    
    console.log('Token obtido, buscando produtos...');
    const response = await fetch(
      'https://api.mercadolibre.com/sites/MLB/search?category=MLB1051&sort=relevance&limit=3',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta da API:', response.status, errorText);
      throw new Error(`Falha ao buscar produtos: ${response.status} - ${errorText}`);
    }
    
    const data: MercadoLivreResponse = await response.json();
    console.log('Produtos obtidos com sucesso:', data.results.length);
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
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
          title: "Erro na API do Mercado Livre",
          description: `${error.message}. Verifique as credenciais e permissões.`,
          variant: "destructive"
        });
        console.error("Erro detalhado:", error);
      }
    }
  });
};
