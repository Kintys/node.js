import { createServer } from "node:http";
import settingJsonData from "./settings.json" assert { type: "json" };
import fs from "fs";
const server = createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    if (req.url.endsWith(settingJsonData.historyRoute)) {
        fs.createReadStream(settingJsonData.historyFilePath).pipe(res);
    } else {
        fs.createReadStream(settingJsonData.historyFilePath, "utf-8").on("data", (file) => {
            const history = JSON.parse(file);
            if (req.url in history) {
                history[req.url]++;
            } else {
                history[req.url] = 1;
            }

            fs.writeFile(settingJsonData.historyFilePath, JSON.stringify(history), (writeErr) => {
                if (writeErr) {
                    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
                    res.end("Файл пошкоджено\n");
                    return;
                }
                res.end("шлях записано\n");
            });
        });
    }
});
server.listen(3000, "127.0.0.1", () => {
    console.log("Listening on 127.0.0.1:3000");
});
