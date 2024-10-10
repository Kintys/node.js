import fs from "fs";

function addNumberToTextFile(url, pattern) {
    const match = req.url.match(pattern);
    try {
        fs.appendFileSync("sum_num", `${match[1]}\n`);
        res.end();
    } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.statusCode = 500;
        res.end("помилка!");
        return;
    }
}

export { addNumberToTextFile };
