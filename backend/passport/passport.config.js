import passport, { use } from "passport";
import { GraphQLLocalStrategy } from "graphql-passport";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const configurePassport = () => {
    passport.serializeUser((user, done) => {
        console.log("user serialised");
        done(null, user.id)
    })

    passport.deserializeUser(async (id, none) => {
        console.log("deserializing user")
        try {
            const user = await User.findById(id);
            done(null, user)

        } catch(err) {
            done(err)
        }
    })

    passport.use(
        new GraphQLLocalStrategy(async (username, password, done) => {
            try {
                const user = await User.findOne({username});
                if(!user) {
                    throw new Error("Invalid username or password")
                }
                const validPassword = await bcrypt.compare(password, user.password);
                if(!validPassword) {
                    throw new Error("Invalid username or password")
                }

                return done(null, user);

            } catch(err) {
                return done(err);
            }
        })
    )
}

export default configurePassport;
