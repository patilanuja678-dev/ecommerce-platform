import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

export async function getProducts(params: {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: string;
  page: number;
  limit: number;
}) {
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (params.query) {
    const term = params.query.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } },
      { shortDescription: { contains: term, mode: "insensitive" } },
      { category: { name: { contains: term, mode: "insensitive" } } },
      { brand: { name: { contains: term, mode: "insensitive" } } },
    ];
  }

  if (params.category) {
    where.category = {
      slug: params.category,
    };
  }

  if (params.brand) {
    where.brand = {
      slug: params.brand,
    };
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    const min = params.minPrice !== undefined ? params.minPrice * 100 : undefined;
    const max = params.maxPrice !== undefined ? params.maxPrice * 100 : undefined;

    where.priceInCents = {
      ...(min !== undefined ? { gte: min } : {}),
      ...(max !== undefined ? { lte: max } : {}),
    };
  }

  if (params.rating !== undefined) {
    where.ratingAvg = {
      gte: params.rating,
    };
  }

  if (params.inStock !== undefined) {
    where.inventories = {
      some: {
        quantity: params.inStock ? { gt: 0 } : { lte: 0 },
      },
    };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: "desc" }];

  switch (params.sort) {
    case "price_asc":
      orderBy = [{ priceInCents: "asc" }];
      break;
    case "price_desc":
      orderBy = [{ priceInCents: "desc" }];
      break;
    case "rating":
      orderBy = [{ ratingAvg: "desc" }, { ratingCount: "desc" }];
      break;
    case "popular":
      orderBy = [{ ratingCount: "desc" }, { ratingAvg: "desc" }];
      break;
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    default:
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
  }

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: "asc" },
        },
        variants: {
          where: { isActive: true },
          orderBy: { value: "asc" },
        },
        inventories: true,
      },
      orderBy,
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    }),
    prisma.product.count({ where }),
  ]);

  const normalized = items.map((product) => ({
    ...product,
    inStock: product.inventories.reduce((totalStock, entry) => totalStock + entry.quantity, 0) > 0,
    totalInventory: product.inventories.reduce((totalStock, entry) => totalStock + entry.quantity, 0),
  }));

  return {
    items: normalized,
    total,
    page: params.page,
    limit: params.limit,
    totalPages: Math.ceil(total / params.limit),
  };
}

export async function getProductById(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
      },
      inventories: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        where: { isActive: true },
      },
      inventories: true,
      reviews: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isPublished: true },
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: { sortOrder: "asc" },
          },
          inventories: true,
        },
      },
    },
  });
}
