import { z } from "zod";

export const createWishlistItemSchema = z.object({
  productId: z.string().min(1),
});
