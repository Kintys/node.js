import FilterProductDBServices from "../models/mysql/filterProduct/FilterProductDBService.mjs";
import BrandsDBServices from "../models/mysql/brand/BrandDBServices.mjs";
class FilterProductController {
    static async getCatalogProductsList(req, res) {
        try {
            const filters = {};
            for (const key in req.query) {
                if (req.query[key]) filters[key] = req.query[key];
            }
            const fieldArray = [
                "title",
                "image_1 AS image",
                "discount",
                "brands.name AS brand",
                "oldPrice",
                "newPrice",
                "quantity",
                "rating",
                "description",
                "evaluation",
            ];
            const { total_count } = await FilterProductDBServices.getTotalPage(filters);
            const productsList = await FilterProductDBServices.getProductListWithFilterOptions(filters, fieldArray);

            res.status(200).json({
                data: { documents: productsList, totalNumber: total_count },
            });
        } catch (error) {
            res.status(500).json({ error: "Error fetching products" });
        }
    }
    static async getProductListWithSearchFilter(req, res) {
        try {
            const filters = {};
            for (const key in req.query) {
                if (req.query[key]) filters[key] = req.query[key];
            }
            const fieldArray = ["title", "rating", "image_1 AS image"];
            const productsList = await FilterProductDBServices.getProductListWithFilterOptions(filters, fieldArray);
            res.json(productsList);
        } catch (error) {
            res.status(400).json({ error: error.massage });
        }
    }
    static async getBrandsList(req, res) {
        try {
            const brandList = await BrandsDBServices.getList();
            res.json(brandList);
        } catch (error) {
            res.status(400).json({ error: error.massage });
        }
    }
}

export default FilterProductController;
