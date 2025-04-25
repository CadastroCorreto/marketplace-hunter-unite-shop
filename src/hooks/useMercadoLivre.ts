
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

interface MercadoLivreItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  shipping: {
    free_shipping: boolean;
  };
  original_price: number | null;
}

interface MercadoLivreResponse {
  results: MercadoLivreItem[];
}

// Usando apenas a abordagem simples com acesso anônimo às APIs públicas
const fetchFeaturedProducts = async () => {
  try {
    // Endpoint para categorias populares de eletrônicos no Brasil
    // Não requer autenticação para este endpoint público
    const response = await fetch(
      'https://api.mercadolibre.com/sites/MLB/search?category=MLB1051&sort=relevance&limit=3',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('Erro na requisição pública:', await response.text());
      throw new Error('Falha ao buscar produtos do Mercado Livre');
    }
    
    const data: MercadoLivreResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const useMercadoLivre = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['mercadoLivre', 'featured'],
    queryFn: fetchFeaturedProducts,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os produtos do Mercado Livre",
          variant: "destructive"
        });
        console.error("Erro ao buscar produtos:", error);
      }
    }
  });
};
