import { Router } from "express";
import upload from "../utils/UploadFileManager.mjs";
import ProductController from "../controllers/product_controllers.mjs";
const router = Router();

router.get("/", ProductController.createProductForm);
router.get("/list", ProductController.renderProductList);

router.post("/", upload.single("img"), ProductController.addNewProduct);

export default router;
