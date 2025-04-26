import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { fetchFeaturedProducts, fetchProductsByQuery } from '@/services/mercadoLivreApi';
import { 
  getAuthorizationUrl, 
  exchangeCodeForToken, 
  getStoredToken 
} from '@/services/mercadoLivreAuth';
import { supabase } from '@/integrations/supabase/client';

export const useProcessMercadoLivreAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const processAuthCode = async () => {
      if (!location.pathname.includes('/callback/mercadolivre')) return;
      
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

export { getAuthorizationUrl };
