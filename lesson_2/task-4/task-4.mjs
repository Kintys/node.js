import { createServer } from "node:http";
import fs from "fs";
import routeJsonData from "./route.json" assert { type: "json" };
// Задача 4. Розробити серверну частину додатку, який за відповідними маршрутами (“/”, “/coffee”, “/music”) повертає створені HTML документи (розмістіть їх там же, де і додаток), що описують: інформацію про себе, інфорімацію про улюблену кав’ярню,  інформацію про улюблений музичний гурт.

const server = createServer(async (req, res) => {
    let isFoundRoute = false;
    for (const key in routeJsonData) {
        let urlParams = req.url.endsWith(key);
        if (urlParams) {
            isFoundRoute = true;
            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            fs.createReadStream(routeJsonData[key])
                .on("error", (err) => {
                    if (err) res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                    return res.end("Файл пошкоджено!");
                })
                .pipe(res);
        }
    }
    if (!isFoundRoute) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Вказано невірний шлях\n");
    }
});
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
