
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { getAuthorizationUrl } from '@/hooks/useMercadoLivre';
import Layout from '@/components/layout/Layout';

const MercadoLivreAuthorizationPage = () => {
  const handleConnect = () => {
    window.location.href = getAuthorizationUrl();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Conectar Mercado Livre
            </CardTitle>
            <CardDescription>
              Conecte sua conta do Mercado Livre para acessar recursos exclusivos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Ao conectar sua conta do Mercado Livre, você poderá:
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Visualizar produtos em destaque</li>
              <li>Comparar preços em tempo real</li>
              <li>Acompanhar tendências de mercado</li>
            </ul>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Não se preocupe, não compartilharemos suas informações pessoais.
              </p>
              <Button 
                onClick={handleConnect} 
                className="w-full"
                variant="default"
              >
                <img 
                  src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo-small.png"
                  alt="Mercado Livre" 
                  className="w-6 h-6 mr-2" 
                />
                Conectar com Mercado Livre
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MercadoLivreAuthorizationPage;
