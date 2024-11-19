import express from "express";
import connectDB from "./db/connectDB.mjs";
import middleware from "./middleware/index.mjs";
import routes from "./routes/index.mjs";
import errorHandler from "./middleware/errorHandler.mjs";

const app = express();

connectDB();

middleware(app);

app.use("/", routes);

errorHandler(app);

export default app;
