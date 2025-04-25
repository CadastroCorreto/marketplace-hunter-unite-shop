
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface MercadoLivreProduct {
  id: string;
  title: string;
  price: number;
  permalink: string;
  seller: {
    id: string;
    nickname: string;
  };
  shipping: {
    free_shipping: boolean;
  };
  thumbnail: string;
}

interface MercadoLivreProductTableProps {
  products: MercadoLivreProduct[];
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const MercadoLivreProductTable = ({ products, isLoading }: MercadoLivreProductTableProps) => {
  if (isLoading) {
    return (
      <div className="w-full py-4">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-16 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
        <p className="text-gray-500 mt-2">Tente realizar uma nova busca.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Produto</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Frete</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded flex-shrink-0">
                    <img src={product.thumbnail} alt={product.title} className="h-full w-full object-contain" />
                  </div>
                  <span className="line-clamp-2">{product.title}</span>
                </div>
              </TableCell>
              <TableCell>{formatCurrency(product.price)}</TableCell>
              <TableCell>{product.seller.nickname}</TableCell>
              <TableCell>
                {product.shipping.free_shipping ? (
                  <Badge variant="outline" className="border-marketplace-green text-marketplace-green">
                    Frete Grátis
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-500">Pago</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                  <a href={product.permalink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                    <span>Ver oferta</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MercadoLivreProductTable;
