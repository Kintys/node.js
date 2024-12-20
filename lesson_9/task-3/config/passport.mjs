import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import UsersDBService from "../modules/user/UsersDBService.mjs";
// import User from "../models/user/User.mjs";

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await UsersDBService.findOne({ username }, {}, []);
            if (!user) {
                return done(null, false, { message: "Incorrect name." });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // const user = await User.findById(id)
        const user = await UsersDBService.findOne({ _id: id }, {}, []);
        console.log(user);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
