import { prepareToken } from "../../../utils/jwtHelpers.mjs";
import UsersDBService from "../models/mysql/user/UsersDBService.mjs";

class AuthController {
    static async signup(req, res) {
        try {
            if (!req.body.email) {
                return res.status(401).json({ error: "Email is required" });
            }
            if (!req.body.password) {
                return res.status(401).json({ error: "Password is required" });
            }
            const user = await UsersDBService.createAndReturnNewUser({
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
            });
            const token = prepareToken(
                {
                    id: user._id,
                    username: user.username,
                },
                req.headers
            );
            res.status(200).json({
                user,
                token,
            });
        } catch (err) {
            res.status(500).json({ error: "Signup error" });
        }
    }

    static async login(req, res) {
        // const email = await UsersDBService.findOneUser({ email: "igor@gmail.com" });
        // console.log(email);
        // res.send("ok");
        // if (!req.user) {
        //     return res.status(401).json({ error: "User not found" });
        // }
        // try {
        //     const user = await UsersDBService.findOne(
        //         {
        //             email: req.user.email,
        //         },
        //         { password: 0 }
        //     );
        //     if (!user) {
        //         return res.status(401).json({ error: "User not found" });
        //     }
        //     const token = prepareToken(
        //         {
        //             id: user._id,
        //             username: user.username,
        //         },
        //         req.headers
        //     );
        //     res.json({
        //         user,
        //         token,
        //     });
        // } catch (err) {
        //     res.status(401).json({ error: "Login error" });
        // }
    }
    // static async login(req, res, next) {
    //     passport.authenticate("local", async (err, user, info) => {
    //         if (err) {
    //             return res.status(500).json({ success: false, message: "Server error", error: err });
    //         }

    //         if (!user) {
    //             return res.status(401).json({ success: false, message: info.message });
    //         }

    //         try {
    //             const token = prepareToken(
    //                 {
    //                     id: user._id,
    //                     username: user.username,
    //                 },
    //                 req.headers
    //             );

    //             // Відправляємо відповідь на фронтенд
    //             return res.json({
    //                 success: true,
    //                 user: {
    //                     id: user._id,
    //                     username: user.username,
    //                     email: user.email, // Додавайте інші поля за потреби
    //                 },
    //                 token,
    //             });
    //         } catch (err) {
    //             return res.status(500).json({ success: false, message: "Token generation error", error: err });
    //         }
    //     })(req, res, next);
    // }
    static async unLogin(req, res) {
        console.log("unlogin");
        console.log(req);
    }
    static async sendToken(req, res) {
        try {
            if (!req.user) {
                res.redirect(`http://localhost:5173/singUp`);
            }
            const token = prepareToken(
                {
                    id: req.user._id,
                    username: req.user.username,
                },
                req.headers
            );
            res.redirect(`http://localhost:5173/singUp?token=${token}`);
        } catch (error) {
            res.redirect("http://localhost:5173/123213");
        }
    }
    static async loginWithGoogle(req, res) {
        try {
            // if (!req.user) {
            //     res.json({ err: "error" });
            // }

            const user = await UsersDBService.getUserProfileByIdWithOutPassword(req.user.id);
            console.log(user);
            // const token = prepareToken(
            //     {
            //         id: req.user._id,
            //         username: req.user.username,
            //     },
            //     req.headers
            // );
            res.json({ user });
        } catch (error) {
            res.json({ msg: "error" });
        }
    }
}

export default AuthController;
//   buildFilterQuery(filters, tableNames) {
//         let fullQuery = "";
//         let allParams = [];

//         const filterHandlers = new Map([
//             [
//                 "search",
//                 (filter) => {
//                     return {
//                         query: `WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)
//                     OR title REGEXP ?
//                 `,
//                         params: tableNames.flatMap(() => [filter.filterContent, filter.filterContent]),
//                     };
//                 },
//             ],
//             [
//                 "minValue",
//                 (filter) => {
//                     return {
//                         query: `WHERE 1=1 AND ${filter.fieldName} >= ?`,
//                         params: [filter.filterContent],
//                     };
//                 },
//             ],
//             [
//                 "maxValue",
//                 (filter) => {
//                     return {
//                         query: `WHERE 1=1 AND ${filter.fieldName} <= ?`,
//                         params: [filter.filterContent],
//                     };
//                 },
//             ],
//             [
//                 "rating",
//                 (filter) => {
//                     return {
//                         query: `WHERE 1=1 AND ${filter.fieldName} >= ?`,
//                         params: [filter.filterContent],
//                     };
//                 },
//             ],
//             [
//                 "in",
//                 (filter) => {
//                     const placeholders = filter.filterContent.map(() => "?").join(", ");
//                     return {
//                         query: `WHERE 1=1 AND ${filter.fieldName} IN (${placeholders})`,
//                         params: filter.filterContent,
//                     };
//                 },
//             ],
//             [
//                 "nin",
//                 (filter) => {
//                     const placeholders = filter.filterContent.map(() => "?").join(", ");
//                     return {
//                         query: `WHERE 1=1 AND ${filter.fieldName} NOT IN (${placeholders})`,
//                         params: filter.filterContent,
//                     };
//                 },
//             ],
//             [
//                 "exists",
//                 (filter) => {
//                     return {
//                         query: filter.filterContent
//                             ? `WHERE 1=1 AND ${filter.fieldName} IS NOT NULL`
//                             : `WHERE 1=1 AND ${filter.fieldName} IS NULL`,
//                         params: [],
//                     };
//                 },
//             ],
//         ]);
//         filters.forEach((filter) => {
//             const handler = filterHandlers.get(filter.filterType);
//             if (handler) {
//                 const { query, params } = handler(filter);
//                 fullQuery += ` ${this.getQuery(tableNames, query)}`;
//                 allParams.push(...params);
//             } else {
//                 console.warn(`Unsupported filter type: ${filter.filterType}`);
//             }
//         });
//         return { fullQuery, params: allParams };
//     }
