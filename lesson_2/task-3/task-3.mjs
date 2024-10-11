import { createServer } from "node:http";
import { handleRequest } from "./helper.mjs";

// Задача 3. Через параметри запиту передають операцію (add, subtract, mult) і числа (розділені дефісами), які треба опрацювати. Знайти результат і повернути користувачу. Наприклад при запиті:
// http://localhost:3000/add/12-4-23-45   - треба знайти суму чисел 12,4,23,45

const server = createServer(async (req, res) => {
    const { answer, code, header } = handleRequest(req.url);
    res.writeHead(code, header);
    res.end(answer);
});
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
