import ProductsDBService from "../modules/products/ProductsDBService.mjs";

class ProductController {
    static createProductForm(req, res) {
        res.render("product/product");
    }
    static async renderProductList(req, res) {
        try {
            const sort = req.session.sort;
            const products = await ProductsDBService.getProductList({}, sort);
            res.render("product/productList", {
                products,
            });
        } catch (err) {
            res.send(err.message).status(400);
        }
    }
    static async addNewProduct(req, res) {
        try {
            req.session.sort = { price: 1 };
            const productData = req.body;
            if (req.file) {
                productData.img = req.file?.buffer;
            }
            await ProductsDBService.addProductItemToDB(productData);
            res.redirect("/product/list");
        } catch (err) {
            res.send("not add").status(400);
        }
    }
}

export default ProductController;
