import CartDBService from "../models/mysql/cart/CartDBService.mjs";

class CartController {
    static async loadCartListById(req, res) {
        try {
            const id = req.params.orderId;
            if (!id) throw new Error("Order ID is required!");

            const cartList = await CartDBService.getCartListById(id);

            if (!cartList) {
                return res.status(200).json({});
            }

            res.status(200).json(cartList);
        } catch (error) {
            res.status(400).json({ error: error.message || "Failed to load cart list." });
        }
    }

    static async saveCartList(req, res) {
        try {
            const userCart = req.body;
            if (!userCart) throw new Error("Cart data is required!");

            // await CartDBService.deleteOrderToCartList(userCart.orderId, userCart.cartProductList);

            const resultStatus = await CartDBService.addToCartList(userCart);

            if (!resultStatus) throw new Error("Failed to add product to cart!");

            res.status(200).json(resultStatus);
        } catch (error) {
            res.status(500).json({ error: error.message || "An error occurred while saving the cart list." });
        }
    }

    static async deleteCartListById(req, res) {
        try {
            // console.log(req.query.orderId);
            // const cartId = req.body.orderId;
            // const cartProductIds = req.body.cartProductIds;

            // if (!cartId || !cartProductIds) throw new Error("Cart ID and product IDs are required!");

            const deleteStatus = await CartDBService.deleteOrderToCartList(req.query.orderId);

            // if (!deleteStatus) throw new Error("No records found to delete!");
            //deleteStatus
            res.status(200).json("ok");
        } catch (error) {
            res.status(400).json({ error: error.message || "Failed to delete items from cart." });
        }
    }
}

export default CartController;
