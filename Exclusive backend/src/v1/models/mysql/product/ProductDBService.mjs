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
    static queryBaseConfig = {
        fieldsToSelect: [
            "title",
            "image_1 AS image",
            "discount",
            "oldPrice",
            "newPrice",
            "quantity",
            "rating",
            "description",
            "evaluation",
        ],
        tableNames: ["gamepads", "pcs", "laptops", "headphones"],
    };
    async findManyWithSearchOptions(reqQuery) {
        try {
            const { query, combinedParameters } = await FiltersMySQLHelper.applyFindOptionsFromQuery(
                reqQuery,
                ProductDBServices.fieldsConfigurations,
                ProductDBServices.queryBaseConfig
            );

            const [results] = await pool.query(query, combinedParameters);

            return results;
        } catch (error) {
            console.error("Error:", error);
        }
    }
    async getTotalPage(reqQuery) {
        try {
            const query = await FiltersMySQLHelper.applyFiltersOptionsFromQuery(reqQuery, [], {
                fieldsToSelect: [],
                tableNames: ProductDBServices.queryBaseConfig.tableNames,
            });
            const totalQuery = `SELECT COUNT(*) AS total_count FROM (${query}) AS combined_results;`;
            const [results] = await pool.query(totalQuery);

            return results[0];
        } catch (error) {
            console.error("Error:", error);
        }
    }
}
export default new ProductDBServices(pool, "product");
