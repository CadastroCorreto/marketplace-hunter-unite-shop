
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MarketplaceCardProps {
  id: string;
  name: string;
  logo: string;
  description: string;
  isConnected: boolean;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  id,
  name,
  logo,
  description,
  isConnected,
  onConnect,
  onDisconnect,
}) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 flex items-center justify-center rounded-md overflow-hidden bg-gray-100">
            <img 
              src={logo} 
              alt={`${name} logo`} 
              className="h-full w-full object-contain p-1" 
            />
          </div>
          {isConnected && (
            <Badge className="bg-marketplace-green">Conectado</Badge>
          )}
        </div>
        <CardTitle className="mt-2">{name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-500">
          {isConnected 
            ? "Sua conta está conectada a este marketplace." 
            : "Conecte sua conta deste marketplace para ver ofertas exclusivas."}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2">
        {isConnected ? (
          <Button 
            variant="outline" 
            onClick={() => onDisconnect(id)}
            className="w-full border-red-300 text-red-500 hover:bg-red-50"
          >
            Desconectar
          </Button>
        ) : (
          <Button 
            onClick={() => onConnect(id)} 
            className="w-full bg-marketplace-blue hover:bg-blue-600"
          >
            Conectar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MarketplaceCard;
