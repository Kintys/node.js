import express from "express";
import ProductController from "../controllers/productController.mjs";
import { body } from "express-validator";
// import CatalogProductsController from "../controllers/catalogProductsController.mjs";
import { checkSchema } from "express-validator";
import validationSchema from "../../../validators/productValidator.mjs";
import upload from "../../../middleware/UploadManager.mjs";
import { parserFormData } from "../../../middleware/parser.mjs";
const router = express.Router();

// router.get("/filters-data", FilterService.getFiltersData);
router.get("/item?", ProductController.getById);
// router.get("/catalog", ProductController.getCatalogProductsList);
// router.get("/", (req, res) => {
//     res.send("ok");
// });
// router.get("/search", ProductController.getProductListWithSearchFilter);
// // router.get("/register/:id?", ProductController.registerForm);
// router.get("/brands", ProductController.getBrandsList);

router.post("/add", upload.array("images", 5), parserFormData, validationSchema, ProductController.registerProduct);
//validationSchema
// router.put("/:id", upload.single("image"), ProductController.registerProduct);
// router.delete("/", ProductController.deleteProduct);

export default router;
//  checkSchema(ProductValidator.productSchema),
