import { createServer } from "node:http";
import { handleRequest } from "../task-3/helper.mjs";

// Задача 2. Користувач через роут ‘/save_num/число’ може передати на сервер якесь число. Ці числа поступово треба зберігати у текстовому файлі numbers.txt. Наприклад, використовуючи такий роут:
// http://localhost:3000/save_num/78  -  у файл треба додати число 78.

const server = createServer(async (req, res) => {
    const { answer, code, header } = handleRequest(req.url);
    res.writeHead(code, header);
    res.end(answer);
});
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
