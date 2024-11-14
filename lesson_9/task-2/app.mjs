import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.mjs";
import studentRouter from "./routes/student.mjs";
import connectDB from "./db/connectDB.mjs";
import session from "express-session";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
// app.use(
//     session({
//         secret: "its a secret",
//         cookie: { maxAge: 60000 },
//         resave: false,
//         saveUninitialized: false,
//     })
// );

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/student", studentRouter);

app.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

export default app;
