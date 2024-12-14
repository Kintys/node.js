import Product from "./Product.mjs";
import MongooseCRUDManager from "../MongooseCRUDManager.mjs";

class ProductsDBService extends MongooseCRUDManager {
    /**
     * Конфігурація полів для фільтрації та пошуку (які будемо опрацьовувати).
     */
    static fieldsConfigurations = [
        {
            fieldName: "title",
            filterCategory: "search",
        },
        {
            fieldName: "newPrice",
            filterCategory: "range",
        },
        {
            fieldName: "rating",
            filterCategory: "rating",
        },
    ];

    /**
     * Отримує список продуктів з урахуванням запиту користувача.
     *
     * @param {Object} reqQuery - Об'єкт з параметрами запиту, включаючи фільтри, сортування та пагінацію.
     * @returns {Promise<Product[]>} - Promise, який вирішується масивом знайдених продуктів.
     */
    async getList(reqQuery) {
        try {
            const res = await this.findManyWithSearchOptions(reqQuery, ProductsDBService.fieldsConfigurations, null);
            return res;
            // [
            //     {
            //         fieldForPopulation: "brand",
            //     },
            // ];
        } catch (error) {
            return [];
        }
    }
}

export default new ProductsDBService(Product);
