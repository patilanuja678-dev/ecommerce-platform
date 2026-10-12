import type { Request, Response } from "express";
import { createWishlistItemSchema } from "../validators/wishlist.js";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../services/wishlist.service.js";

export async function getWishlistController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const wishlist = await getWishlist(req.user.id);
  return res.status(200).json(wishlist);
}

export async function addWishlistItemController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = createWishlistItemSchema.parse(req.body);
    const item = await addWishlistItem(req.user.id, payload.productId);
    return res.status(200).json({ message: "Saved to wishlist", item });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Unable to add wishlist item" });
  }
}

export async function removeWishlistItemController(req: Request, res: Response) {
  try {
    await removeWishlistItem(req.params.itemId);
    return res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    return res.status(404).json({ message: "Wishlist item not found" });
  }
}
