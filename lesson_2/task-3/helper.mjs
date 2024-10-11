function extractNumbers(data) {
    return data.match(/\d+/g);
}

function calculateSum(data) {
    const values = extractNumbers(data);
    return values.reduce((acc, el) => parseInt(acc) + parseInt(el));
}

function calculateProduct(data) {
    const values = extractNumbers(data);
    return values.reduce((acc, el) => parseInt(acc) * parseInt(el), 1);
}
function calculateSubtract(data) {
    const values = extractNumbers(data);
    if (values.length === 0) return 0;
    return values.reduce((acc, el) => acc - parseInt(el, 10));
}

function createResponse(statusCode, messageCallback) {
    return {
        header: { "Content-Type": "text/plain; charset=utf-8" },
        code: statusCode,
        answer: messageCallback(),
    };
}

function calculateParams(category, values) {
    switch (category) {
        case "add":
            const sum = calculateSum(values);
            return createResponse(200, () => `Результат суми чисел ${sum}`);
        case "subtract":
            const subtract = calculateSubtract(values);
            return createResponse(200, () => `Результат віднімання чисел ${subtract}`);
        case "mult":
            const mult = calculateProduct(values);
            return createResponse(200, () => `Результат добутку чисел ${mult}`);
        default:
            return;
    }
}
function handleRequest(url) {
    const objPatterns = {
        add: /^\/add\/(\d+(-\d+)*)$/,
        subtract: /^\/subtract\/(\d+(-\d+)*)$/,
        mult: /^\/mult\/(\d+(-\d+)*)$/,
    };
    for (const key in objPatterns) {
        if (objPatterns[key].test(url)) {
            const match = url.match(objPatterns[key]);
            return calculateParams(key, match[1]);
        }
    }

    return createResponse(200, () => "Вітаємо на сайті");
}

export { handleRequest };
