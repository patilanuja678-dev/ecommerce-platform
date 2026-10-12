import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { createAddressController, deleteAddressController, getAddressesController, updateAddressController } from "../controllers/address.controller.js";

const router = Router();

router.get("/", requireAuth, getAddressesController);
router.post("/", requireAuth, createAddressController);
router.patch("/:id", requireAuth, updateAddressController);
router.delete("/:id", requireAuth, deleteAddressController);

export default router;
