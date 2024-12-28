import pool from "../../../../../db/connectDB.mjs";

import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
import CartProductsListDBServices from "./CartProductsDBServices.mjs";
import CartProductsStorageDBServices from "./CartProductsStorageDBServices.mjs";

const order = {
    email: "dima@gmail.com",
    orderId: "ee3fce5c-16cd-4fe6-87ba-b1b49030a7c8",
    cartProductList: [
        {
            productId: "5af66c4d-bfc5-11ef-ae33-d8f3bc341a96",
            image: "https://m.media-amazon.com/images/I/71GXQ9kri-L._SX522_.jpg",
            price: "23.99",
            title: "EasySMX Wired Gaming Controller,PC Game Controller Joystick with Dual-Vibration",
            quantity: 10,
            amount: 1,
        },
        {
            productId: "3fa0194f-bfc5-11ef-ae33-d8f3bc341a96",
            image: "https://firebasestorage.googleapis.com/v0/b/exclusive-shop-c0f66.appspot.com/o/Gamepad%2F2023120115561510ba16954.png?alt=media&token=5572e4d7-9865-4794-b5dd-e389fd77e264",
            price: "158.00",
            title: "Havic HV G-92 Gamepad",
            quantity: 10,
            amount: 1,
        },
        {
            productId: "fd4cd2c6-bb20-11ef-ac6c-d8f3bc34",
            image: "https://m.media-amazon.com/images/I/71CE5f1By6L._AC_SX466_.jpg",
            price: "900.00",
            title: "CyberPowerPC Gamer Xtreme VR Gaming PC, Intel Core i5-13400F 2.5GHz, GeForce RTX 4060 8GB, 16GB DDR5, 1TB PCIe Gen4 SSD, WiFi Ready & Windows 11 Home (GXiVR8060A24)",
            quantity: 10,
            amount: 1,
        },
    ],
};
const id = "ee3fce5c-16cd-4fe6-87ba-b1b49030a7c8";

class CartDBService extends MySQLCRUDManager {
    async getCartListById(cartId) {
        try {
            const userCart = await super.getById(cartId);
            if (!userCart) throw new Error("User cart not found!");

            const cartProduct = await CartProductsListDBServices.getFullProductListFromCartProductsList(
                userCart.cartProducts_id
            );

            if (!cartProduct.length !== 0) throw new Error("Cart products not found!");

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
