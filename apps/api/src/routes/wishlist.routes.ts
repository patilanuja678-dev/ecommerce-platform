import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { addWishlistItemController, getWishlistController, removeWishlistItemController } from "../controllers/wishlist.controller.js";

const router = Router();

router.get("/", requireAuth, getWishlistController);
router.post("/items", requireAuth, addWishlistItemController);
router.delete("/items/:itemId", requireAuth, removeWishlistItemController);

export default router;
