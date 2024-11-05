import config from "../config/default.mjs";

import mongoose from "mongoose";

mongoose.Promise = global.Promise;

export default async function () {
    try {
        await mongoose.connect(config.mongoURI);
        console.log("Успішно підключено до MongoDB");
    } catch (err) {
        console.error("Помилка підключення до MongoDB:", err);
    }
}
