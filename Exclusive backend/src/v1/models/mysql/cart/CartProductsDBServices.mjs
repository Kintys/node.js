import pool from "../../../../../db/connectDB.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
import { v1 as uuidv1, parse as uuidParse, stringify as uuidStringify } from "uuid";
import CartProductsStorageDBServices from "./CartProductsStorageDBServices.mjs";
import ProductDBService from "../product/ProductDBService.mjs";

class CartProductsListDBServices extends MySQLCRUDManager {
    async prepareNewColumnsForTable(productNumber) {
        const existingProductColumnsCount = await super.getColumnsCount(["pk", "_id"]);
        if (productNumber.length > existingProductColumnsCount) {
            const newColumnsRequired = productNumber.length - existingProductColumnsCount;
            let nextColumnIndex = existingProductColumnsCount;
            const addColumnQueries = [];

            for (let index = 0; index < newColumnsRequired; index++) {
                addColumnQueries.push(`ADD product_${nextColumnIndex}  VARCHAR(36) NULL,
                                                ADD CONSTRAINT fk_product_${nextColumnIndex}
                                                FOREIGN KEY (product_${nextColumnIndex})
                                                REFERENCES cart_products_storage(_id)
                                                ON DELETE CASCADE ON UPDATE CASCADE`);
                nextColumnIndex++;
            }

            return addColumnQueries;
        }
        return [];
    }
    async addNewColumnsToTable(tableName, addColumnQueries) {
        try {
            if (!Array.isArray(addColumnQueries) || addColumnQueries.length === 0) {
                throw new Error("No columns to add. Provide a non-empty array of column definitions.");
            }

            const columnsQuery = `
        ALTER TABLE ${tableName}
        ${addColumnQueries.join(",\n")};`;

            const [result] = await pool.query(columnsQuery);

            return result;
        } catch (error) {
            console.error("Error adding columns to table:", error.message);
            throw new Error("Failed to add columns to table. See logs for details.");
        }
    }

    async addProductListToCartProductsList(productList) {
        try {
            const productId = await CartProductsStorageDBServices.addProductsToCartProductsStorage(productList);

            if (productId.length === 0) throw new Error("Product not added!");

            const existingNumberColumns = await this.prepareNewColumnsForTable(productList);

            if (existingNumberColumns && existingNumberColumns.length > 0) {
                await this.addNewColumnsToTable("cart_products_list", existingNumberColumns);
            }
            const columnName = productId.map((item, index) => `product_${index}`).join(", ");
            const placeholders = productId.map(() => "?").join(", ");

            const cartProductsListId = uuidv1();

            const sqlQuery = `
            INSERT INTO cart_products_list (_id,${columnName})
            VALUES(?, ${placeholders});
            `;

            const values = [cartProductsListId, ...productId];
            const [result] = await pool.query(sqlQuery, values);
            if (result.affectedRows === 0) throw new Error("Products are not added!");

            return cartProductsListId;
        } catch (error) {
            return error.massage;
        }
    }
    async getProductIdFromCartProductsList(cartProductListId) {
        const productColumnCount = await super.getColumnsCount(["pk", "_id"]);

        const joinClauses = [];
        const productJsonClauses = [];

        for (let i = 0; i < productColumnCount; i++) {
            productJsonClauses.push(`CONCAT(
            '{"productId": "', cp${i}.product_id, '", "amount": ', cp${i}.amount, '},'
        )`);
            joinClauses.push(
                `LEFT JOIN cart_products_storage AS cp${i} ON cart_products_list.product_${i} = cp${i}._id`
            );
        }

        const query = `SELECT
        CONCAT(
            '[', 
            GROUP_CONCAT(
                ${productJsonClauses.join(",\n")}
            ), 
            ']'
        ) AS products
        FROM cart_products_list 
            ${joinClauses.join("\n")}
        WHERE cart_products_list._id = ? 
        LIMIT 1`;

        const [result] = await pool.query(query, cartProductListId);
        const fixedProductsString = result[0].products.replace(/,\s*]$/, "]");
        return JSON.parse(fixedProductsString);
    }
    async getFullProductListFromCartProductsList() {
        const cartProductId = getProductIdFromCartProductsList(cartProductId);
        const product = await ProductDBService.getProductById();
    }
}

export default new CartProductsListDBServices(pool, "cart_products_list");
