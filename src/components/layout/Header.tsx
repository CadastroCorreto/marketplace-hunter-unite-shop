
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            MarketHunter
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-black font-medium">
              Início
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-black font-medium">
              Buscar Produtos
            </Link>
            <Link to="/marketplaces" className="text-gray-700 hover:text-black font-medium">
              Marketplaces
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAuthModal(true)}
          >
            <LogIn className="mr-2 h-4 w-4" /> Entrar
          </Button>
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </header>
  );
};

export default Header;
