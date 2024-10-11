import fs from "fs";

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

function createResponse(statusCode, messageCallback) {
    return {
        header: { "Content-Type": "text/plain; charset=utf-8" },
        code: statusCode,
        answer: messageCallback(),
    };
}

function addNumberToFile(filePath, number) {
    try {
        fs.appendFileSync(filePath, `${number}\n`);
        return createResponse(200, () => `Число додано`);
    } catch (err) {
        return createResponse(500, () => "Помилка при записі у файл!");
    }
}

function calculateFromFile(filePath, calculationFunction, resultMessage) {
    if (!fs.existsSync(filePath)) {
        return createResponse(500, () => "Файла не існує");
    }

    try {
        const data = fs.readFileSync(filePath, "utf-8");
        const result = calculationFunction(data);
        return createResponse(200, () => `${resultMessage}: ${result}`);
    } catch (err) {
        return createResponse(500, () => "Помилка!");
    }
}
function deleteNumberToFile(filePath, resultMessage) {
    if (!fs.existsSync(filePath)) return createResponse(500, () => "Файла не існує");

    try {
        fs.unlinkSync(filePath);
        return createResponse(200, () => `${resultMessage}`);
    } catch (err) {
        return createResponse(500, () => "Помилка!");
    }
}
function handleRequest(url) {
    const filePath = "sum_num";
    const numberPattern = /^\/sum_num\/(\d+)$/;
    const match = url.match(numberPattern);

    if (match) {
        return addNumberToFile(filePath, match[1]);
    }

    if (url.endsWith("/sum")) {
        return calculateFromFile(filePath, calculateSum, "сумма чисел");
    }

    if (url.endsWith("/mult")) {
        return calculateFromFile(filePath, calculateProduct, "добуток чисел");
    }
    if (url.endsWith("/remove")) {
        return deleteNumberToFile(filePath, "файл видалено");
    }

    return createResponse(200, () => "Вітаємо на сайті");
}

export { handleRequest };
