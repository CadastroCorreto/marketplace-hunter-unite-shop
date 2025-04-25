import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Store, User } from "lucide-react";
import Layout from '@/components/layout/Layout';
import FeaturedDeals from '@/components/home/FeaturedDeals';

const MARKETPLACES_LOGOS = [
  "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
  "https://logodownload.org/wp-content/uploads/2014/07/magazine-luiza-logo-0.png",
  "https://logodownload.org/wp-content/uploads/2017/03/americanas-logo-0.png",
  "https://logodownload.org/wp-content/uploads/2021/03/shopee-logo-0.png",
  "https://logodownload.org/wp-content/uploads/2019/07/aliexpress-logo-0.png"
];

const HomePage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-marketplace-yellow/20 to-marketplace-blue/10">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Encontre o melhor preço em todos os marketplaces
            </h1>
            <p className="text-lg text-gray-700">
              Conecte suas contas, compare preços, e encontre as melhores ofertas em um só lugar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/search">
                <Button size="lg" className="bg-marketplace-blue hover:bg-blue-600">
                  Buscar Produtos
                </Button>
              </Link>
              <Link to="/marketplaces">
                <Button size="lg" variant="outline">
                  Conectar Marketplaces
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl shadow-xl">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center p-2">
                  <img 
                    src={MARKETPLACES_LOGOS[i]} 
                    alt="Marketplace logo" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              ))}
              <div className="col-span-3 bg-gray-100 h-10 rounded-lg flex items-center justify-center px-4">
                <div className="w-full bg-marketplace-yellow h-2 rounded-full relative">
                  <div className="absolute w-4 h-4 bg-marketplace-blue rounded-full -top-1 left-1/4 transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-marketplace-blue text-white p-4 rounded-full shadow-lg">
              <Search className="h-6 w-6" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Deals Section */}
      <FeaturedDeals />
      
      {/* How it works section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              MarketHunter facilita a busca pelo melhor preço em apenas 3 etapas simples.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-marketplace-blue/10 flex items-center justify-center">
                  <Store className="h-8 w-8 text-marketplace-blue" />
                </div>
                <h3 className="text-xl font-bold">1. Conecte Marketplaces</h3>
                <p className="text-gray-600">
                  Conecte suas contas de marketplaces favoritos para acessar ofertas exclusivas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-marketplace-yellow/10 flex items-center justify-center">
                  <Search className="h-8 w-8 text-marketplace-yellow" />
                </div>
                <h3 className="text-xl font-bold">2. Busque Produtos</h3>
                <p className="text-gray-600">
                  Digite o que você procura e nós buscamos em todos os marketplaces de uma vez.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-marketplace-green/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-marketplace-green" />
                </div>
                <h3 className="text-xl font-bold">3. Compare e Compre</h3>
                <p className="text-gray-600">
                  Compare preços, fretes e condições para encontrar a melhor oferta para você.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-marketplace-blue/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para encontrar as melhores ofertas?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Comece agora conectando suas contas de marketplaces ou realizando sua primeira busca.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/marketplaces">
              <Button size="lg" className="bg-marketplace-blue hover:bg-blue-600">
                Conectar Marketplaces
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="outline">
                Buscar Produtos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
