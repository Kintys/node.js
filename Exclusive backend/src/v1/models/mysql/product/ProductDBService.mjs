import _config from "../../../../../config/default.mjs";
import pool from "../../../../../db/connectDB.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";

class ProductDBServices extends MySQLCRUDManager {
    static tableNames = ["gamepads", "pcs", "laptops", "headphones"];
    async getUnionQuery(tableNames) {
        const queryParts = await Promise.all(
            tableNames.map(async (tableName) => {
                return `SELECT * FROM ${tableName}
            `;
            })
        );
        return queryParts.join(" UNION ALL ");
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
            INNER JOIN images ON combined_table.images_id = images._id
            INNER JOIN brands ON combined_table.brands_id = brands._id
            INNER JOIN colors ON combined_table.colors_id = colors._id
            WHERE combined_table._id = ? 
            LIMIT 1`;

            const [results] = await pool.query(query, [id]);
            const parsedArray = {
                ...results[0],
                images: JSON.parse(results[0].images),
                colors: JSON.parse(results[0].colors),
            };
            return parsedArray;
        } catch (error) {}
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
}

export default new ProductDBServices(pool, "");
