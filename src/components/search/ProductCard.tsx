
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  marketplace: {
    id: string;
    name: string;
    logo: string;
  };
  discount?: number;
  freeShipping?: boolean;
  rating?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const ProductCard = ({
  id,
  title,
  price,
  image,
  marketplace,
  discount,
  freeShipping,
  rating,
}: ProductCardProps) => {
  const originalPrice = discount ? price / (1 - discount / 100) : price;
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative pt-[75%] overflow-hidden bg-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="absolute top-0 left-0 w-full h-full object-contain p-4" 
        />
        
        {discount && discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-marketplace-red">
            -{discount}%
          </Badge>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute top-2 right-2 h-8 w-8 rounded-full overflow-hidden bg-white shadow flex items-center justify-center">
                <img 
                  src={marketplace.logo} 
                  alt={marketplace.name} 
                  className="h-6 w-6 object-contain" 
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{marketplace.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <CardContent className="flex-grow p-4">
        <h3 className="font-medium text-base line-clamp-2 mb-2">{title}</h3>
        
        <div className="flex items-end">
          <div className="flex-grow">
            <div className="text-lg font-bold">{formatCurrency(price)}</div>
            {discount && discount > 0 && (
              <div className="text-sm text-gray-500 line-through">
                {formatCurrency(originalPrice)}
              </div>
            )}
          </div>
          
          {freeShipping && (
            <Badge variant="outline" className="border-marketplace-green text-marketplace-green">
              Frete Grátis
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 border-t">
        <Button className="w-full bg-marketplace-blue hover:bg-blue-600">
          Ver Oferta
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
