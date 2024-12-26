import pool from "../../../../../db/connectDB.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
import { v1 as uuidv1, parse as uuidParse, stringify as uuidStringify } from "uuid";

class CartProductsStorageDBServices extends MySQLCRUDManager {
    async addProductsToCartProductsStorage(productList) {
        try {
            const values = productList.map((product) => [uuidv1(), product.productId, product.amount]);
            const sqlQuery = `
                INSERT INTO cart_products_storage (_id, product_id, amount)
                VALUES ?;
            `;
            const [result] = await pool.query(sqlQuery, [values]);
            if (result.affectedRows === 0) return [];
            const productId = values.map((item) => [item[0]]);
            return productId;
        } catch (error) {
            console.error(error.massage);
        }
    }
    async getStorageCartId(productIdList) {
        const placeholders = productIdList.map(() => "?").join(", ");
        const sqlQuery = `SELECT _id FROM cart_products_storage
        WHERE product_id IN (${placeholders});`;

        const [results] = await pool.query(sqlQuery, productIdList);
        return results;
    }
    async deleteProductFromCartProductsStorage(productIdList) {
        const storagesProductId = await this.getStorageCartId(productIdList);

        const ids = storagesProductId.map((cart) => cart._id);

        const placeholders = storagesProductId.map(() => "?").join(", ");

        const sqlQuery = `DELETE FROM cart_products_storage
        WHERE _id IN(${placeholders})`;
        const results = await pool.query(sqlQuery, ids);
    }
}
export default new CartProductsStorageDBServices(pool, "cart_products_storage");
