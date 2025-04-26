
export const formatMercadoLivreProduct = (mlProduct: any) => ({
  id: mlProduct.id,
  title: mlProduct.title,
  price: mlProduct.price,
  image: mlProduct.thumbnail.replace('I.jpg', 'W.jpg'),
  marketplace: {
    id: "mercado-livre",
    name: "Mercado Livre",
    logo: "https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus.png"
  },
  discount: mlProduct.original_price 
    ? Math.round(((mlProduct.original_price - mlProduct.price) / mlProduct.original_price) * 100)
    : 0,
  freeShipping: mlProduct.shipping?.free_shipping || false,
  rating: 4.8
});
