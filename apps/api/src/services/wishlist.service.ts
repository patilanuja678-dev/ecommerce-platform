import { prisma } from "../config/prisma.js";

export async function getWishlist(userId: string) {
  const wishlist = await prisma.wishlist.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!wishlist) {
    return prisma.wishlist.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { sortOrder: "asc" } },
              },
            },
          },
        },
      },
    });
  }

  return wishlist;
}

export async function addWishlistItem(userId: string, productId: string) {
  const wishlist = await getWishlist(userId);
  const existing = await prisma.wishlistItem.findFirst({
    where: { wishlistId: wishlist.id, productId },
  });

  if (existing) return existing;

  return prisma.wishlistItem.create({
    data: {
      wishlistId: wishlist.id,
      productId,
    },
  });
}

export async function removeWishlistItem(itemId: string) {
  return prisma.wishlistItem.delete({ where: { id: itemId } });
}
