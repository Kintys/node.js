import pool from "../../../../../db/connectDB.mjs";

import FiltersMySQLHelper from "../../../../../utils/searchHelpers/FiltersMySQLHelper.mjs";
class FilterProductDBServices {
    static fields = [
        "title",
        "image_1 AS image",
        "discount",
        "brands.name AS brand",
        "oldPrice",
        "newPrice",
        "quantity",
        "rating",
        "description",
        "evaluation",
    ];
    static fieldsConfigurations = [
        {
            fieldName: "search",
            fieldOptions: ["title"],
            filterCategory: "searchMany",
        },
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
        {
            fieldName: "brands",
            filterCategory: "brands",
        },
        {
            fieldName: "newPrice",
            filterCategory: "range",
        },
    ];

    static tableNames = ["gamepads", "pcs", "laptops", "headphones"];
    async getFieldsToSelect(fieldArray) {
        return !fieldArray || fieldArray.length === 0 ? ["*"] : [...fieldArray];
    }
    async getQueryBaseConfig(fieldArray) {
        return {
            fieldsToSelect: await this.getFieldsToSelect(fieldArray),
            tableNames: FilterProductDBServices.tableNames,
        };
    }
    async getProductListWithFilterOptions(reqQuery) {
        try {
            const fieldsToSelect = FilterProductDBServices.fields;
            const queryBaseConfig = await this.getQueryBaseConfig(fieldsToSelect);
            const { query, combinedParameters } = await FiltersMySQLHelper.applyFindOptionsFromQuery(
                reqQuery,
                FilterProductDBServices.fieldsConfigurations,
                queryBaseConfig
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
                tableNames: FilterProductDBServices.tableNames,
            });
            const totalQuery = `SELECT COUNT(*) AS total_count FROM (${query}) AS combined_results;`;
            const [results] = await pool.query(totalQuery);
            return results[0];
        } catch (error) {
            console.error("Error:", error);
        }
    }
}
export default new FilterProductDBServices();
