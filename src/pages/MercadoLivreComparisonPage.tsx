
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MercadoLivreProductTable from '@/components/marketplaces/MercadoLivreProductTable';
import { fetchProductsByQuery } from '@/services/mercadoLivreApi';

interface MercadoLivreProduct {
  id: string;
  title: string;
  price: number;
  permalink: string;
  seller: {
    id: string;
    nickname: string;
  };
  shipping: {
    free_shipping: boolean;
  };
  thumbnail: string;
}

const MercadoLivreComparisonPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<MercadoLivreProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const data = await fetchProductsByQuery(searchQuery);
      setProducts(data);
      
      console.log('Produtos encontrados:', data.length);
      
      toast({
        title: `${data.length} produtos encontrados`,
        description: `Resultados para "${searchQuery}" ordenados por menor preço`,
      });
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro ao buscar produtos",
        description: error instanceof Error ? error.message : "Não foi possível buscar os produtos",
        variant: "destructive"
      });
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Comparador de Preços - Mercado Livre</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Produtos</CardTitle>
            <CardDescription>
              Digite o nome do produto para comparar preços no Mercado Livre
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Nome do produto (ex: smartphone, geladeira, tênis)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 py-6"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !searchQuery.trim()} 
                className="bg-marketplace-blue hover:bg-blue-600"
              >
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {hasSearched && (
          <Card>
            <CardHeader>
              <CardTitle>
                {isLoading ? "Buscando..." : products.length > 0 
                  ? `Resultados para "${searchQuery}"` 
                  : "Sem resultados"}
              </CardTitle>
              {products.length > 0 && (
                <CardDescription>
                  Encontramos {products.length} produtos ordenados por menor preço
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <MercadoLivreProductTable products={products} isLoading={isLoading} />
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default MercadoLivreComparisonPage;
