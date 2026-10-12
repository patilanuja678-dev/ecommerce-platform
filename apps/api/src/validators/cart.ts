import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(99),
});

export const couponValidationSchema = z.object({
  code: z.string().trim().min(1).max(50),
});
