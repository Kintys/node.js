// function makeResponse(url) {
//     if (url === "/ok") return "Bcе добре! \n";
//     else if (url === "/hello") return "Привіт!\n";
//     else return "Вітаємо на сайті!\n";
// }

// function run() {
//     console.log("Привіт із хелпера!!");
// }

// if (import.meta.filename === process.argv[1]) run();
// // console.log(import.meta.filename === process.argv[1]);
// // console.log(import.meta.filename);
// console.log(process.argv);
// export { makeResponse };

// function getSum(data) {
//     const dataValues = getDataValues(data);
//     return dataValues.reduce((acc, el) => (acc = parseInt(el) + parseInt(acc)));
// }
// function getProductMult(data) {
//     const dataValues = getDataValues(data);
//     return dataValues.reduce((acc, el) => {
//         return (acc = el * acc);
//     }, 1);
// }
// function getDataValues(data) {
//     return data.match(/\d+/g);
// }
// function answerParams(statusCode, callBackFn) {
//     return {
//         header: { "Content-Type": "text/plain; charset=utf-8" },
//         code: statusCode,
//         answer: callBackFn(),
//     };
// }
// function getAnswer(url) {
//     const filePath = "sum_num";
//     const sumNumPattern = /^\/sum_num\/(\d+)$/;
//     const match = url.match(sumNumPattern);
//     if (match) {
//         try {
//             fs.appendFileSync(filePath, `${match[1]}\n`);
//             return answerParams(200, () => `Число додано`);
//         } catch (err) {
//             return answerParams(500, () => "Помилка при записі у файл!");
//         }
//     } else if (url.endsWith("/sum")) {
//         if (fs.existsSync(filePath)) {
//             try {
//                 const data = fs.readFileSync(filePath, "utf-8");
//                 return answerParams(200, () => `сумма чисел ${getSum(data)}`);
//             } catch (err) {
//                 return answerParams(500, () => "Помилка!");
//             }
//         } else {
//             return answerParams(500, () => "Файла не існує");
//         }
//     } else if (url.endsWith("/mult")) {
//         if (fs.existsSync(filePath)) {
//             try {
//                 const data = fs.readFileSync(filePath, "utf-8");
//                 return answerParams(200, () => `добуток чисел ${getProductMult(data)}`);
//             } catch (err) {
//                 return answerParams(500, () => "Помилка!");
//             }
//         } else {
//             return answerParams(500, () => "Файла не існує");
//         }
//     }

//     return answerParams(200, () => "Вітаємо на сайті");
// }
