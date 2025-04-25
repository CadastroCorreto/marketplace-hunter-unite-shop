
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

// Credenciais do Mercado Livre
const CLIENT_ID = '5508932736729572';
const CLIENT_SECRET = 'EiDuaVchmQNUoYsJoQQgjsZpWQYUNvQE';
const REDIRECT_URI = 'https://marketplace-hunter-unite-shop.lovable.app/callback/mercadolivre';

// Verifica se temos um token armazenado localmente
const getStoredToken = (): { access_token: string; expires_at: number; refresh_token: string } | null => {
  const tokenData = localStorage.getItem('ml_token_data');
  if (!tokenData) return null;
  
  try {
    const parsed = JSON.parse(tokenData);
    // Verifica se o token expirou
    if (parsed.expires_at && parsed.expires_at < Date.now()) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Erro ao recuperar token armazenado:', error);
    return null;
  }
};

// Armazena o token e informações relacionadas
const storeToken = (data: AuthResponse) => {
  const tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in * 1000),
    user_id: data.user_id
  };
  
  localStorage.setItem('ml_token_data', JSON.stringify(tokenData));
  return tokenData;
};

// Obtém o URL de autorização para o fluxo OAuth
export const getAuthorizationUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI
  });
  
  return `https://auth.mercadolibre.com.ar/authorization?${params.toString()}`;
};

// Troca o código de autorização por um token de acesso
const exchangeCodeForToken = async (code: string): Promise<AuthResponse> => {
  console.log('Trocando código por token...');
  
  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
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
    
    // Armazena o token e retorna os dados
    storeToken(data);
    return data;
  } catch (error) {
    console.error('Erro ao trocar código por token:', error);
    throw error;
  }
};

// Atualiza um token expirado usando o refresh token
const refreshAccessToken = async (refreshToken: string): Promise<AuthResponse> => {
  console.log('Atualizando token com refresh token...');
  
  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
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
    
    // Armazena o novo token e retorna os dados
    storeToken(data);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar token:', error);
    throw error;
  }
};

// Alternativa para quando o usuário não está autenticado via OAuth
const getClientCredentialsToken = async (): Promise<string> => {
  console.log('Obtendo token via client credentials...');
  
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

// Função para obter o token de acesso, com diferentes estratégias
const getAccessToken = async (): Promise<string> => {
  // 1. Verificar token armazenado
  const storedToken = getStoredToken();
  if (storedToken && storedToken.access_token) {
    console.log('Usando token armazenado');
    return storedToken.access_token;
  }
  
  // 2. Tentar atualizar com refresh token se disponível
  if (storedToken && storedToken.refresh_token) {
    try {
      console.log('Tentando atualizar com refresh token');
      const refreshedData = await refreshAccessToken(storedToken.refresh_token);
      return refreshedData.access_token;
    } catch (error) {
      console.error('Falha ao usar refresh token, recorrendo a client credentials');
      // Falha ao atualizar, limpar dados armazenados
      localStorage.removeItem('ml_token_data');
    }
  }
  
  // 3. Último recurso: usar client credentials
  return getClientCredentialsToken();
};

// Hook para processar o retorno da autenticação OAuth do Mercado Livre
export const useProcessMercadoLivreAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const processAuthCode = async () => {
      // Verifica se estamos na rota de callback e se há um código
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
      
      // Evita processamento duplicado
      if (isProcessing) return;
      setIsProcessing(true);
      
      try {
        await exchangeCodeForToken(code);
        
        // Opcional: Armazenar conexão no Supabase se o usuário estiver logado
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Implementar lógica para salvar a conexão no Supabase (opcional)
          // await saveConnectionToSupabase(session.user.id);
        }
        
        toast({
          title: "Conta conectada",
          description: "Sua conta do Mercado Livre foi conectada com sucesso!",
        });
        
        // Redireciona para a página principal ou de marketplaces
        navigate('/marketplaces');
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

// Verifica se o usuário está conectado ao Mercado Livre
export const useIsMercadoLivreConnected = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  useEffect(() => {
    const storedToken = getStoredToken();
    setIsConnected(!!storedToken);
    
    // Verificar a cada 5 minutos ou quando a janela receber foco
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

// Hook para desconectar a conta do Mercado Livre
export const useDisconnectMercadoLivre = () => {
  const { toast } = useToast();
  
  const disconnect = () => {
    localStorage.removeItem('ml_token_data');
    
    toast({
      title: "Conta desconectada",
      description: "Sua conta do Mercado Livre foi desconectada com sucesso.",
    });
    
    // Opcional: Remover a conexão no Supabase se o usuário estiver logado
  };
  
  return { disconnect };
};

// Hook principal para usar o Mercado Livre
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
