class QueryParser {
    // static range(fieldName, filterValue) {
    //     let minValue, maxValue;
    //     if (filterValue.includes("-")) [minValue, maxValue] = filterValue.split("-").map(parseFloat);
    //     else {
    //         if (!Array.isArray(filterValue)) {
    //             filterValue = [filterValue];
    //         }
    //         filterValue.forEach((val) => {
    //             if (val.startsWith("gte:")) minValue = parseFloat(val.slice(4));
    //             if (val.startsWith("lte:")) maxValue = parseFloat(val.slice(4));
    //         });
    //     }

    //     const filtersContent = [];
    //     if (!isNaN(minValue)) {
    //         filtersContent.push({
    //             fieldName,
    //             filterType: "minValue",
    //             filterContent: minValue,
    //         });
    //     }
    //     if (!isNaN(maxValue)) {
    //         filtersContent.push({
    //             fieldName,
    //             filterType: "maxValue",
    //             filterContent: maxValue,
    //         });
    //     }
    //     return filtersContent;
    // }

    // static list(fieldName, filterValue) {
    //     return [
    //         {
    //             fieldName,
    //             filterType: "in",
    //             filterContent: filterValue.split(","),
    //         },
    //     ];
    // }

    // static search(fieldName, filterValue) {
    //     return [
    //         {
    //             fieldName,
    //             filterType: "search",
    //             filterContent: filterValue,
    //         },
    //     ];
    // }
    // static rating(fieldName, filterValue) {
    //     return [{ fieldName, filterType: "rating", filterContent: filterValue }];
    // }
    static filterMethods = new Map([
        [
            "list",
            (fieldName, filterValue) => [
                {
                    fieldName,
                    filterType: "in",
                    filterContent: filterValue.split(","),
                },
            ],
        ],
        [
            "search",
            (fieldName, filterValue) => [
                {
                    fieldName,
                    filterType: "search",
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
                    [minValue, maxValue] = filterValue.split("-").map(parseFloat);
                } else {
                    if (!Array.isArray(filterValue)) {
                        filterValue = [filterValue];
                    }
                    filterValue.forEach((val) => {
                        if (val.startsWith("gte:")) minValue = parseFloat(val.slice(4));
                        if (val.startsWith("lte:")) maxValue = parseFloat(val.slice(4));
                    });
                }

                const filtersContent = [];
                if (!isNaN(minValue)) {
                    filtersContent.push({
                        fieldName,
                        filterType: "minValue",
                        filterContent: minValue,
                    });
                }
                if (!isNaN(maxValue)) {
                    filtersContent.push({
                        fieldName,
                        filterType: "maxValue",
                        filterContent: maxValue,
                    });
                }
                return filtersContent;
            },
        ],
    ]);
    //-------
    static filtersParser(fieldsConfigurations, query) {
        const filters = [];
        fieldsConfigurations.forEach(({ fieldName, filterCategory }) => {
            if (query[fieldName] && QueryParser.filterMethods.has(filterCategory)) {
                const parseMethod = QueryParser.filterMethods.get(filterCategory);
                filters.push(...parseMethod(fieldName, query[fieldName]));
            }
        });
        console.log(fieldsConfigurations);
        return filters;
    }
    // Парсимо дії
    static actionsParser(query) {
        const actions = [];
        if (query.sort) {
            const [field, order] = query.sort.split(":");
            actions.push({ type: "sort", field, order: order === "desc" ? -1 : 1 });
        }
        if (query.page && query.perPage) {
            actions.push({ type: "skip", value: query.page * query.perPage });
            actions.push({ type: "limit", value: parseInt(query.perPage) });
        }
        return actions;
    }
    static parseQuery(query, fieldsConfigurations) {
        const filters = this.filtersParser(fieldsConfigurations, query);
        const actions = this.actionsParser(query);
        return { filters, actions };
    }
}
export default QueryParser;
