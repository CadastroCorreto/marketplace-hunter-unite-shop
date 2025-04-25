
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';

// Mock connected marketplaces
const CONNECTED_MARKETPLACES = [
  {
    id: "mercado-livre",
    name: "Mercado Livre",
    logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png",
    username: "usuario_ml",
    connectedAt: "2023-10-15",
  },
  {
    id: "magazine-luiza",
    name: "Magazine Luiza",
    logo: "https://logodownload.org/wp-content/uploads/2014/07/magazine-luiza-logo-0.png",
    username: "usuario_magalu",
    connectedAt: "2023-11-22",
  }
];

// Mock search history
const SEARCH_HISTORY = [
  { id: "1", query: "iPhone 13", date: "2023-12-01", results: 42 },
  { id: "2", query: "Samsung TV", date: "2023-11-28", results: 37 },
  { id: "3", query: "Playstation 5", date: "2023-11-25", results: 18 },
  { id: "4", query: "Air Fryer", date: "2023-11-20", results: 53 },
];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('marketplaces');
  
  const handleDisconnect = (id: string) => {
    console.log(`Desconectar marketplace: ${id}`);
    // Em uma aplicação real, isso enviaria uma requisição para desconectar o marketplace
  };
  
  const handleClearHistory = () => {
    console.log('Limpar histórico');
    // Em uma aplicação real, isso enviaria uma requisição para limpar o histórico
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Minha Conta</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marketplaces">Marketplaces Conectados</TabsTrigger>
            <TabsTrigger value="history">Histórico de Buscas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplaces" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONNECTED_MARKETPLACES.map(marketplace => (
                <Card key={marketplace.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          <img 
                            src={marketplace.logo} 
                            alt={marketplace.name} 
                            className="h-full w-full object-contain p-1" 
                          />
                        </div>
                        <div>
                          <CardTitle>{marketplace.name}</CardTitle>
                          <CardDescription>
                            Conectado em {new Date(marketplace.connectedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <Badge className="bg-marketplace-green">Conectado</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Usuário: {marketplace.username}
                      </p>
                      
                      <Button 
                        variant="outline" 
                        className="border-red-300 text-red-500 hover:bg-red-50"
                        onClick={() => handleDisconnect(marketplace.id)}
                      >
                        Desconectar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                className="bg-marketplace-blue hover:bg-blue-600"
                onClick={() => window.location.href = "/marketplaces"}
              >
                Adicionar Novo Marketplace
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Histórico de Buscas</CardTitle>
                  <Button 
                    variant="outline"
                    onClick={handleClearHistory}
                  >
                    Limpar Histórico
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {SEARCH_HISTORY.length > 0 ? (
                  <div className="divide-y">
                    {SEARCH_HISTORY.map(item => (
                      <div key={item.id} className="py-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">"{item.query}"</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()} • {item.results} resultados
                          </p>
                        </div>
                        
                        <Button 
                          variant="ghost"
                          onClick={() => window.location.href = `/search?q=${encodeURIComponent(item.query)}`}
                        >
                          Repetir Busca
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-gray-500">
                    Você ainda não realizou nenhuma busca.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountPage;
