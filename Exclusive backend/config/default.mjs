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
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
        },
    },
    clientGoogleId: process.env.GOOGLE_CLIENT_ID,
    clientGoogleSecret: process.env.GOOGLE_CLIENT_SECRET,
    port: process.env.PORT,
});
