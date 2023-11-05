const express = require("express");
const router = express.Router();
const { login, register, updateUser } = require("../controllers/auth");
const isAuthenticated = require("../middleware/authentication");
const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: `Too many request from this ip, Please try after 15 min`,
  },
});

router.route("/register").post(apiLimiter, register);

router.route("/login").post(apiLimiter, login);

router.route("/updateUser").patch(isAuthenticated, updateUser);

module.exports = router;
