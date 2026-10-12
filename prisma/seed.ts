import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@brand.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@brand.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      emailVerified: true,
    },
  });

  const brand = await prisma.brand.upsert({
    where: { slug: "brandx" },
    update: {},
    create: {
      name: "BrandX",
      slug: "brandx",
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Smart devices and electronics",
    },
  });

  const productOne = await prisma.product.upsert({
    where: { slug: "aurora-smartwatch-pro" },
    update: {},
    create: {
      slug: "aurora-smartwatch-pro",
      name: "Aurora Smartwatch Pro",
      shortDescription: "Premium health tracking smartwatch",
      description: "A sleek smartwatch with AMOLED display, sleep tracking, GPS, 7-day battery life, and premium design.",
      priceInCents: 24999,
      compareAtPriceInCents: 31999,
      categoryId: category.id,
      brandId: brand.id,
      featured: true,
      ratingAvg: 4.7,
      ratingCount: 180,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80", altText: "Smartwatch front", isPrimary: true, sortOrder: 1 },
          { url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80", altText: "Smartwatch close-up", sortOrder: 2 },
        ],
      },
      variants: {
        create: [
          { name: "Color", value: "Silver", sku: "AUR-SIL-42", stockCount: 22, isActive: true },
          { name: "Color", value: "Black", sku: "AUR-BLK-42", stockCount: 15, isActive: true },
        ],
      },
      inventories: {
        create: [{ quantity: 26, reservedQuantity: 0, lowStockThreshold: 5 }],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "nova-air-true-wireless" },
    update: {},
    create: {
      slug: "nova-air-true-wireless",
      name: "Nova Air True Wireless",
      shortDescription: "Immersive sound with noise cancellation",
      description: "Bluetooth earbuds designed for all-day comfort with clear calls, deep bass, and a pocket-friendly charging case.",
      priceInCents: 14999,
      compareAtPriceInCents: 19999,
      categoryId: category.id,
      brandId: brand.id,
      featured: true,
      ratingAvg: 4.5,
      ratingCount: 140,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80", altText: "Wireless earbuds", isPrimary: true, sortOrder: 1 },
        ],
      },
      variants: {
        create: [{ name: "Color", value: "White", sku: "NOVA-WHT", stockCount: 18, isActive: true }],
      },
      inventories: {
        create: [{ quantity: 18, reservedQuantity: 0, lowStockThreshold: 5 }],
      },
    },
  });

  console.log("Seed complete", { admin: admin.email, category: category.slug, product: productOne.slug });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
