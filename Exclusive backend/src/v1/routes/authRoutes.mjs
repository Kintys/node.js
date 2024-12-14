import express from "express";
import passport from "passport";
import AuthController from "../controllers/authController.mjs";

const router = express.Router();

router.post("/signup", AuthController.signup);
// router.get("/login", AuthController.login);
router.get(
    "/login/google",
    passport.authenticate("google", {
        access_type: "offline",
        scope: ["email", "profile"],
    })
);

router.post(
    "/login",
    (req, res, next) => {
        next();
    },
    // passport.authenticate("local", {
    //     // successRedirect: '/users',
    //     failureRedirect: "/auth/login/fail",
    //     // failureRedirect: '/',
    //     // failureFlash: true,
    // }),
    AuthController.login
);
router.get("/login", AuthController.login);

router.get("/login/fail", AuthController.unLogin);

router.get("/google/callback", passport.authenticate("google", { authInfo: false }), AuthController.sendToken);
router.get("/user", AuthController.loginWithGoogle);
export default router;
