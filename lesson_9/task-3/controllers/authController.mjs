import passport from "passport";

class AuthController {
    static login(req, res) {
        passport.authenticate("local", {
            successRedirect: "/courses",
            successMessage: "ok",
            failureRedirect: "/",
            failureMessage: "Not Found",
        });
    }

    static logout(req, res) {
        req.logout();
        res.render("/login", { message: "Logged out successfully" });
    }
}

export default AuthController;
