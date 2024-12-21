class QueryParser {
    /**
     * range - Парсить фільтр діапазону значень.
     *
     * @param {string} fieldName - Назва поля, для якого застосовується цей фільтр.
     * @param {string|string[]} filterValue - Значення фільтра, яке може мати такі формати:
     *   - Число (наприклад, 10)
     *   - Діапазон, розділений дефісом (наприклад, "10-20")
     *   - Масив об'єктів з операторами порівняння (наприклад, [{gte: 10}, {lte: 20}])
     * @returns {object[]} - Масив об'єктів фільтрів.
     */
    // static range(fieldName, filterValue) {
    //     let minValue, maxValue;

    //     // Перевіряє, чи значення фільтра містить розділювач '-' (дефіс)
    //     if (filterValue.includes("-")) {
    //         // Якщо так, розділяє значення фільтра на мінімальне та максимальне значення за допомогою методу split
    //         // та переводить їх у числа за допомогою parseFloat
    //         [minValue, maxValue] = filterValue.split("-").map(parseFloat);
    //     } else {
    //         // Якщо немає дефіса, перевіряє, чи значення фільтра є масивом
    //         if (!Array.isArray(filterValue)) {
    //             // Якщо не масив, перетворює його в масив з одним елементом
    //             filterValue = [filterValue];
    //         }

    //         // Ітерація по кожному значенню в масиві filterValue
    //         filterValue.forEach((val) => {
    //             // Перевіряє, чи значення починається з 'gte:', що означає мінімальне значення (більше або дорівнює)
    //             if (val.startsWith("gte:")) {
    //                 minValue = parseFloat(val.slice(4));
    //             }
    //             // Перевіряє, чи значення починається з 'lte:', що означає максимальне значення (менше або дорівнює)
    //             if (val.startsWith("lte:")) {
    //                 maxValue = parseFloat(val.slice(4));
    //             }
    //         });
    //     }

    //     const filtersContent = [];

    //     // Якщо мінімальне значення не NaN (число), додає його до масиву фільтрів
    //     if (!isNaN(minValue)) {
    //         filtersContent.push({
    //             fieldName,
    //             filterType: "minValue",
    //             filterContent: minValue,
    //         });
    //     }

    //     // Якщо максимальне значення не NaN (число), додає його до масиву фільтрів
    //     if (!isNaN(maxValue)) {
    //         filtersContent.push({
    //             fieldName,
    //             filterType: "maxValue",
    //             filterType: "maxValue",
    //             filterContent: maxValue,
    //         });
    //     }

    //     return filtersContent;
    // }

    // //Парсить фільтр списку значень (розділених комою).
    // static list(fieldName, filterValue) {
    //     return [
    //         {
    //             fieldName,
    //             filterType: "in",
    //             filterContent: filterValue.split(","),
    //         },
    //     ];
    // }

    // //Парсить фільтр значення для пошуку
    // static search(fieldName, filterValue) {
    //     return [
    //         {
    //             fieldName,
    //             filterType: "search",
    //             filterContent: filterValue,
    //         },
    //     ];
    // }

    // //------- парсимо всі фільтри ---------
    // static filtersParser(fieldsConfigurations, query) {
    //     const filters = [];
    //     fieldsConfigurations.forEach(({ fieldName, filterCategory }) => {
    //         if (query[fieldName]) filters.push(...this[filterCategory](fieldName, query[fieldName]));
    //     });
    //     console.log(filters);
    //     return filters;
    // }

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
            (fieldName, filterValue) => [
                {
                    fieldName,
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
        fieldsConfigurations.forEach(({ fieldName, filterCategory }) => {
            if (query[fieldName] && QueryParser.filterMethods.has(filterCategory)) {
                const parseMethod = QueryParser.filterMethods.get(filterCategory);
                filters.push(...parseMethod(fieldName, query[fieldName]));
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
