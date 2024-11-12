import { validationResult } from "express-validator";
import UsersDBService from "../modules/user/UserDBService.mjs";

class UserController {
    static async usersList(req, res) {
        try {
            const dataList = await UsersDBService.getList();
            res.render("usersList", {
                users: dataList,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    static registerForm(req, res) {
        res.render("register");
    }
    static async registerUser(req, res) {
        try {
            const { password, name } = req.body;
            await UsersDBService.create({ password, name });
            req.session.sort = { price: -1 };
            res.redirect("/product/list");
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static async deleteUser(req, res) {
        try {
            await UsersDBService.deleteById(req.body.id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to delete user" });
        }
    }
}
export default UserController;
