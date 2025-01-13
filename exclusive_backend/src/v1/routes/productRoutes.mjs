import express from "express";
import ProductController from "../controllers/productController.mjs";

import validationSchema from "../../../validators/productValidator.mjs";
import upload from "../../../middleware/UploadManager.mjs";
import { parserFormData } from "../../../middleware/parser.mjs";
const router = express.Router();

router.get("/item?", ProductController.getById);
router.get("/:category?", ProductController.getProductListByCategory);

router.post("/add", upload.array("images", 5), parserFormData, validationSchema, ProductController.registerProduct);

export default router;
