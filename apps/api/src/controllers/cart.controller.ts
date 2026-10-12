import type { Request, Response } from "express";
import { addCartItemSchema, couponValidationSchema, updateCartItemSchema } from "../validators/cart.js";
import { clearCart, deleteCartItem, getCartItems, addCartItem, updateCartItem, validateCouponCode, mergeGuestCartIntoUserCart } from "../services/cart.service.js";

export async function getCartController(req: Request, res: Response) {
  const userId = req.user?.id ?? null;
  const guestSessionId = (req.headers["x-guest-session-id"] as string | undefined) ?? null;

  const { cart, items } = await getCartItems({ userId, guestSessionId });

  const subtotalInCents = items.reduce((sum, item) => sum + item.priceSnapshotInCents * item.quantity, 0);

  return res.status(200).json({
    cart,
    items,
    subtotalInCents,
    shippingInCents: 0,
    coupon: null,
    totalInCents: subtotalInCents,
  });
}

export async function addCartItemController(req: Request, res: Response) {
  try {
    const payload = addCartItemSchema.parse(req.body);
    const userId = req.user?.id ?? null;
    const guestSessionId = (req.headers["x-guest-session-id"] as string | undefined) ?? null;

    const result = await addCartItem({
      userId,
      guestSessionId,
      productId: payload.productId,
      variantId: payload.variantId,
      quantity: payload.quantity,
    });

    return res.status(200).json({ message: "Item added to cart", item: result });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Unable to add cart item" });
  }
}

export async function updateCartItemController(req: Request, res: Response) {
  try {
    const payload = updateCartItemSchema.parse(req.body);
    const result = await updateCartItem({
      itemId: req.params.itemId,
      quantity: payload.quantity,
    });

    return res.status(200).json({ message: "Cart item updated", item: result });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Unable to update cart item" });
  }
}

export async function deleteCartItemController(req: Request, res: Response) {
  try {
    await deleteCartItem(req.params.itemId);
    return res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    return res.status(404).json({ message: "Cart item not found" });
  }
}

export async function clearCartController(req: Request, res: Response) {
  const userId = req.user?.id ?? null;
  const guestSessionId = (req.headers["x-guest-session-id"] as string | undefined) ?? null;
  const { cart } = await getCartItems({ userId, guestSessionId });
  await clearCart(cart.id);
  return res.status(200).json({ message: "Cart cleared" });
}

export async function applyCouponController(req: Request, res: Response) {
  try {
    const payload = couponValidationSchema.parse(req.body);
    const userId = req.user?.id ?? null;
    const guestSessionId = (req.headers["x-guest-session-id"] as string | undefined) ?? null;
    const { items } = await getCartItems({ userId, guestSessionId });
    const subtotalInCents = items.reduce((sum, item) => sum + item.priceSnapshotInCents * item.quantity, 0);
    const result = await validateCouponCode(payload.code, subtotalInCents);

    return res.status(200).json({
      message: "Coupon applied",
      coupon: result,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Invalid coupon" });
  }
}

export async function mergeGuestCartController(req: Request, res: Response) {
  const userId = req.user?.id;
  const guestSessionId = (req.headers["x-guest-session-id"] as string | undefined) ?? null;

  if (!userId || !guestSessionId) {
    return res.status(200).json({ message: "No cart merge required" });
  }

  await mergeGuestCartIntoUserCart(userId, guestSessionId);
  return res.status(200).json({ message: "Guest cart merged" });
}
