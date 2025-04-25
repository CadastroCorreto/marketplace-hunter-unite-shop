
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FiltersSidebarProps {
  marketplaces: {
    id: string;
    name: string;
    isConnected?: boolean;
  }[];
  selectedMarketplaces: string[];
  onMarketplaceToggle: (id: string) => void;
  priceRange: [number, number];
  maxPrice: number;
  onPriceRangeChange: (range: [number, number]) => void;
  showOnlyConnected: boolean;
  onShowConnectedToggle: () => void;
  showOnlyFreeShipping: boolean;
  onFreeShippingToggle: () => void;
}

const FiltersSidebar = ({
  marketplaces,
  selectedMarketplaces,
  onMarketplaceToggle,
  priceRange,
  maxPrice,
  onPriceRangeChange,
  showOnlyConnected,
  onShowConnectedToggle,
  showOnlyFreeShipping,
  onFreeShippingToggle,
}: FiltersSidebarProps) => {
  return (
    <aside className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filtros</h3>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="connected-only" 
              checked={showOnlyConnected}
              onCheckedChange={onShowConnectedToggle}
            />
            <Label htmlFor="connected-only">Apenas marketplaces conectados</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="free-shipping" 
              checked={showOnlyFreeShipping}
              onCheckedChange={onFreeShippingToggle}
            />
            <Label htmlFor="free-shipping">Frete grátis</Label>
          </div>
        </div>
        
        <Accordion type="single" collapsible defaultValue="price">
          <AccordionItem value="price">
            <AccordionTrigger>Faixa de Preço</AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 px-1">
                <div className="mb-6">
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    min={0}
                    max={maxPrice}
                    step={10}
                    onValueChange={(value) => onPriceRangeChange([value[0], value[1]])}
                  />
                </div>
                
                <div className="flex justify-between">
                  <div className="text-sm">
                    R${priceRange[0].toFixed(2)}
                  </div>
                  <div className="text-sm">
                    R${priceRange[1].toFixed(2)}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="marketplaces">
            <AccordionTrigger>Marketplaces</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {marketplaces.map(marketplace => (
                  <div key={marketplace.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`marketplace-${marketplace.id}`}
                      checked={selectedMarketplaces.includes(marketplace.id)}
                      onCheckedChange={() => onMarketplaceToggle(marketplace.id)}
                    />
                    <Label 
                      htmlFor={`marketplace-${marketplace.id}`}
                      className="flex items-center"
                    >
                      {marketplace.name}
                      {marketplace.isConnected && (
                        <span className="ml-2 text-xs bg-marketplace-green text-white px-1.5 py-0.5 rounded">
                          Conectado
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
