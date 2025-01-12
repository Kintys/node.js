import pool from "../../../../../db/connectDB.mjs";

import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
import CartProductsListDBServices from "./CartProductsDBServices.mjs";
import CartProductsStorageDBServices from "./CartProductsStorageDBServices.mjs";

const order = {
    email: "dima@gmail.com",
    orderId: "ee3fce5c-16cd-4fe6-87ba-b1b49030a7c8",
};
class CartDBService extends MySQLCRUDManager {
    async getCartListById(cartId) {
        try {
            const userCart = await super.getById(cartId);
            if (!userCart) throw new Error("User cart not found!");

            const cartProduct = await CartProductsListDBServices.getFullProductListFromCartProductsList(
                userCart.cartProducts_id
            );
            return {
                orderId: userCart._id,
                cartProductList: [...cartProduct],
                email: userCart.email,
            };
        } catch (error) {
            console.error(error.massage);
        }
    }
    async addToCartList(userCart) {
        try {
            const cartProductId = await CartProductsListDBServices.addProductListToCartProductsList(
                userCart.cartProductList
            );
            if (!cartProductId) throw new Error("Cart Product Id not added!");
            const sqlQuery = `INSERT INTO cart (_id, cartProducts_id, email)
            VALUES (?, ?, ?);`;
            const values = [userCart.orderId, cartProductId, userCart.email];
            const results = await pool.query(sqlQuery, values);
            if (results.insertId === 0) throw new Error("Order not added!");
            return true;
        } catch (error) {
            console.error(error.massage);
            return false;
        }
    }
    async createForeignKey(productsList) {
        const arr1 = productsList.map(
            (item, number) =>
                ` ALTER TABLE cart_products_storage\n ADD CONSTRAINT fk_product_list_${number} FOREIGN KEY (_id) REFERENCES cart_products_list(product_${number}) ON DELETE CASCADE ON UPDATE CASCADE;`
        );
        const arr2 = productsList.map(
            (item, number) =>
                ` ALTER TABLE cart_products_list\n ADD CONSTRAINT fk_cart_product_list_${number} FOREIGN KEY (product_(8)) REFERENCES cart_products_list(product_${number}) ON DELETE CASCADE ON UPDATE CASCADE;`
        );
        let sqlQuery = `
        ALTER TABLE cart 
        ADD CONSTRAINT fk_cart_cpl1 FOREIGN KEY (cartProducts_id) REFERENCES cart_products_list(_id) ON DELETE CASCADE ON UPDATE CASCADE;

        ALTER TABLE cart_products_list
        ADD CONSTRAINT fk_cart_products_cl1 FOREIGN KEY (_id) REFERENCES cart(cartProducts_id) ON DELETE CASCADE ON UPDATE CASCADE;

        ${arr1.join("\n").trim()}
`;

        // console.log(sqlQuery);
        const result = await pool.query(sqlQuery);
        // console.log(result);
    }
    async deleteOrderToCartList(cartId) {
        try {
            const userCart = await super.getById(cartId);
            if (!userCart) throw new Error("User cart not found!");

            const cartProduct = await CartProductsListDBServices.getFullProductListFromCartProductsList(
                userCart.cartProducts_id
            );

            const cartProductIdList = cartProduct.map((product) => product.productId);

            if (!cartProduct.length !== 0) throw new Error("Cart products not found!");

            const deleteStatus = await CartProductsStorageDBServices.deleteProductFromCartProductsStorage(
                cartProductIdList
            );

            if (!deleteStatus) throw new Error("No record found to delete!");

            return await super.deleteById(cartId);
        } catch (error) {
            console.error(error.massage);
        }
    }
}

export default new CartDBService(pool, "cart");
