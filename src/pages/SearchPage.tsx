
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SearchForm from '@/components/search/SearchForm';
import ProductCard from '@/components/search/ProductCard';
import FiltersSidebar from '@/components/search/FiltersSidebar';
import { Separator } from '@/components/ui/separator';

// Mock marketplace data
const MARKETPLACES = [
  { id: "mercado-livre", name: "Mercado Livre", logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png", isConnected: true },
  { id: "amazon", name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" },
  { id: "magazine-luiza", name: "Magazine Luiza", logo: "https://logodownload.org/wp-content/uploads/2014/07/magazine-luiza-logo-0.png", isConnected: true },
  { id: "americanas", name: "Americanas", logo: "https://logodownload.org/wp-content/uploads/2017/03/americanas-logo-0.png" },
  { id: "shopee", name: "Shopee", logo: "https://logodownload.org/wp-content/uploads/2021/03/shopee-logo-0.png" },
  { id: "aliexpress", name: "AliExpress", logo: "https://logodownload.org/wp-content/uploads/2019/07/aliexpress-logo-0.png" },
];

// Mock products data
const mockProductImages = [
  "https://http2.mlstatic.com/D_NQ_NP_2X_601010-MLU69793276453_062023-F.webp",
  "https://http2.mlstatic.com/D_NQ_NP_2X_963302-MLU72535748608_102023-F.webp",
  "https://http2.mlstatic.com/D_NQ_NP_2X_735281-MLU72648617369_112023-F.webp",
  "https://http2.mlstatic.com/D_NQ_NP_2X_728596-MLU72604510323_112023-F.webp",
  "https://http2.mlstatic.com/D_NQ_NP_2X_769604-MLU72604544267_112023-F.webp",
  "https://http2.mlstatic.com/D_NQ_NP_2X_837043-MLU54966461636_042023-F.webp",
  "https://http2.mlstatic.com/D_NQ_NP_2X_918123-MLU69722261174_062023-F.webp",
  "https://http2.mlstatic.com/D_NQ_NP_714211-MLB69641287722_052023-O.webp"
];

const generateMockResults = (query: string) => {
  // Generate random products based on query
  const results = [];
  const productsCount = Math.floor(Math.random() * 12) + 8; // 8-20 products
  
  for (let i = 0; i < productsCount; i++) {
    const price = Math.floor(Math.random() * 3000) + 100;
    const discount = Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 5 : 0;
    const marketplace = MARKETPLACES[Math.floor(Math.random() * MARKETPLACES.length)];
    
    results.push({
      id: `product-${i}`,
      title: `${query} ${i + 1} - ${marketplace.name} ${Math.random() > 0.5 ? 'Premium' : 'Special'} Edition`,
      price: price - (price * (discount / 100)),
      image: mockProductImages[i % mockProductImages.length],
      marketplace: {
        id: marketplace.id,
        name: marketplace.name,
        logo: marketplace.logo
      },
      discount: discount,
      freeShipping: Math.random() > 0.5,
      rating: Math.floor(Math.random() * 50) / 10 + 1
    });
  }
  
  return results;
};

const SearchPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState(() => initialQuery ? generateMockResults(initialQuery) : []);
  
  // Filters state
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const maxPrice = 5000;
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [showOnlyConnected, setShowOnlyConnected] = useState(false);
  const [showOnlyFreeShipping, setShowOnlyFreeShipping] = useState(false);
  
  const handleSearch = (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    
    // Simulate search delay
    setTimeout(() => {
      setProducts(generateMockResults(query));
      setIsLoading(false);
    }, 1000);
  };
  
  const handleMarketplaceToggle = (id: string) => {
    setSelectedMarketplaces(prev => 
      prev.includes(id) 
        ? prev.filter(mId => mId !== id)
        : [...prev, id]
    );
  };
  
  // Apply filters to products
  const filteredProducts = products.filter(product => {
    // Filter by selected marketplaces
    if (selectedMarketplaces.length > 0 && !selectedMarketplaces.includes(product.marketplace.id)) {
      return false;
    }
    
    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Filter by connected marketplaces
    if (showOnlyConnected) {
      const marketplace = MARKETPLACES.find(m => m.id === product.marketplace.id);
      if (!marketplace?.isConnected) {
        return false;
      }
    }
    
    // Filter by free shipping
    if (showOnlyFreeShipping && !product.freeShipping) {
      return false;
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>
        
        {searchQuery ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {isLoading ? 'Buscando...' : `Resultados para "${searchQuery}"`}
              </h2>
              {!isLoading && (
                <p className="text-gray-500">
                  Encontramos {filteredProducts.length} produtos em {MARKETPLACES.length} marketplaces
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <FiltersSidebar
                  marketplaces={MARKETPLACES}
                  selectedMarketplaces={selectedMarketplaces}
                  onMarketplaceToggle={handleMarketplaceToggle}
                  priceRange={priceRange}
                  maxPrice={maxPrice}
                  onPriceRangeChange={setPriceRange}
                  showOnlyConnected={showOnlyConnected}
                  onShowConnectedToggle={() => setShowOnlyConnected(!showOnlyConnected)}
                  showOnlyFreeShipping={showOnlyFreeShipping}
                  onFreeShippingToggle={() => setShowOnlyFreeShipping(!showOnlyFreeShipping)}
                />
              </div>
              
              <div className="lg:col-span-3">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div 
                        key={i}
                        className="bg-gray-100 h-80 rounded-md animate-pulse-slow"
                      />
                    ))}
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} {...product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
                    <p className="text-gray-500">
                      Tente ajustar seus filtros ou fazer uma nova busca.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">O que você deseja encontrar?</h2>
            <p className="text-gray-600 mb-4">
              Digite um produto acima para buscar em todos os marketplaces conectados.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
