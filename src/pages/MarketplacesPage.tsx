
import React, { useState } from 'react';
import { toast } from "sonner";
import Layout from '@/components/layout/Layout';
import MarketplaceCard from '@/components/marketplaces/MarketplaceCard';

// Mock marketplace data
const MARKETPLACES = [
  {
    id: "mercado-livre",
    name: "Mercado Livre",
    logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png",
    description: "O maior marketplace da América Latina, com milhões de produtos disponíveis.",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png",
    description: "Maior loja online do mundo, com produtos em diversas categorias.",
  },
  {
    id: "magazine-luiza",
    name: "Magazine Luiza",
    logo: "https://logodownload.org/wp-content/uploads/2014/07/magazine-luiza-logo-0.png",
    description: "Uma das maiores redes varejistas do Brasil, com ênfase em eletrodomésticos e eletrônicos.",
  },
  {
    id: "americanas",
    name: "Americanas",
    logo: "https://logodownload.org/wp-content/uploads/2017/03/americanas-logo-0.png",
    description: "Plataforma multicanal com enorme variedade de produtos e departamentos.",
  },
  {
    id: "shopee",
    name: "Shopee",
    logo: "https://logodownload.org/wp-content/uploads/2021/03/shopee-logo-0.png",
    description: "Plataforma de e-commerce que oferece uma ampla variedade de produtos a preços competitivos.",
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    logo: "https://logodownload.org/wp-content/uploads/2019/07/aliexpress-logo-0.png",
    description: "Plataforma global de varejo online, que permite comprar diretamente de fabricantes e distribuidores na China.",
  },
];

const MarketplacesPage = () => {
  const [connectedMarketplaces, setConnectedMarketplaces] = useState<string[]>([]);

  const handleConnect = (id: string) => {
    // In a real app, this would trigger OAuth flow or redirect to a login page
    // For now, we'll just add it to our connected marketplaces state
    toast.success(`Marketplace ${id} conectado com sucesso!`);
    setConnectedMarketplaces([...connectedMarketplaces, id]);
  };

  const handleDisconnect = (id: string) => {
    toast.info(`Marketplace ${id} desconectado.`);
    setConnectedMarketplaces(connectedMarketplaces.filter(marketplaceId => marketplaceId !== id));
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Conecte seus Marketplaces</h1>
          <p className="text-gray-600">
            Conecte suas contas de marketplaces para acessar ofertas exclusivas e gerenciar suas compras em um só lugar.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETPLACES.map(marketplace => (
            <MarketplaceCard
              key={marketplace.id}
              {...marketplace}
              isConnected={connectedMarketplaces.includes(marketplace.id)}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default MarketplacesPage;
