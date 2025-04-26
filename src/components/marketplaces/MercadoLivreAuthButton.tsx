
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const MercadoLivreButton = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/comparison');
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant="default"
      className="flex items-center gap-2"
    >
      <img 
        src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo-small.png"
        alt="Mercado Livre" 
        className="w-6 h-6" 
      />
      Buscar no Mercado Livre
    </Button>
  );
};

export default MercadoLivreButton;
