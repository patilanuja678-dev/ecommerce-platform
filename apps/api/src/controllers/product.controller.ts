import type { Request, Response } from "express";
import { productListQuerySchema } from "../validators/product.js";
import { getCategories, getCategoryBySlug, getProductById, getProductBySlug, getProducts } from "../services/product.service.js";

export async function getProductsController(req: Request, res: Response) {
  try {
    const params = productListQuerySchema.parse(req.query);
    const result = await getProducts({
      query: params.query,
      category: params.category,
      brand: params.brand,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      rating: params.rating,
      inStock: params.inStock,
      sort: params.sort,
      page: params.page,
      limit: params.limit,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: "Invalid product query parameters" });
  }
}

export async function getProductByIdController(req: Request, res: Response) {
  const product = await getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const totalInventory = product.inventories.reduce((sum, item) => sum + item.quantity, 0);

  return res.status(200).json({
    ...product,
    inStock: totalInventory > 0,
    totalInventory,
  });
}

export async function getProductBySlugController(req: Request, res: Response) {
  const product = await getProductBySlug(req.params.slug);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const totalInventory = product.inventories.reduce((sum, item) => sum + item.quantity, 0);

  return res.status(200).json({
    ...product,
    inStock: totalInventory > 0,
    totalInventory,
  });
}

export async function searchProductsController(req: Request, res: Response) {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const result = await getProducts({
    query,
    page: 1,
    limit: 10,
    sort: "popular",
  });

  return res.status(200).json(result);
}

export async function getCategoriesController(_req: Request, res: Response) {
  const categories = await getCategories();
  return res.status(200).json(categories);
}

export async function getCategoryBySlugController(req: Request, res: Response) {
  const category = await getCategoryBySlug(req.params.slug);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  return res.status(200).json(category);
}
