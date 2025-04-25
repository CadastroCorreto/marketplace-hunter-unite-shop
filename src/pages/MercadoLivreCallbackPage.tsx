
import React from 'react';
import { useProcessMercadoLivreAuth } from '@/hooks/useMercadoLivre';
import Layout from '@/components/layout/Layout';

const MercadoLivreCallbackPage = () => {
  const { isProcessing } = useProcessMercadoLivreAuth();
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Processando autenticação</h1>
          
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="text-gray-600">
                Estamos processando sua autenticação com o Mercado Livre...
              </p>
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
