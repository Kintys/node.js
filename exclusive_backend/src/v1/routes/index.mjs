import express from "express";

import authRoutes from "./authRoutes.mjs";
import productRoutes from "./productRoutes.mjs";
import filterRouters from "./filterRouter.mjs";
import cartRouters from "./cartRoutes.mjs";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/filters", filterRouters);
router.use("/cart", cartRouters);
export default router;
