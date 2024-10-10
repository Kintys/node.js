// // server.mjs

// import { createServer } from "node:http";

// import { makeResponse } from "./helper.mjs";

// const server = createServer((req, res) => {
//     res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
//     const text = makeResponse(req.url);
//     res.end(text);
// });
// // starts a simple http server locally on port 3000
// server.listen(3000, "127.0.0.1", () => {
//     console.log("Listening on 127.0.0.1:3000");
// });
// // run with `node server.mjs`

// const paramsList = process.argv.slice(2).join("&");
// const args = new URLSearchParams(paramsList);
// const value_1 = args.get("--name");

// console.log(args);
// console.log(paramsList);
// console.log(value_1);
