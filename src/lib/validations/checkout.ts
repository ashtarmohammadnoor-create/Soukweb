import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(10).max(500),
  cartItems: z.array(checkoutItemSchema).min(1),
});
