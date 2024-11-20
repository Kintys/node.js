import UsersDBService from "../modules/user/UsersDBService.mjs";

class UserController {
    static async usersList(req, res) {
        try {
            const filters = {};
            for (const key in req.query) {
                if (req.query[key]) filters[key] = req.query[key];
            }

            const dataList = await UsersDBService.getList(filters);

            res.render("usersList", {
                users: dataList,
                user: req.user,
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    static async registerForm(req, res) {
        try {
            //відредерити сторінку з формою
            res.render("register");
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    static async registerUser(req, res) {
        const data = req.body;
        try {
            if (req.params.id) {
                // Оновлюємо дані про користувача в базі даних
                await UsersDBService.update(req.params.id, data);
            } else {
                console.log(data);
                // Додаємо користувача в базу даних
                await UsersDBService.create(data);
            }

            res.redirect("/");
        } catch (err) {
            res.status(401).send("err");
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
