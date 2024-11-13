import Product from "./Products.mjs";
import MongooseCRUDManager from "../MongooseCRUDManager.mjs";

class ProductDBService extends MongooseCRUDManager {
    async getProductList(filters = {}, sortValue = {}) {
        try {
            const result = await Product.find(filters).sort(sortValue).exec();
            return ProductDBService.getNewDataWithBase64(result);
        } catch (error) {
            return [];
        }
    }
    async addProductItemToDB(data) {
        try {
            await super.create(data);
            return true;
        } catch (err) {
            return false;
        }
    }
    static getNewDataWithBase64(data) {
        return data.map((element) => {
            return {
                ...element._doc,
                img: `data:image/gif;base64,${element.img.toString("base64")}`,
            };
        });
    }
}
export default new ProductDBService(Product);
