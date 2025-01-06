import ProductDBServices from "../models/mysql/product/ProductDBService.mjs";
import MimeMapper from "../../../utils/MimeMapper.mjs";
import { validationResult } from "express-validator";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
class ProductController {
    static async getAllProducts(req, res) {
        try {
            // if (!req.user) {
            //     return res.status(403).json({ error: "Access denied" });
            // }
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

    static async getById(req, res) {
        try {
            // if (!req.user) {
            //     return res.status(403).json({ error: "Access denied" });
            // }
            const id = req.query.id;
            if (!id) throw new Error("Id incorrect!");

            const item = await ProductDBServices.getProductById(id);
            if (!item) throw new Error("Item not found!");
            res.status(200).json(item);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async getProductListByCategory(req, res) {
        try {
            const tableName = req.params.category;
            const productList = await ProductDBServices.getProductListByTableName(tableName);
            res.status(200).json(productList);
        } catch (error) {
            res.status(500).json({ error: err.message });
        }
    }

    static async registerProduct(req, res) {
        try {
            // if (!req.user) {
            //     return res.status(403).json({ error: "Access denied" });
            // }

            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                errors.throw();
            }

            const imagesUrl = await ProductController.createUrlImage(req);
            const productData = req.body.data;
            const category = req.body.category;

            if (imagesUrl.length !== 0) {
                productData.images = imagesUrl;
            }

            if (req.params.id) {
                answer = await ProductDBServices.updateProductById(req.params.id, productData);
            } else {
                answer = await ProductDBServices.createNewProduct(productData, category);
            }

            res.status(200).json({ message: answer });
        } catch (err) {
            res.status(500).json({ errors: errors.mapped() });
        }
    }

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
