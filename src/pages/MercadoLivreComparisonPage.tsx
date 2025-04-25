
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MercadoLivreProductTable from '@/components/marketplaces/MercadoLivreProductTable';
import { getAccessToken } from '@/hooks/useMercadoLivre';

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

interface SearchResponse {
  results: MercadoLivreProduct[];
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
      const accessToken = await getAccessToken();
      
      const url = new URL('https://api.mercadolibre.com/sites/MLB/search');
      url.searchParams.append('q', searchQuery);
      url.searchParams.append('sort', 'price_asc');
      url.searchParams.append('limit', '20');
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data: SearchResponse = await response.json();
      setProducts(data.results);
      
      console.log('Produtos encontrados:', data.results.length);
      
      toast({
        title: `${data.results.length} produtos encontrados`,
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
