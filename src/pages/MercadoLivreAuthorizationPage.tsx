
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuthorizationUrl } from '@/hooks/useMercadoLivre';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const MercadoLivreAuthorizationPage = () => {
  const handleConnect = () => {
    // Abre em uma nova aba para evitar problemas de redirecionamento
    window.open(getAuthorizationUrl(), "_blank");
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
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Importante!</AlertTitle>
              <AlertDescription>
                Certifique-se de estar logado na sua conta do Mercado Livre antes de continuar.
              </AlertDescription>
            </Alert>

            <p>
              Ao conectar sua conta do Mercado Livre, você poderá:
            </p>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Visualizar produtos em destaque</li>
              <li>Comparar preços em tempo real</li>
              <li>Acompanhar tendências de mercado</li>
            </ul>

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Após autorizar, você será redirecionado de volta para nosso site. Se encontrar problemas,
                você pode voltar para esta página e tentar novamente.
              </p>
              <Button 
                onClick={handleConnect} 
                className="w-full"
                size="lg"
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
          <CardFooter className="flex justify-center border-t pt-4">
            <Link to="/marketplaces" className="text-sm text-muted-foreground hover:text-primary">
              Voltar para marketplaces
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default MercadoLivreAuthorizationPage;
