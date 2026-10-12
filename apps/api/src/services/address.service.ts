import { prisma } from "../config/prisma.js";

export async function getAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddress(userId: string, data: {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}) {
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.create({
    data: {
      userId,
      fullName: data.fullName,
      phone: data.phone,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country || "IN",
      isDefault: !!data.isDefault,
    },
  });
}

export async function updateAddress(addressId: string, userId: string, data: Partial<{
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}>) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) throw new Error("Address not found");

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  return prisma.address.update({
    where: { id: addressId },
    data: {
      ...data,
      line2: data.line2 ?? null,
      country: data.country ?? "IN",
      isDefault: !!data.isDefault,
    },
  });
}

export async function deleteAddress(addressId: string, userId: string) {
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) throw new Error("Address not found");

  return prisma.address.delete({ where: { id: addressId } });
}
