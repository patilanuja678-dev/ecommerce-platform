import type { Request, Response } from "express";
import { createAddressSchema, updateAddressSchema } from "../validators/address.js";
import { createAddress, deleteAddress, getAddresses, updateAddress } from "../services/address.service.js";

export async function getAddressesController(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const addresses = await getAddresses(req.user.id);
  return res.status(200).json(addresses);
}

export async function createAddressController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = createAddressSchema.parse(req.body);
    const address = await createAddress(req.user.id, payload);
    return res.status(201).json({ message: "Address created", address });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Unable to create address" });
  }
}

export async function updateAddressController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const payload = updateAddressSchema.parse(req.body);
    const address = await updateAddress(req.params.id, req.user.id, payload);
    return res.status(200).json({ message: "Address updated", address });
  } catch (error: any) {
    return res.status(400).json({ message: error?.message || "Unable to update address" });
  }
}

export async function deleteAddressController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    await deleteAddress(req.params.id, req.user.id);
    return res.status(200).json({ message: "Address removed" });
  } catch (error: any) {
    return res.status(404).json({ message: error?.message || "Address not found" });
  }
}
