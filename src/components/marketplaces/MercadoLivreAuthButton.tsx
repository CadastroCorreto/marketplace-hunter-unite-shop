
import React from 'react';
import { Button } from "@/components/ui/button";
import { getAuthorizationUrl, useIsMercadoLivreConnected, useDisconnectMercadoLivre } from '@/hooks/useMercadoLivre';

const MercadoLivreAuthButton = () => {
  const isConnected = useIsMercadoLivreConnected();
  const { disconnect } = useDisconnectMercadoLivre();
  
  const handleAuth = () => {
    if (isConnected) {
      disconnect();
    } else {
      // Redireciona para a página de autorização do Mercado Livre
      window.location.href = getAuthorizationUrl();
    }
  };
  
  return (
    <Button 
      onClick={handleAuth}
      variant={isConnected ? "destructive" : "default"}
      className="flex items-center gap-2"
    >
      <img 
        src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo-small.png"
        alt="Mercado Livre" 
        className="w-6 h-6" 
      />
      {isConnected ? "Desconectar Mercado Livre" : "Conectar ao Mercado Livre"}
    </Button>
  );
};

export default MercadoLivreAuthButton;
