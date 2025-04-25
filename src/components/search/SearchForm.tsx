
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchForm = ({ onSearch, isLoading }: SearchFormProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <Card className="p-5 shadow-lg border-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="O que você está procurando?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10 py-6 text-lg"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="bg-marketplace-blue hover:bg-blue-600 w-full py-6 text-lg"
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Buscando...</span>
            </div>
          ) : (
            'Buscar Produtos'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default SearchForm;
