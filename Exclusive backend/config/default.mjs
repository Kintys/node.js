import dotenv from "dotenv";
dotenv.config();

export default Object.freeze({
    db: {
        type: process.env.DB_TYPE,
        mango: {
            databaseName: process.env.DATABASE_NAME,
            databaseUrl: process.env.MONGODB_URL,
            mongoURI: `${process.env.MONGODB_URL}${process.env.DATABASE_NAME}`,
        },
        mysql: {
            host: process.env.MYSQL_ADDON_HOST,
            user: process.env.MYSQL_ADDON_USER,
            port: process.env.MYSQL_ADDON_PORT,
            password: process.env.MYSQL_ADDON_PASSWORD,
            database: process.env.MYSQL_ADDON_DB,
            url: process.env.MYSQL_ADDON_URI,
        },
    },
    clientGoogleId: process.env.GOOGLE_CLIENT_ID,
    clientGoogleSecret: process.env.GOOGLE_CLIENT_SECRET,
    port: process.env.PORT,
});
