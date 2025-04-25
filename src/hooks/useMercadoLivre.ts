import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const CLIENT_ID = '652659079305130';
const CLIENT_SECRET = 'bcHDdHFAijKYPA7s3C73oHmr2U9tSIlP';
const REDIRECT_URI = 'https://marketplace-hunter-unite-shop.lovable.app/callback/mercadolivre';

const getStoredToken = (): { access_token: string; expires_at: number; refresh_token: string } | null => {
  const tokenData = localStorage.getItem('ml_token_data');
  if (!tokenData) return null;
  
  try {
    const parsed = JSON.parse(tokenData);
    if (parsed.expires_at && parsed.expires_at < Date.now()) {
      console.log('Token expirado, precisa renovar');
      return null;
    }
    console.log('Token válido encontrado no localStorage');
    return parsed;
  } catch (error) {
    console.error('Erro ao recuperar token armazenado:', error);
    return null;
  }
};

const storeToken = (data: AuthResponse) => {
  const tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in * 1000),
    user_id: data.user_id
  };
  
  console.log('Armazenando novo token, válido até:', new Date(tokenData.expires_at).toLocaleString());
  localStorage.setItem('ml_token_data', JSON.stringify(tokenData));
  return tokenData;
};

export const getAuthorizationUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI
  });
  
  const authUrl = `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;
  console.log('URL de autorização gerada:', authUrl);
  return authUrl;
};

const exchangeCodeForToken = async (code: string): Promise<AuthResponse> => {
  console.log('Trocando código por token...');
  
  try {
    const response = await fetch('https://api.mercadolivre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Falha na troca do código:', response.status, errorText);
      throw new Error(`Falha ao obter token de acesso: ${response.status} - ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    console.log('Token obtido com sucesso via código de autorização');
    
    storeToken(data);
    return data;
  } catch (error) {
    console.error('Erro ao trocar código por token:', error);
    throw error;
  }
};

const refreshAccessToken = async (refreshToken: string): Promise<AuthResponse> => {
  console.log('Atualizando token com refresh token...');
  
  try {
    const response = await fetch('https://api.mercadolivre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Falha ao atualizar token:', response.status, errorText);
      throw new Error(`Falha ao atualizar token: ${response.status} - ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    console.log('Token atualizado com sucesso');
    
    storeToken(data);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar token:', error);
    throw error;
  }
};

const getClientCredentialsToken = async (): Promise<string> => {
  console.log('Obtendo token via client credentials...');
  
  try {
    const response = await fetch('https://api.mercadolivre.com/oauth/token', {
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
      console.error('Falha na autenticação via client credentials:', response.status, errorText);
      throw new Error(`Falha ao obter token de acesso: ${response.status} - ${errorText}`);
    }

    const data: AuthResponse = await response.json();
    console.log('Token obtido via client credentials:', data.access_token.substring(0, 10) + '...');
    return data.access_token;
  } catch (error) {
    console.error('Erro ao obter token via client credentials:', error);
    throw error;
  }
};

const getAccessToken = async (): Promise<string> => {
  const storedToken = getStoredToken();
  if (storedToken && storedToken.access_token) {
    console.log('Usando token armazenado');
    return storedToken.access_token;
  }
  
  if (storedToken && storedToken.refresh_token) {
    try {
      console.log('Tentando atualizar com refresh token');
      const refreshedData = await refreshAccessToken(storedToken.refresh_token);
      return refreshedData.access_token;
    } catch (error) {
      console.error('Falha ao usar refresh token, recorrendo a client credentials');
      localStorage.removeItem('ml_token_data');
    }
  }
  
  return getClientCredentialsToken();
};

export const useProcessMercadoLivreAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const processAuthCode = async () => {
      if (!location.pathname.includes('/callback/mercadolivre')) {
        return;
      }
      
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      
      if (!code) {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        if (error) {
          toast({
            title: "Erro na autenticação",
            description: errorDescription || "Houve um problema durante a autenticação com o Mercado Livre.",
            variant: "destructive"
          });
        }
        navigate('/');
        return;
      }
      
      if (isProcessing) return;
      setIsProcessing(true);
      
      try {
        console.log('Processando código de autorização:', code);
        await exchangeCodeForToken(code);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          toast({
            title: "Conta conectada",
            description: "Sua conta do Mercado Livre foi conectada com sucesso!",
          });
          navigate('/marketplaces');
        }
      } catch (error) {
        console.error('Erro ao processar autenticação:', error);
        toast({
          title: "Falha na conexão",
          description: error instanceof Error ? error.message : "Não foi possível conectar ao Mercado Livre.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsProcessing(false);
      }
    };
    
    processAuthCode();
  }, [location, navigate, toast, isProcessing]);
  
  return { isProcessing };
};

const fetchFeaturedProducts = async () => {
  try {
    console.log('Iniciando busca de produtos em destaque...');
    const accessToken = await getAccessToken();
    
    console.log('Token obtido, buscando produtos...');
    const response = await fetch(
      'https://api.mercadolibre.com/trends/MLB',
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
    
    const trends = await response.json();
    
    if (!trends || !trends.length) {
      console.log('Nenhuma tendência encontrada, retornando array vazio');
      return [];
    }
    
    const firstThreeTrends = trends.slice(0, 3);
    
    const productDetailsPromises = firstThreeTrends.map(async (trend: any) => {
      const keyword = trend.keyword;
      const searchResponse = await fetch(
        `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(keyword)}&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );
      
      if (!searchResponse.ok) {
        console.error(`Erro ao buscar detalhes para ${keyword}`);
        return null;
      }
      
      const searchData = await searchResponse.json();
      return searchData.results[0];
    });
    
    const productsDetails = await Promise.all(productDetailsPromises);
    const validProducts = productsDetails.filter(product => product !== null);
    
    console.log('Produtos obtidos com sucesso:', validProducts.length);
    return validProducts;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const useIsMercadoLivreConnected = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  useEffect(() => {
    const storedToken = getStoredToken();
    setIsConnected(!!storedToken);
    
    const checkToken = () => {
      const currentToken = getStoredToken();
      setIsConnected(!!currentToken);
    };
    
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    window.addEventListener('focus', checkToken);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkToken);
    };
  }, []);
  
  return isConnected;
};

export const useDisconnectMercadoLivre = () => {
  const { toast } = useToast();
  
  const disconnect = () => {
    localStorage.removeItem('ml_token_data');
    
    toast({
      title: "Conta desconectada",
      description: "Sua conta do Mercado Livre foi desconectada com sucesso.",
    });
  };
  
  return { disconnect };
};

export const useMercadoLivre = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['mercadoLivre', 'featured'],
    queryFn: fetchFeaturedProducts,
    retry: 2,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
