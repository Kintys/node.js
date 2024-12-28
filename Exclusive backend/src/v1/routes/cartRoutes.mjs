import express from "express";
import CartController from "../controllers/cartController.mjs";

const router = express.Router();

// router.get("/", CartController.loadCartListById);

router.post("/save", CartController.saveCartList);

router.delete("/", CartController.deleteCartListById);

export default router;
