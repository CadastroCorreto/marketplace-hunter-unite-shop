
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-marketplace-yellow p-1 rounded">
              <Search className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold">MarketHunter</span>
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
          <Link to="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/search">
            <Button className="bg-marketplace-blue hover:bg-blue-600 text-white">
              Nova Busca
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
