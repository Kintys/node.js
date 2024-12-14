import session from "express-session";

const sessionConfig = session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
});

export default sessionConfig;
