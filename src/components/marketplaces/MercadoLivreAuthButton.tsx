
import React from 'react';
import { Button } from "@/components/ui/button";
import { getAuthorizationUrl, useIsMercadoLivreConnected, useDisconnectMercadoLivre } from '@/hooks/useMercadoLivre';
import { ShoppingBag, Download, ExternalLink } from "lucide-react";
import { generateDebugJson } from '@/utils/debugExport';
import { useNavigate } from 'react-router-dom';

const MercadoLivreAuthButton = () => {
  const isConnected = useIsMercadoLivreConnected();
  const { disconnect } = useDisconnectMercadoLivre();
  const navigate = useNavigate();
  
  const handleAuth = () => {
    if (isConnected) {
      disconnect();
    } else {
      // Redirecionamos para a página de explicação em vez de diretamente para o Mercado Livre
      navigate('/connect/mercadolivre');
    }
  };
  
  const handleExportDebug = () => {
    generateDebugJson();
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleAuth}
        variant={isConnected ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        {isConnected ? (
          <>
            <ShoppingBag className="w-5 h-5" />
            Desconectar Mercado Livre
          </>
        ) : (
          <>
            <img 
              src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo-small.png"
              alt="Mercado Livre" 
              className="w-6 h-6" 
            />
            Conectar ao Mercado Livre
          </>
        )}
      </Button>
      
      <Button
        onClick={handleExportDebug}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Download className="w-5 h-5" />
        Exportar Debug
      </Button>
    </div>
  );
};

export default MercadoLivreAuthButton;
