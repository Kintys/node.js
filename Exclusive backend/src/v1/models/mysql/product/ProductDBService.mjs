import _config from "../../../../../config/default.mjs";
import pool from "../../../../../db/connectDB.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
import FiltersMySQLHelper from "../../../../../utils/searchHelpers/FiltersMySQLHelper.mjs";
class ProductDBServices extends MySQLCRUDManager {
    static fieldsConfigurations = [
        {
            fieldName: "title",
            filterCategory: "searchOne",
        },
        {
            fieldName: "newPrice",
            filterCategory: "range",
        },
        {
            fieldName: "rating",
            filterCategory: "rating",
        },
        {
            fieldName: "sort",
            filterCategory: "sort",
        },
    ];
    static queryConfig = {
        fieldsToSelect: [
            "title",
            "image_1 AS image",
            "discount",
            "oldPrice",
            "newPrice",
            "quantity",
            "rating",
            "description",
        ],
        tableNames: ["gamepads", "pcs", "laptops", "headphones"],
    };
    async findManyWithSearchOptions(reqQuery) {
        try {
            const { queryParts, combinedParameters } = await FiltersMySQLHelper.applyFiltersOptionsFromQuery(
                reqQuery,
                ProductDBServices.fieldsConfigurations,
                ProductDBServices.queryConfig
            );
            console.log(queryParts);
            const [results] = await pool.query(queryParts, combinedParameters);

            return results;
        } catch (error) {
            console.error("Error:", error);
        }
    }
}
export default new ProductDBServices(pool, "product");
