const express = require("express");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");

const users = require("../controllers/users");

const router = express.Router();

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(wrapAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", users.logoutUser);

module.exports = router;
