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
    static async registerForm(req, res) {
        try {
            const id = req.params.id;
            let user = null;
            if (id) {
                //отримати об"єкт за id
                user = await UsersDBService.getById(id);
            }
            //відредерити сторінку з формою
            res.render("register", {
                errors: [],
                data: user,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    static async registerUser(req, res) {
        // Якщо валідація пройшла успішно, виконуємо логіку реєстрації
        const errors = validationResult(req);
        const data = req.body;

        if (!errors.isEmpty()) {
            if (req.params.id) data.id = req.params.id;
            return res.status(400).render("register", {
                errors: errors.array(),
                data,
            });
        }
        try {
            const { email, age, password, name } = req.body;
            console.log("====>>> req.body");
            console.log(req.body);
            if (req.params.id) {
                // Оновлюємо дані про користувача в базі даних
                await UsersDBService.update(req.params.id, {
                    email,
                    age,
                    password,
                    name,
                });
            } else {
                // Додаємо користувача в базу даних
                await UsersDBService.create({ email, age, password, name });
            }
            res.redirect("/users");
        } catch (err) {
            res.status(500).render("register", {
                errors: [{ msg: err.message }],
                data,
            });
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
