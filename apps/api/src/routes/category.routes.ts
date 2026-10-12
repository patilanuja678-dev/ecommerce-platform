import { Router } from "express";
import {
  getCategoriesController,
  getCategoryBySlugController,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/", getCategoriesController);
router.get("/:slug", getCategoryBySlugController);

export default router;
