import ProductDBServices from "../models/mysql/product/ProductDBService.mjs";
import BrandsDBServices from "../models/mysql/brand/BrandDBServices.mjs";
import MimeMapper from "../../../utils/MimeMapper.mjs";
import { validationResult } from "express-validator";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
class ProductController {
    static async getAllProducts(req, res) {
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
                "newPrice",
                "quantity",
            ];
            const { total_count } = await ProductDBServices.getTotalPage(filters);
            const productsList = await ProductDBServices.getProductListWithFilterOptions(filters, fieldArray);

            res.status(200).json({
                data: { documents: productsList, totalNumber: total_count },
            });
        } catch (error) {
            res.status(500).json({ error: "Error fetching products" });
        }
    }
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

    static async registerProduct(req, res) {
        // if (!req.user) {
        //     return res.status(403).json({ error: "Access denied" });
        // }
        const errors = validationResult(req);
        try {
            if (!errors.isEmpty()) {
                errors.throw();
            }

            const imagesUrl = await ProductController.createUrlImage(req);
            // const productData = JSON.parse(req.body.data);

            // if (imagesUrl.length !== 0) {
            //     productData.images = imagesUrl;
            // }
            // const category = JSON.parse(req.body.category);

            // const res = await ProductDBServices.createNewProduct(productData, category);
            // console.log(res);
            // if (req.params.id) {
            //     await ProductsDBService.update(req.params.id, productData);
            // } else {
            //     productData.seller = req.user.id;
            //     await ProductsDBService.create(productData);
            // }

            res.status(200).json({ message: "ok" });
        } catch (err) {
            res.status(500).json({ errors: errors.mapped() });
        }
    }

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
    static async createUrlImage(req) {
        const images = [];
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const uploadsDir = path.join(__dirname, "../../../uploads");

        try {
            await fs.mkdir(uploadsDir, { recursive: true });

            const imagePromises = req.files.map(async (file) => {
                const filename = uuidv4() + MimeMapper.getExtension(file.mimetype);
                const filePath = path.join(uploadsDir, filename);
                try {
                    await fs.writeFile(filePath, file.buffer);
                    images.push(`${req.protocol}://${req.get("host")}/images/${filename}`);
                } catch (error) {
                    console.error(`Error saving file ${file.originalname}:`, error);
                }
            });

            await Promise.all(imagePromises);
        } catch (err) {
            console.error("Error ensuring uploads directory:", err);
        }

        return images;
    }
}

export default ProductController;
