export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  currency: string;
  quantity: number;
  stock: number;
  image?: string;
};
