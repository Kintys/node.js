import QueryParser from "./QueryParser.mjs";

class FiltersMySQLHelper {
    // async getTableNameFromDb(tableName) {
    //     const sql = `
    //             SELECT table_name
    //             FROM information_schema.tables
    //             WHERE table_schema = '${_config.db.mysql.database}' AND table_name REGEXP ?`;

    //     const TableREGEXP = [...tableName].join("|").trim();

    //     const [tables] = await pool.query(sql, TableREGEXP);

    //     if (tables.length === 0) {
    //         throw new Error("Table not found!");
    //     }
    //     return (tableNames = tables.map((row) => row.table_name));
    // }
    //   if (!filterCondition && !filterParameters) {
    //     queryParts = tableNames
    //         .map((tableName) => {
    //             return `
    //         SELECT ${tableName}._id AS id, ${fieldsToSelect.join(", ")}
    //         FROM ${tableName}
    //         INNER JOIN images AS image_store
    //         ON ${tableName}.images_id = image_store._id
    //     `;
    //         })
    //         .join(" UNION ALL ");
    // } else {
    static async getQuery(queryConfig, filterCondition, filterParameters) {
        const { tableNames, fieldsToSelect } = queryConfig;
        const combinedParameters = [];
        const queryParts = tableNames
            .map((tableName) => {
                filterParameters ? combinedParameters.push(...filterParameters) : "";
                return `
                SELECT ${tableName}._id AS id, ${fieldsToSelect.join(", ")}
                FROM ${tableName}
                INNER JOIN images AS image_store
                ON ${tableName}.images_id = image_store._id
                ${filterCondition ? `WHERE ${filterCondition}` : ""}
            `;
            })
            .join(" UNION ALL ");
        return { queryParts, combinedParameters };
    }
    static async buildFilterQuery(filters) {
        let params = [];
        let query = "1=1";
        const filterHandlers = new Map([
            [
                "searchOne",
                (filter) => {
                    params = [filter.filterContent, filter.filterContent];
                    query = query.replace("1=1", "");
                    query += `MATCH(${filter.fieldName}) AGAINST(? IN NATURAL LANGUAGE MODE) OR ${filter.fieldName} REGEXP ?`;
                },
            ],
            [
                "searchMany",
                (filter) => {
                    params = [filter.filterContent];
                    query = query.replace("1=1", "");
                    query += `MATCH(${filter.fieldName.join(", ")}) AGAINST(? IN NATURAL LANGUAGE MODE)`;
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
                    params.push(parseInt(filter.filterContent));
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
                throw new Error(`Unsupported filter type: ${filter.filterType}`);
            }
        });
        return { query, params };
    }
    static async applyFilters(queryConfig, filters) {
        try {
            const { query, params } = await FiltersMySQLHelper.buildFilterQuery(filters);
            return await FiltersMySQLHelper.getQuery(queryConfig, query, params);
        } catch (error) {
            return error;
        }
    }

    // static applyFindOptionsFromQuery(reqQuery, fieldsConfiguration, selectedFields, tableName, query) {
    //     const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
    //     if (filters.length) query = this.applyFilters(selectedFields, tableName,filters);
    //     if (actions.length) query = this.applyActions(query, actions);
    //     return query;
    // }
    static async applyFiltersOptionsFromQuery(reqQuery, fieldsConfiguration, queryConfig) {
        const { filters } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        return await FiltersMySQLHelper.applyFilters(queryConfig, filters);
    }
    static applyActionsOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
        const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        if (actions.length) query = this.applyActions(query, actions);
        return query;
    }
}

export default FiltersMySQLHelper;
