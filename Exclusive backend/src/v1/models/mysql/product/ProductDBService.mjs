import _config from "../../../../../config/default.mjs";
import pool from "../../../../../db/connectDB.mjs";
import MySQLTableManager from "../MySQLTableManager.mjs";
import { v1 as uuidv1 } from "uuid";

class ProductDBServices extends MySQLTableManager {
    static tableNames = ["gamepads", "pcs", "laptops", "headphones"];
    static fieldsCardList = ["title", "image_1 AS image", "discount", "oldPrice", "newPrice", "quantity", "rating"];
    async getUnionQuery(tableNames) {
        const queryParts = await Promise.all(
            tableNames.map(async (tableName) => {
                return `SELECT * FROM ${tableName}
            `;
            })
        );
        return queryParts.join(" UNION ALL ");
    }

    async getProductListByTableName(tableName) {
        try {
            if (!tableName) throw new Error("Table is incorrect!");

            const fields = ProductDBServices.fieldsCardList.join(", ");
            const sqlQuery = `SELECT ${fields} FROM ${tableName}
            LEFT JOIN images ON ${tableName}.images_id = images._id`;

            const [results] = await pool.execute(sqlQuery);
            return results;
        } catch (error) {
            console.error(error);
        }
    }
    async getProductById(id) {
        try {
            const unionQuery = await this.getUnionQuery(ProductDBServices.tableNames);

            const query = `SELECT combined_table._id,
            combined_table.title,
            JSON_ARRAY(images.image_1, images.image_2, images.image_3, images.image_4) AS images,
            combined_table.discount,
            brands.name AS brand,
            combined_table.oldPrice,
            combined_table.newPrice,
            combined_table.quantity,
            combined_table.rating,
            combined_table.description,
            combined_table.evaluation,
            JSON_ARRAY(colors.0, colors.1, colors.2) AS colors
            FROM(${unionQuery}) AS combined_table
            LEFT JOIN images ON combined_table.images_id = images._id
            LEFT JOIN brands ON combined_table.brands_id = brands._id
            LEFT JOIN colors ON combined_table.colors_id = colors._id
            WHERE combined_table._id = ? 
            LIMIT 1`;
            const [results] = await pool.query(query, [id]);
            const parsedArray = {
                ...results[0],
                images: JSON.parse(results[0].images),
                colors: JSON.parse(results[0].colors),
            };
            return parsedArray;
        } catch (error) {
            console.log("Product not found", error);
        }
    }
    async getProductsListByIdList(idList, fieldsList = "*") {
        try {
            const unionQuery = await this.getUnionQuery(ProductDBServices.tableNames);
            if (!unionQuery) throw new Error("Error");

            const selectFields = fieldsList
                .map((field) => (!field.includes("image") ? `combined_table.${field}` : field))
                .join(", ");

            const placeholders = idList.map(() => "?").join(", ");

            const sqlQuery = `SELECT ${selectFields} 
            FROM (${unionQuery}) AS combined_table
            LEFT JOIN images ON combined_table.images_id = images._id
            WHERE combined_table._id IN (${placeholders})`;
            const values = idList;

            const [results] = await pool.query(sqlQuery, values);

            if (results.length === 0) throw new Error("Products on found!");

            return results;
        } catch (error) {
            console.error(error.massage);
        }
    }
    async updateProductById(id, data) {
        try {
            const tableName = await super.findTableById("title", id);
            if (!tableName) throw new Error("category not found");

            const imagesId = await this.insertImageToDB(data.images);
            if (!imagesId) throw new Error("Images is not added!");

            const values = await this.prepareInsertValues(data, imagesId);

            const sqlQuery = `UPDATE ${tableName} SET ? WHERE _id = ?`;

            const [result] = await pool.query(sqlQuery, [values, id]);
            if (result.affectedRows === 0) throw new Error("Product not updated!");
            return true;
        } catch (error) {
            console.log(error.massage);
        }
    }
    async createNewProduct(data, tableName) {
        try {
            const imagesId = await this.insertImageToDB(data.images);
            if (!imagesId) throw new Error("Images is not added!");

            const values = await this.prepareInsertValues(data, imagesId, true);

            const sqlQuery = `INSERT INTO ${tableName} (${Object.keys(values).join(", ")}) VALUES (${Object.keys(values)
                .map(() => "?")
                .join(", ")})`;

            const result = await pool.query(sqlQuery, Object.values(values));
            if (result.insertId === 0) throw new Error("Product id not added!");

            return true;
        } catch (error) {
            console.error(error.massage);
        }
    }
    async prepareInsertValues(data, imagesId, isAddId = false) {
        const values = {};
        if (isAddId) values["_id"] = uuidv1();

        for (const [key, value] of Object.entries(data)) {
            if (key === "images") {
                values["images_id"] = imagesId;
            } else {
                values[key] = value;
            }
        }

        return values;
    }
    async insertImageToDB(images) {
        try {
            const sqlQuery = `INSERT INTO images (Image_1, Image_2, Image_3, Image_4) VALUE (?,?,?,?)`;
            const values = images;

            const [result] = await pool.query(sqlQuery, values);
            return result.insertId;
        } catch (error) {
            console.error(error.massage);
        }
    }
}

export default new ProductDBServices(pool, _config.db.mysql.database);
