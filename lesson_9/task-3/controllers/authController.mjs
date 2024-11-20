import passport from "passport";

class AuthController {
    static async login(req, res) {
        try {
            passport.authenticate("local", {
                // successRedirect: "/courses",
                failureRedirect: "/",
            });
        } catch (error) {}
        return;
    }

    static logout(req, res) {
        req.logout();
        res.render("/login", { message: "Logged out successfully" });
    }
}

export default AuthController;
