
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Product } from '@/hooks/useMercadoLivre';
import { searchProducts } from '@/services/mercadoLivreApi';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const MercadoLivreComparisonPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Por favor, digite um termo de busca');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await searchProducts(searchQuery);
      setProducts(data);
      
      if (data.length === 0) {
        toast.info('Nenhum produto encontrado');
      } else {
        toast.success(`${data.length} produtos encontrados`);
      }
    } catch (error) {
      console.error('🚨 Erro ao buscar produtos:', error);
      setError(error instanceof Error ? error.message : 'Erro de conexão com a API. Verifique se o servidor está online.');
      toast.error('Erro ao buscar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Busca no Mercado Livre</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Produtos</CardTitle>
            <CardDescription>
              Digite o nome do produto para buscar no Mercado Livre
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

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <div className="relative pt-[100%]">
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
              </div>
              <CardContent className="flex-1 p-4">
                <h3 className="font-medium text-lg mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xl font-bold">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="ml-2"
                  >
                    <a href={product.permalink} target="_blank" rel="noopener noreferrer">
                      Ver Oferta
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && searchQuery && !isLoading && !error && (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhum produto encontrado para "{searchQuery}"</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MercadoLivreComparisonPage;
