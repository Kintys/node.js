import express from "express";
import FilterProductController from "../controllers/filtersProductsController.mjs";
const router = express.Router();

router.get("/catalog", FilterProductController.getCatalogProductsList);
router.get("/search", FilterProductController.getProductListWithSearchFilter);
router.get("/brands", FilterProductController.getBrandsList);

export default router;
