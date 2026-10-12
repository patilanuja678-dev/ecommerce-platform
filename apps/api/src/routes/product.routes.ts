import { Router } from "express";
import { getCategoriesController, getCategoryBySlugController, getProductByIdController, getProductBySlugController, getProductsController, searchProductsController } from "../controllers/product.controller.js";

const router = Router();

router.get("/search", searchProductsController);
router.get("/slug/:slug", getProductBySlugController);
router.get("/:id", getProductByIdController);
router.get("/", getProductsController);

export default router;
