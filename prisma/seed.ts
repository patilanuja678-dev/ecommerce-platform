import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.upsert({
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

  await prisma.brand.upsert({
    where: { slug: "brandx" },
    update: {},
    create: {
      name: "BrandX",
      slug: "brandx",
    },
  });

  await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Smart devices and electronics",
    },
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
