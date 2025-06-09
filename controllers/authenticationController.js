import { body, query, validationResult } from "express-validator";
import passport from "passport";
import pswdUtils from "../lib/passwordUtils.js";
import { validateNewUser } from "../lib/validateUser.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const getRegister = (req, res) => {
  res.render("register");
};

export const postRegister = [
  validateNewUser,
  async (req, res) => {
    const validateErrors = validationResult(req);
    if (!validateErrors.isEmpty()) {
      return res.status(400).render("register", {
        errors: validateErrors.array(),
        data: req.body //to repopulate the form. Not used but can include in future
      });
    }
    const { hash, salt } = pswdUtils.genPasswordHashAndSalt(req.body.password);

    try {
      const newUser = await prisma.user.create({
        data: {
          email: req.body.user_email,
          hash: hash,
          salt: salt,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
        },
      });
      res.redirect("/login");
    } catch (err) {
      // Handle database error
      console.error(err);
      return res.status(500).render("register", {
        errors: [{ msg: "Something went wrong during registration." }],
      });
    }
  },
];

export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err); //handle unexpected error
    }

    if (!user) {
      return res.status(401).render("login", {
        errors: [{ msg: "Invalid email or password." }],
      });
    }

    //Login user
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/home");
    });
  })(req, res, next);
};

export const getLogout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};

export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).render("login", {
      errors: [{ msg: "Please login." }],
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.membership_status) {
    return next();
  } else {
    return res.status(401).render("message-board", {
      errors: [
        { msg: "You are not a member therefore you cannot post new messages." },
      ],
    });
  }
};
