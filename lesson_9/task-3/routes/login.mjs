import express from "express";
import passport from "passport";
const router = express.Router();

router.get("/", (req, res) => {
    res.render("login", { messages: null });
});

router.post(
    "/",
    (req, res, next) => {
        next();
    },
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        // failureRedirect: '/',
        // failureFlash: true,
    })
    // function (req, res) {
    //   res.redirect('/')
    // });
);

// Маршрут для виходу з системи
router.get("/", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

export default router;
