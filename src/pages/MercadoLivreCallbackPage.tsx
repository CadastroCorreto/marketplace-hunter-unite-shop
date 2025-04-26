
import React from 'react';
import { useProcessMercadoLivreAuth } from '@/hooks/useMercadoLivre';
import Layout from '@/components/layout/Layout';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MercadoLivreCallbackPage = () => {
  const { isProcessing, error } = useProcessMercadoLivreAuth();
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Processando autenticação</h1>
          
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-gray-600">
                Estamos processando sua autenticação com o Mercado Livre...
              </p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro na autenticação</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
              <div className="pt-4">
                <Button asChild>
                  <Link to="/connect/mercadolivre">
                    Tentar novamente
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              Você será redirecionado em instantes...
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MercadoLivreCallbackPage;
