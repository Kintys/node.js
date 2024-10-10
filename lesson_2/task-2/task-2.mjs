import { createServer } from "node:http";
import path from "node:path";
import fs from "fs";
const server = createServer(async (req, res) => {
    const filePath = path.join("D:", "courses", "js", "node.js", "lesson_2", "sum_num");
    const sumNumPattern = /^\/sum_num\/(\d+)$/;
    // const match = req.url.match(urlPattern);
    if (req.url.match(sumNumPattern)) {
        try {
            fs.appendFileSync("sum_num", `${match[1]}\n`);
            res.end("Число додано!");
        } catch (err) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.statusCode = 500;
            res.end("Помилка при записі у файл!");
        }
    }
    if (req.url.endsWith("/sum")) {
        console.log(fs.existsSync("sum_num.txt"));
        if (fs.existsSync(filePath)) {
            try {
                const data = fs.readFileSync(filePath, "utf-8");
                res.writeHead({ "Content-Type": "text/plain; charset=utf-8" });
                console.log(data);
                res.end(data);
            } catch (err) {
                res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                res.statusCode = 500;
                res.end("помилка!");
            }
        } else {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.statusCode = 500;
            res.end("помилка!");
        }
    }
    res.end();
});
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
