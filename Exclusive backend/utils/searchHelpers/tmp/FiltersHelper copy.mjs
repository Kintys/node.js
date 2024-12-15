import QueryParser from "./QueryParser.mjs";

class FiltersHelper {
    static async getQuery(tableNames, fieldNames) {
        return tableNames.map(
            (table) => `
                SELECT ${fieldNames.join(", ")}
                FROM ${table}
                INNER JOIN images AS image_store
                ON ${table}.images_id = image_store._id
            `
        );
    }

    static applyFilters(filters, tableNames) {
        let params = [];
        let query;
        let searchCondition;
        const filterHandlers = new Map([
            [
                "search",
                (filter) => {
                    searchCondition = `
                        WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
                        OR title REGEXP ?
                        `;
                    params = tableNames.flatMap(() => [filter.filterContent, filter.filterContent]);
                    query = this.getQuery(tableNames, searchCondition);
                },
            ],
            [
                "minValue",
                (filter) => {
                    searchCondition = `WHERE 1=1 AND ${filter.fieldName} >= ?`;
                    query = this.getQuery(tableNames, searchCondition);
                    params.push(filter.filterContent);
                },
            ],
            [
                "maxValue",
                (filter) => {
                    searchCondition = `WHERE 1=1 AND ${filter.fieldName} <= ?`;
                    query = this.getQuery(tableNames, searchCondition);
                    params.push(filter.filterContent);
                },
            ],
            [
                "rating",
                (filter) => {
                    searchCondition += `WHERE 1=1 AND ${filter.fieldName} >= ?`;
                    query = this.getQuery(tableNames, searchCondition);
                    params.push(filter.filterContent);
                },
            ],
            [
                "in",
                (filter) => {
                    const placeholders = filter.filterContent.map(() => "?").join(", ");
                    searchCondition += `WHERE 1=1 AND ${filter.fieldName} IN (${placeholders})`;
                    query = this.getQuery(tableNames, searchCondition);
                    params.push(...filter.filterContent);
                },
            ],
            [
                "nin",
                (filter) => {
                    const placeholders = filter.filterContent.map(() => "?").join(", ");
                    searchCondition += `WHERE 1=1 AND ${filter.fieldName} NOT IN (${placeholders})`;
                    query = this.getQuery(tableNames, searchCondition);
                    params.push(...filter.filterContent);
                },
            ],
        ]);
        filters.forEach((filter) => {
            const handler = filterHandlers.get(filter.filterType);
            if (handler) {
                return handler(filter);
            } else {
                console.warn(`Unsupported filter type: ${filter.filterType}`);
            }
        });
    }
    static applyFilters(filters) {}

    // static applyActions(query, actions) {
    //     actions.forEach((action) => {
    //         switch (action.type) {
    //             case "sort":
    //                 query.sort({ [action.field]: action.order });
    //                 break;
    //             case "skip":
    //                 query.skip(action.value);
    //                 break;
    //             case "limit":
    //                 query.limit(action.value);
    //                 break;

    //             default:
    //                 console.warn(`Unsupported action type: ${action.type}`);
    //         }
    //     });
    //     return query;
    // }
    static applyFindOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
        const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        if (filters.length) query = this.applyFilters(query, filters);
        if (actions.length) query = this.applyActions(query, actions);
        return query;
    }
    static applyFiltersOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
        const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        if (filters.length) query = this.applyFilters(query, filters);
        return query;
    }
    static applyActionsOptionsFromQuery(reqQuery, fieldsConfiguration, query) {
        const { filters, actions } = QueryParser.parseQuery(reqQuery, fieldsConfiguration);
        if (actions.length) query = this.applyActions(query, actions);
        return query;
    }
}

export default FiltersHelper;
