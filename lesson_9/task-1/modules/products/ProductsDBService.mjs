import Product from "./Products.mjs";
import MongooseCRUDManager from "../MongooseCRUDManager.mjs";

class ProductDBService extends MongooseCRUDManager {
    async getProductList(filters = {}, sortValue = {}) {
        try {
            return await Product.find(filters).sort(sortValue).exec();
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
}
export default new ProductDBService(Product);
