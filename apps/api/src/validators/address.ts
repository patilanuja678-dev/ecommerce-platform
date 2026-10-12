import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80).default("IN"),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
