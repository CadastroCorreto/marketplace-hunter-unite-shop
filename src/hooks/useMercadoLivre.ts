
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";

import { fetchFeaturedProducts, fetchProductsByQuery } from '@/services/mercadoLivreApi';
import { 
  getAuthorizationUrl, 
  exchangeCodeForToken, 
  getStoredToken,
  refreshAccessToken,
  AuthTokenData
} from '@/services/mercadoLivreAuth';
import { supabase } from '@/integrations/supabase/client';

export const useProcessMercadoLivreAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const processAuthCode = async () => {
      if (!location.pathname.includes('/callback/mercadolivre')) return;
      
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (errorParam) {
        const errorMsg = errorDescription || "Houve um problema durante a autenticação com o Mercado Livre.";
        console.error('Erro retornado na URL:', errorMsg);
        setError(errorMsg);
        
        toast({
          title: "Erro na autenticação",
          description: errorMsg,
          variant: "destructive"
        });
        
        return;
      }
      
      if (!code) {
        const errorMsg = "Código de autorização não encontrado na URL de retorno.";
        console.error(errorMsg);
        setError(errorMsg);
        
        toast({
          title: "Erro na autenticação",
          description: errorMsg,
          variant: "destructive"
        });
        
        setTimeout(() => navigate('/connect/mercadolivre'), 2000);
        return;
      }
      
      if (isProcessing) return;
      setIsProcessing(true);
      
      try {
        console.log('Processando código de autorização:', code);
        await exchangeCodeForToken(code);
        
        toast({
          title: "Conta conectada",
          description: "Sua conta do Mercado Livre foi conectada com sucesso!",
        });
        
        setTimeout(() => navigate('/marketplaces'), 1500);
      } catch (error) {
        console.error('Erro ao processar autenticação:', error);
        const errorMsg = error instanceof Error ? error.message : "Não foi possível conectar ao Mercado Livre.";
        setError(errorMsg);
        
        toast({
          title: "Falha na conexão",
          description: errorMsg,
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    processAuthCode();
  }, [location, navigate, toast, isProcessing]);
  
  return { isProcessing, error };
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
        const errorMessage = error.message || 'Erro desconhecido ao buscar produtos';
        
        toast({
          title: "Erro na API do Mercado Livre",
          description: errorMessage,
          variant: "destructive"
        });
        
        console.error("Erro detalhado:", error);
      }
    }
  });
};

export const useIsMercadoLivreConnected = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  useEffect(() => {
    const checkToken = () => {
      const storedToken = getStoredToken();
      console.log('🔒 Verificando conexão do Mercado Livre:', !!storedToken);
      setIsConnected(!!storedToken);
    };
    
    checkToken(); // Verificação inicial
    
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
  const disconnect = () => {
    localStorage.removeItem('ml_token_data');
    
    toast.success("Conta desconectada com sucesso", {
      description: "Sua conta do Mercado Livre foi desconectada."
    });
  };
  
  return { disconnect };
};

// Hook para renovar tokens quando necessário com melhor feedback
export const useRefreshMercadoLivreToken = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState<Date | null>(null);
  
  const refreshToken = async (): Promise<AuthTokenData | null> => {
    const storedToken = getStoredToken();
    setIsRefreshing(true);
    
    if (!storedToken || !storedToken.refresh_token) {
      toast.error("Erro ao renovar token", {
        description: "Nenhum token disponível para renovação. Por favor, conecte sua conta novamente."
      });
      setIsRefreshing(false);
      return null;
    }
    
    try {
      console.log('Iniciando processo de renovação do token...');
      setLastRefreshAttempt(new Date());
      
      const newToken = await refreshAccessToken(storedToken.refresh_token);
      
      toast.success("Token renovado com sucesso", {
        description: "Seu acesso ao Mercado Livre foi renovado."
      });
      
      return newToken;
    } catch (error) {
      console.error('Erro detalhado na renovação do token:', error);
      
      // Extrair mensagem de erro mais detalhada
      let errorMessage = "Não foi possível renovar seu acesso.";
      
      if (error instanceof Error) {
        errorMessage += " " + error.message;
        
        // Verificar se é um erro de token inválido
        if (error.message.includes('invalid_grant') || error.message.includes('400')) {
          errorMessage = "O token de renovação expirou ou é inválido. Por favor, conecte sua conta novamente.";
          // Limpa o token armazenado pois não é mais válido
          localStorage.removeItem('ml_token_data');
        }
      }
      
      toast.error("Falha ao renovar token", {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return { refreshToken, isRefreshing, lastRefreshAttempt };
};

export { getAuthorizationUrl };
