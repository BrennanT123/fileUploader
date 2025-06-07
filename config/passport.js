import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import passwordFunctions from "../lib/passwordUtils.js";
import { PrismaClient } from "../generated/prisma/index.js"; 

const prisma = new PrismaClient();


const customFields = {
  usernameField: "user_email",
  passwordField: "password",
};


//verify function used by passport-local strategy
const verifyCallback = async (email_input, password, done) => {
  console.log("Logging in with:", email_input);

  try {
    const user = await prisma.user.findUnique({
      where: { email: email_input },
    });

    if (!user) {
      console.log("User not found");
      return done(null, false);
    }

    const isValid = passwordFunctions.validatePassword(password, user.hash, user.salt);

    if (isValid) {
      return done(null, user);
    } else {
      console.log("Invalid password");
      return done(null, false);
    }
  } catch (err) {
    console.error("Authentication error:", err);
    return done(err);
  }
};


//register the strategy with Passport
passport.use(new LocalStrategy(customFields, verifyCallback));

//serialize user ID into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//deserialize user ID from session and fetch full user object
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return done(new Error("User not found"));
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
});
