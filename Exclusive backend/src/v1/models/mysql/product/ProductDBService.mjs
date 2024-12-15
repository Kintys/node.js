import _config from "../../../../../config/default.mjs";
import pool from "../../../../../db/connectDB.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
const filters = [
    { filterType: "search", fieldName: ["title", "description"], filterContent: "Intel" },
    { filterType: "minValue", fieldName: "newPrice", filterContent: 10 },
];
class ProductDBServices extends MySQLCRUDManager {
    async filterFunction() {
        try {
            const sql = `
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = '${_config.db.mysql.database}' AND table_name REGEXP ?`;

            const TableREGEXP = ["gamepads", "pcs", "laptops", "headphones"].join("|").trim();
            // const TableREGEXP = ["gamepads"].join().trim();
            const [tables] = await pool.query(sql, TableREGEXP);

            if (tables.length === 0) {
                throw new Error("Table not found!");
            }
            const searchText = "Hi";
            const tableNames = tables.map((row) => row.table_name);

            // const { query, params } = this.buildFilterQuery(filters, tableNames);
            // console.log(query);
            // console.log(params);
            //IN NATURAL LANGUAGE MODE
            // const params = tableNames.flatMap(() => [searchText, searchText]);

            const { query, params } = this.applyFilters(tableNames);
            // //     // Виконуємо згенерований запит
            const [results] = await pool.query(query, params);

            //     // Вивід результатів
            // console.log("Результати пошуку:");
            console.log(results);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    getQuery(tableNames) {
        const fields = [
            "title",
            "image_1 AS image",
            "discount",
            "oldPrice",
            "newPrice",
            "quantity",
            "rating",
            "description",
        ];
        const newArr = tableNames
            .map(
                (table) =>
                    `
                    SELECT ${table}._id AS id,${fields.join(", ")}
                    FROM ${table}
                    INNER JOIN images AS image_store
                    ON ${table}.images_id = image_store._id
                    `
            )
            .join(" UNION ALL ");
        return newArr;
    }
    buildFilterQuery(baseQuery, filters) {
        let params = [];
        let query = baseQuery;
        const filterHandlers = new Map([
            [
                "search",
                (filter) => {
                    params = [filter.filterContent, filter.filterContent];
                    query = query.replace("1=1", "");
                    query += `(title REGEXP ? OR description REGEXP ?)`;
                },
            ],
            //MATCH(${filter.fieldName.join(", ")}) AGAINST(? IN NATURAL LANGUAGE MODE)
            [
                "minValue",
                (filter) => {
                    query += ` AND ${filter.fieldName} >= ?`;
                    params.push(filter.filterContent);
                },
            ],
            [
                "maxValue",
                (filter) => {
                    query += ` AND ${filter.fieldName} <= ?`;
                    params.push(filter.filterContent);
                },
            ],
            [
                "rating",
                (filter) => {
                    query += ` AND ${filter.fieldName} >= ?`;
                    params.push(filter.filterContent);
                },
            ],
            [
                "in",
                (filter) => {
                    const placeholders = filter.filterContent.map(() => "?").join(", ");
                    query += ` AND ${filter.fieldName} IN (${placeholders})`;
                    params.push(...filter.filterContent);
                },
            ],
            [
                "nin",
                (filter) => {
                    const placeholders = filter.filterContent.map(() => "?").join(", ");
                    query += ` AND ${filter.fieldName} NOT IN (${placeholders})`;
                    params.push(...filter.filterContent);
                },
            ],
            [
                "exists",
                (filter) => {
                    if (filter.filterContent) {
                        query += ` AND ${filter.fieldName} IS NOT NULL`;
                    } else {
                        query += ` AND ${filter.fieldName} IS NULL`;
                    }
                },
            ],
        ]);

        filters.forEach((filter) => {
            const handler = filterHandlers.get(filter.filterType);
            if (handler) {
                handler(filter);
            } else {
                console.warn(`Unsupported filter type: ${filter.filterType}`);
            }
        });
        return { query, params };
    }
    applyFilters(tableNames) {
        const fields = ["title", "image_1 AS image", "discount", "oldPrice", "newPrice", "quantity", "rating"];
        const baseQuery = `
            SELECT *
            FROM (
                ${this.getQuery(tableNames)}
            ) AS combined_query
            WHERE 1=1`;
        return this.buildFilterQuery(baseQuery, filters);
    }
}
export default new ProductDBServices(pool, "product");
