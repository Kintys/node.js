import ProductDBServices from "../models/mysql/product/ProductDBService.mjs";
import BrandsDBServices from "../models/mysql/brand/BrandDBServices.mjs";
class ProductController {
    // static async getAllProducts(req, res) {
    //     try {
    //         const filters = {};
    //         for (const key in req.query) {
    //             if (req.query[key]) filters[key] = req.query[key];
    //         }
    //         const fieldArray = [
    //             "title",
    //             "image_1 AS image",
    //             "discount",
    //             "brands.name AS brand",
    //             "oldPrice",
    //             "newPrice",
    //             "quantity",
    //             "rating",
    //             "description",
    //             "evaluation",
    //         ];
    //         const { total_count } = await ProductDBServices.getTotalPage(filters);
    //         const productsList = await ProductDBServices.getProductListWithFilterOptions(filters, fieldArray);

    //         res.status(200).json({
    //             data: { documents: productsList, totalNumber: total_count },
    //         });
    //     } catch (error) {
    //         res.status(500).json({ error: "Error fetching products" });
    //     }
    // }
    // static async getBrandsList(req, res) {
    //     try {
    //         const brandList = await BrandsDBServices.getList();
    //         res.json(brandList);
    //     } catch (error) {
    //         res.status(400).json({ error: error.massage });
    //     }
    // }
    // static async getProductListWithSearchFilter(req, res) {
    //     try {
    //         const filters = {};
    //         for (const key in req.query) {
    //             if (req.query[key]) filters[key] = req.query[key];
    //         }
    //         const fieldArray = ["title", "rating"];
    //         const productsList = await ProductDBServices.getProductListWithFilterOptions(filters, fieldArray);
    //         res.json(productsList);
    //     } catch (error) {
    //         res.status(400).json({ error: error.massage });
    //     }
    // }

    // // Метод для отримання всіх товарів
    // static async getAllProducts(req, res) {
    //   try {
    //     const filters = {}
    //     for (const key in req.query) {
    //       if (req.query[key]) filters[key] = req.query[key]
    //     }

    //     const productsList = await ProductsDBService.getList(filters)
    //     res.status(200).json({
    //       data: productsList,
    //       user: req.user,
    //     })
    //   } catch (error) {
    //     res.status(500).json({ error: 'Error fetching products' })
    //   }
    // }
    // static async getAllProducts(req, res) {
    //   try {
    //     const filters = {}
    //     for (const key in req.query) {
    //       if (req.query[key]) filters[key] = req.query[key]
    //     }

    //     const productsList = await ProductsDBService.getList(filters)
    //     res.status(200).json({
    //       data: productsList,
    //       user: req.user,
    //     })
    //   } catch (error) {
    //     res.status(500).json({ error: 'Error fetching products' })
    //   }
    // }
    // static async getFiltersData() {}
    static async getById(req, res) {
        try {
            const id = req.query.id;
            if (!id) throw new Error("Id incorrect!");

            const item = await ProductDBServices.getProductById(id);
            if (!item) throw new Error("Item not found!");

            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // static async registerForm(req, res) {
    //     try {
    //         if (!req.user) {
    //             return res.status(403).json({ error: "Access denied" });
    //         }

    //         const id = req.params.id;
    //         let product = null;
    //         if (id) {
    //             product = await ProductsDBService.getById(id);
    //         }

    //         res.status(200).json({
    //             data: product,
    //             user: req.user,
    //         });
    //     } catch (err) {
    //         res.status(500).json({ error: err.message });
    //     }
    // }

    // static async registerProduct(req, res) {
    //     if (!req.user) {
    //         return res.status(403).json({ error: "Access denied" });
    //     }

    //     const data = req.body;

    //     try {
    //         const productData = {
    //             ...req.body,
    //         };
    //         if (req.file?.buffer) {
    //             productData.image = req.file.buffer.toString("base64");
    //         }

    //         if (req.params.id) {
    //             await ProductsDBService.update(req.params.id, productData);
    //         } else {
    //             productData.seller = req.user.id;
    //             await ProductsDBService.create(productData);
    //         }

    //         res.status(200).json({ message: "Product registered successfully" });
    //     } catch (err) {
    //         res.status(500).json({ errors: [{ msg: err.message }], product: data, user: req.user });
    //     }
    // }

    // // Метод для видалення товару (доступний тільки для адміністратора)
    // static async deleteProduct(req, res) {
    //     if (!req.user) {
    //         return res.status(403).json({ error: "Access denied" });
    //     }

    //     try {
    //         await ProductsDBService.deleteById(req.body.id);
    //         res.status(200).json({ message: "Product deleted" });
    //     } catch (error) {
    //         res.status(500).json({ error: "Error deleting product" });
    //     }
    // }
}

export default ProductController;
