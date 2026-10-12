import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addCartItemController,
  applyCouponController,
  clearCartController,
  deleteCartItemController,
  getCartController,
  mergeGuestCartController,
  updateCartItemController,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", getCartController);
router.post("/items", addCartItemController);
router.patch("/items/:itemId", updateCartItemController);
router.delete("/items/:itemId", deleteCartItemController);
router.delete("/", clearCartController);
router.post("/apply-coupon", applyCouponController);
router.post("/merge-guest", requireAuth, mergeGuestCartController);

export default router;
