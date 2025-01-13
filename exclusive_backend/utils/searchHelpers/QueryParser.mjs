class QueryParser {
    static filterMethods = new Map([
        [
            "brands",
            (fieldName, filterValue) => [
                {
                    fieldName,
                    filterType: "brands",
                    filterContent: filterValue,
                },
            ],
        ],
        [
            "searchOne",
            (fieldName, filterValue) => [
                {
                    fieldName,
                    filterType: "searchOne",
                    filterContent: filterValue,
                },
            ],
        ],
        [
            "searchMany",
            (fieldName, filterValue, fieldOptions) => [
                {
                    fieldName: fieldOptions,
                    filterType: "searchMany",
                    filterContent: filterValue,
                },
            ],
        ],
        [
            "rating",
            (fieldName, filterValue) => [
                {
                    fieldName,
                    filterType: "rating",
                    filterContent: filterValue,
                },
            ],
        ],
        [
            "range",
            (fieldName, filterValue) => {
                let minValue, maxValue;
                if (filterValue.includes("-")) {
                    filterValue = filterValue.split("-");
                }
                if (!Array.isArray(filterValue)) {
                    filterValue = [filterValue];
                }
                filterValue.forEach((val) => {
                    if (val.startsWith("gte:")) minValue = parseFloat(val.slice(4));
                    if (val.startsWith("lte:")) maxValue = parseFloat(val.slice(4));
                });
                const filtersContent = [];
                if (!isNaN(minValue) && !isNaN(maxValue)) {
                    filtersContent.push({
                        fieldName,
                        filterType: "range",
                        filterContent: [minValue, maxValue],
                    });
                }
                return filtersContent;
            },
        ],
    ]);

    static filtersParser(fieldsConfigurations, query) {
        const filters = [];
        fieldsConfigurations.forEach(({ fieldName, filterCategory, fieldOptions }) => {
            if (query[fieldName] && QueryParser.filterMethods.has(filterCategory)) {
                const parseMethod = QueryParser.filterMethods.get(filterCategory);
                filters.push(...parseMethod(fieldName, query[fieldName], fieldOptions));
            }
        });
        return filters;
    }

    static actionsParser(query) {
        const actions = [];
        if (query.sort) {
            const [field, order] = query.sort.split(":");
            actions.push({ type: "sort", field, order: order === "desc" ? "DESC" : "ASC" });
        }
        if (query.page && query.perPage) {
            actions.push({
                type: "pagination",
                skipValue: query.page * query.perPage,
                limitValue: parseInt(query.perPage),
            });
        }
        return actions;
    }
    static categoryParser(query, queryBaseConfig) {
        let newConfig = queryBaseConfig;
        if (query.category) {
            newConfig = { ...queryBaseConfig, tableNames: [...query.category] };
        }
        return newConfig;
    }

    static parseQuery(query, fieldsConfigurations, queryBaseConfig) {
        const filters = this.filtersParser(fieldsConfigurations, query);
        const actions = this.actionsParser(query);
        const queryConfig = this.categoryParser(query, queryBaseConfig);
        return { filters, actions, queryConfig };
    }
}
export default QueryParser;
