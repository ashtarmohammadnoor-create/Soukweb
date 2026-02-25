import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2).max(140),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphenated"),
  description: z.string().min(10).max(2000),
  priceCents: z.coerce.number().int().positive(),
  currency: z.string().length(3).transform((value) => value.toLowerCase()),
  stock: z.coerce.number().int().nonnegative(),
  isActive: z.coerce.boolean(),
  isFeatured: z.coerce.boolean(),
  images: z.array(z.string().min(1)).min(1, "At least one image is required"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED", "PROCESSING", "SHIPPED", "CANCELED"]),
});
