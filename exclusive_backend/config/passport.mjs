import config from "../config/default.mjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";

import UsersDBService from "../src/v1/models/mysql/user/UsersDBService.mjs";
// Налаштування локальної стратегії
passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await UsersDBService.findUserByEmail({ email: email });
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
passport.use(
    new GoogleStrategy(
        {
            clientID: config.clientGoogleId,
            clientSecret: config.clientGoogleSecret,
            callbackURL: "https://exclusive-ed8a.onrender.com/api/v1/auth/google/callback",
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                let user = await UsersDBService.findUserByEmail({ email: profile["emails"][0].value });
                if (!user) {
                    user = await UsersDBService.createNewAccountWithGoogleProfile({
                        email: profile["emails"][0].value,
                        username: profile["displayName"],
                        avatar: profile["photos"][0].value,
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Серіалізація користувача
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Десеріалізація користувача
passport.deserializeUser(async (user, done) => {
    // try {
    //     // const user = await User.findById(id)
    //     const user = await UsersDBService.findOne({ _id: id }, {}, ["type"]);
    //     done(null, user);
    // } catch (error) {
    //     done(error);
    // }
    done(null, user);
});

export default passport;
