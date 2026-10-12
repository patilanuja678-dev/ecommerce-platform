import { prisma } from "../config/prisma.js";

export async function getOrCreateCart({
  userId,
  guestSessionId,
}: {
  userId?: string | null;
  guestSessionId?: string | null;
}) {
  if (userId) {
    const existing = await prisma.cart.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    if (existing) return existing;

    return prisma.cart.create({ data: { userId } });
  }

  if (guestSessionId) {
    const existing = await prisma.cart.findFirst({
      where: { guestSessionId },
      orderBy: { updatedAt: "desc" },
    });

    if (existing) return existing;

    return prisma.cart.create({ data: { guestSessionId } });
  }

  return prisma.cart.create({ data: {} });
}

export async function mergeGuestCartIntoUserCart(userId: string, guestSessionId: string) {
  const guestCart = await prisma.cart.findFirst({
    where: { guestSessionId },
    include: {
      items: true,
    },
  });

  if (!guestCart) return;

  const userCart = await getOrCreateCart({ userId });

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: item.productId,
        variantId: item.variantId,
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + item.quantity,
          priceSnapshotInCents: item.priceSnapshotInCents,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          priceSnapshotInCents: item.priceSnapshotInCents,
        },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
}

export async function getCartItems({
  userId,
  guestSessionId,
}: {
  userId?: string | null;
  guestSessionId?: string | null;
}) {
  const cart = await getOrCreateCart({ userId, guestSessionId });

  const items = await prisma.cartItem.findMany({
    where: { cartId: cart.id },
    include: {
      product: {
        include: {
          category: true,
          brand: true,
          images: { orderBy: { sortOrder: "asc" } },
          inventories: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    cart,
    items: items.map((item) => {
      const inventoryTotal = item.product.inventories.reduce((sum, entry) => sum + entry.quantity, 0);
      return {
        ...item,
        inStock: inventoryTotal > 0,
        availableStock: inventoryTotal,
      };
    }),
  };
}

export async function addCartItem({
  userId,
  guestSessionId,
  productId,
  variantId,
  quantity,
}: {
  userId?: string | null;
  guestSessionId?: string | null;
  productId: string;
  variantId?: string | null;
  quantity: number;
}) {
  const cart = await getOrCreateCart({ userId, guestSessionId });

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      inventories: true,
    },
  });

  if (!product || !product.isPublished) {
    throw new Error("Product not found");
  }

  const variant = variantId
    ? product.variants.find((entry) => entry.id === variantId)
    : null;

  const availableStock = variant
    ? variant.stockCount
    : product.inventories.reduce((sum, entry) => sum + entry.quantity, 0);

  if (availableStock < quantity) {
    throw new Error("Insufficient stock available");
  }

  const priceSnapshotInCents =
    product.priceInCents + (variant?.priceDeltaInCents ?? 0);

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId, variantId: variantId ?? null },
  });

  if (existing) {
    const newQuantity = existing.quantity + quantity;
    if (availableStock < newQuantity) {
      throw new Error("Quantity exceeds available stock");
    }

    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQuantity, priceSnapshotInCents },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      variantId: variantId ?? null,
      quantity,
      priceSnapshotInCents,
    },
  });
}

export async function updateCartItem({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      product: {
        include: { variants: true, inventories: true },
      },
    },
  });

  if (!item) throw new Error("Cart item not found");

  const variant = item.variantId
    ? item.product.variants.find((entry) => entry.id === item.variantId)
    : null;

  const availableStock = variant
    ? variant.stockCount
    : item.product.inventories.reduce((sum, entry) => sum + entry.quantity, 0);

  if (availableStock < quantity) {
    throw new Error("Quantity exceeds available stock");
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
}

export async function deleteCartItem(itemId: string) {
  return prisma.cartItem.delete({ where: { id: itemId } });
}

export async function clearCart(cartId: string) {
  await prisma.cartItem.deleteMany({ where: { cartId } });
  return prisma.cart.update({ where: { id: cartId }, data: { updatedAt: new Date() } });
}

export async function validateCouponCode(code: string, subtotalInCents: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    throw new Error("Invalid or expired coupon");
  }

  const now = new Date();
  if (coupon.validFrom > now || coupon.validTo < now) {
    throw new Error("Coupon is no longer valid");
  }

  if (subtotalInCents < coupon.minOrderValueInCents) {
    throw new Error("Order value does not meet coupon minimum");
  }

  let discountInCents = 0;

  if (coupon.type === "PERCENTAGE") {
    discountInCents = Math.floor((subtotalInCents * coupon.value) / 100);
    if (coupon.maxDiscountInCents) {
      discountInCents = Math.min(discountInCents, coupon.maxDiscountInCents);
    }
  } else {
    discountInCents = coupon.value;
  }

  return {
    couponCode: coupon.code,
    discountInCents,
    subtotalInCents,
    totalInCents: Math.max(subtotalInCents - discountInCents, 0),
  };
}
