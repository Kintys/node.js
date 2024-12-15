import QueryParser from "./QueryParser.mjs";

class FiltersHelper {
    // Метод для застосування фільтрів до запиту
    // static applyFilters(query, filters) {
    //     filters.forEach((filter) => {
    //         switch (filter.filterType) {
    //             case "search":
    //                 // Застосовуємо пошуковий фільтр з регулярним виразом
    //                 query.where(filter.fieldName).regex(new RegExp(filter.filterContent, "i"));
    //                 break;
    //             case "minValue":
    //                 // Фільтр для мінімального значення
    //                 query.where(filter.fieldName).gte(filter.filterContent);
    //                 break;
    //             case "maxValue":
    //                 // Фільтр для максимального значення
    //                 query.where(filter.fieldName).lte(filter.filterContent);
    //                 break;
    //             case "in":
    //                 // Фільтр для значень, що входять у список
    //                 query.where(filter.fieldName).in(filter.filterContent);
    //                 break;
    //             case "nin":
    //                 // Фільтр для значень, що не входять у список
    //                 query.where(filter.fieldName).nin(filter.filterContent);
    //                 break;
    //             case "exists":
    //                 // Фільтр для перевірки існування поля
    //                 query.where(filter.fieldName).exists(filter.filterContent);
    //                 break;
    //             // Додайте інші типи фільтрів за потреби
    //             default:
    //                 console.warn(`Unsupported filter type: ${filter.filterType}`);
    //         }
    //     });
    //     return query;
    // }
    // static applyFilters(query, filters) {
    //     const filterHandlers = new Map([
    //         ["search", (q, filter) => q.where(filter.fieldName).regex(new RegExp(filter.filterContent, "i"))],
    //         ["minValue", (q, filter) => q.where(filter.fieldName).gte(filter.filterContent)],
    //         ["maxValue", (q, filter) => q.where(filter.fieldName).lte(filter.filterContent)],
    //         ["rating", (q, filter) => q.where(filter.fieldName).gte(filter.filterContent)],
    //         ["in", (q, filter) => q.where(filter.fieldName).in(filter.filterContent)],
    //         ["nin", (q, filter) => q.where(filter.fieldName).nin(filter.filterContent)],
    //         ["exists", (q, filter) => q.where(filter.fieldName).exists(filter.filterContent)],
    //     ]);

    //     filters.forEach((filter) => {
    //         // Отримуємо відповідний обробник для типу фільтра
    //         const handler = filterHandlers.get(filter.filterType);
    //         if (handler) {
    //             // Викликаємо обробник, якщо він знайдений
    //             handler(query, filter);
    //         } else {
    //             console.warn(`Unsupported filter type: ${filter.filterType}`);
    //         }
    //     });

    //     return query;
    // static async getTableNames(pool, databaseName, productRegex) {
    //     try {
    //         const sql = `
    //         SELECT table_name
    //         FROM information_schema.tables
    //         WHERE table_schema = ? AND table_name REGEXP ?`;

    //         const [tables] = await pool.query(sql, [databaseName, productRegex]);

    //         if (tables.length === 0) {
    //             throw new Error("Table not found!");
    //         }

    //         return tables.map((row) => row.table_name);
    //     } catch (error) {
    //         console.error("Error fetching table names:", error);
    //         throw error;
    //     }
    // }

    //  WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
    //    OR title REGEXP ?
    static async getQuery(tableNames, fieldNames) {
        return (queries = tableNames.map(
            (table) =>
                `
                    SELECT  ${fieldNames.join(", ")}
                    FROM ${table}
                    INNER JOIN images AS image_store
                    ON ${table}.images_id = image_store._id
                    `
        ));
    }
    static applyFilters(queryParams, filter) {
        let query = queryParams;
        const params = [];

        const filterHandlers = new Map([
            [
                "search",
                (filter) => {
                    query = FiltersHelper.getQuery(
                        ["gamepads", "pcs", "laptops", "headphones"],
                        ["title", "image_1 AS image", "discount", "oldPrice", "newPrice", "quantity", "rating"]
                    );
                    if (query.length >= 1) {
                        query.join(" UNION ALL ");
                    }
                    params = tableNames.flatMap(() => [searchText, searchText]);
                },
            ],
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
                let query = FiltersHelper.getQuery();
                handler(query, filter);
            } else {
                console.warn(`Unsupported filter type: ${filter.filterType}`);
            }
        });

        return { query, params };
    }
    // }
    // Метод для застосування дій до запиту
    // static applyActions(query, actions) {
    //     actions.forEach((action) => {
    //         switch (action.type) {
    //             case "sort":
    //                 // Сортування результатів
    //                 query.sort({ [action.field]: action.order });
    //                 break;
    //             case "skip":
    //                 // Пропуск певної кількості результатів
    //                 query.skip(action.value);
    //                 break;
    //             case "limit":
    //                 // Обмеження кількості результатів
    //                 query.limit(action.value);
    //                 break;

    //             default:
    //                 console.warn(`Unsupported action type: ${action.type}`);
    //         }
    //     });
    //     return query;
    // }
    static applyActions(query, actions) {
        // Map, що асоціює типи дій з обробниками
        const actionHandlers = new Map([
            ["sort", (q, action) => q.sort({ [action.field]: action.order })],
            ["skip", (q, action) => q.skip(action.value)],
            ["limit", (q, action) => q.limit(action.value)],
        ]);

        actions.forEach((action) => {
            // Отримуємо обробник для типу дії
            const handler = actionHandlers.get(action.type);

            if (handler) {
                // Викликаємо обробник

                handler(query, action);
            } else {
                console.warn(`Unsupported action type: ${action.type}`);
            }
        });

        return query;
    }

    // Метод для застосування фільтрів та дій з запиту
    static applyFindOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
        const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        if (filters.length) query = this.applyFilters(query, filters);
        if (actions.length) query = this.applyActions(query, actions);
        return query;
    }

    // Метод для застосування лише фільтрів з запиту
    static applyFiltersOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
        const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        if (filters.length) query = this.applyFilters(query, filters);
        return query;
    }

    // Метод для застосування лише дій з запиту
    static applyActionsOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
        const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        if (actions.length) query = this.applyActions(query, actions);
        return query;
    }
}

export default FiltersHelper;
