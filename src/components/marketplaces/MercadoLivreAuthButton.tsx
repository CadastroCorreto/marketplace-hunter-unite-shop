
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  getAuthorizationUrl, 
  useIsMercadoLivreConnected, 
  useDisconnectMercadoLivre,
  useRefreshMercadoLivreToken
} from '@/hooks/useMercadoLivre';
import { ShoppingBag, Download, ExternalLink, RefreshCw, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { generateDebugJson, checkTokenStatus } from '@/utils/debugExport';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

const MercadoLivreAuthButton = () => {
  const isConnected = useIsMercadoLivreConnected();
  const { disconnect } = useDisconnectMercadoLivre();
  const { refreshToken, isRefreshing } = useRefreshMercadoLivreToken();
  const navigate = useNavigate();
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const tokenStatus = checkTokenStatus();
  
  const handleAuth = () => {
    if (isConnected) {
      disconnect();
    } else {
      // Redirecionamos para a página de explicação em vez de diretamente para o Mercado Livre
      navigate('/connect/mercadolivre');
    }
  };
  
  const handleExportDebug = () => {
    const debugData = generateDebugJson();
    toast.success("Dados de debug exportados com sucesso");
  };
  
  const handleRefreshToken = async () => {
    const result = await refreshToken();
    if (result) {
      setShowTokenInfo(true); // Mostrar informações atualizadas após renovar
    }
  };
  
  const getTokenStatusColor = () => {
    if (!tokenStatus.valid) return "text-red-500";
    if (tokenStatus.minutesRemaining && tokenStatus.minutesRemaining < 30) return "text-amber-500";
    return "text-green-500";
  };

  const getTokenStatusIcon = () => {
    if (!tokenStatus.valid) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (tokenStatus.minutesRemaining && tokenStatus.minutesRemaining < 30) return <Info className="w-5 h-5 text-amber-500" />;
    return <Info className="w-5 h-5 text-green-500" />;
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
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
        
        {isConnected && (
          <Button
            onClick={handleRefreshToken}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Renovando...' : 'Renovar Token'}
          </Button>
        )}
        
        <Button
          onClick={handleExportDebug}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Debug
        </Button>
        
        {isConnected && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTokenInfo(!showTokenInfo)}
                  className={getTokenStatusColor()}
                >
                  {getTokenStatusIcon()}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Informações do token</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {showTokenInfo && isConnected && (
        <div className={`text-sm p-3 border rounded-md ${!tokenStatus.valid ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
          <div className="flex items-start gap-2">
            {!tokenStatus.valid && (
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h4 className="font-medium">Status do Token</h4>
              <p className={getTokenStatusColor()}>
                {tokenStatus.message}
              </p>
              {tokenStatus.valid && tokenStatus.expiresAt && (
                <p className="text-gray-500 text-xs mt-1">
                  Expira em: {tokenStatus.expiresAt}
                </p>
              )}
              {!tokenStatus.valid && tokenStatus.error === 'TOKEN_EXPIRED' && tokenStatus.canRefresh && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshToken}
                  className="mt-2 text-xs h-7"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Renovar agora
                </Button>
              )}
              {!tokenStatus.valid && (tokenStatus.error === 'TOKEN_MISSING' || !tokenStatus.canRefresh) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/connect/mercadolivre')}
                  className="mt-2 text-xs h-7"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Conectar novamente
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MercadoLivreAuthButton;
