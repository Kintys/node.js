import config from "../config/default.mjs";
// Імпортуємо необхідні модулі
import mongoose from "mongoose";
import mysql from "mysql2/promise";

// Встановлюємо глобальні проміси
mongoose.Promise = global.Promise;

// Функція для підключення до MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(config.db.mongo.mongoURI, {});
        console.log("Успішно підключено до MongoDB");
        return null;
    } catch (err) {
        console.error("Помилка підключення до MongoDB:", err);
    }
}

// Функція для підключення до MySQL
async function connectToMySQL() {
    try {
        const pool = mysql.createPool({
            host: config.db.mysql.host,
            user: config.db.mysql.user,
            password: config.db.mysql.password,
            database: config.db.mysql.database,
            multipleStatements: true,
        });
        console.log("Успішно підключено до MySQL");
        return pool;
    } catch (err) {
        console.error("Помилка підключення до MySQL:", err);
    }
}

// Головна функція для підключення до бази даних
async function connectToDatabase() {
    switch (config.db.type) {
        case "mongo":
            return await connectToMongoDB();
        case "mysql":
            return await connectToMySQL();
    }
}

const pool = await connectToDatabase();

export default pool;
