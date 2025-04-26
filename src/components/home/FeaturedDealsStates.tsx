
import React from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface LoadingStateProps {
  count?: number;
}

export const LoadingState = ({ count = 3 }: LoadingStateProps) => (
  <>
    {Array.from({ length: count }).map((_, n) => (
      <Card key={n} className="overflow-hidden p-4 flex flex-col">
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="w-3/4 h-5 mb-2" />
        <Skeleton className="w-1/2 h-4 mb-4" />
        <Skeleton className="w-full h-10 mt-auto" />
      </Card>
    ))}
  </>
);

interface ErrorStateProps {
  error: Error;
  showMockDeals?: boolean;
}

export const ErrorState = ({ error, showMockDeals }: ErrorStateProps) => (
  <Alert variant="destructive" className="col-span-full mb-6">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Atenção</AlertTitle>
    <AlertDescription>
      Não foi possível carregar os produtos do Mercado Livre. {showMockDeals && 'Mostrando ofertas alternativas.'}
      <p className="mt-2 text-sm font-mono bg-gray-100 p-2 rounded">
        Erro: {error.message}
      </p>
    </AlertDescription>
  </Alert>
);

export const EmptyState = () => (
  <Alert className="col-span-full mb-6">
    <Info className="h-4 w-4" />
    <AlertTitle>Informação</AlertTitle>
    <AlertDescription>
      Nenhum produto encontrado na API do Mercado Livre. Verifique se sua conta está conectada corretamente.
    </AlertDescription>
  </Alert>
);
