const express = require("express");
const router = express.Router();
const { login, register, updateUser } = require("../controllers/auth");
const isAuthenticated = require("../middleware/authentication");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/updateUser").patch(isAuthenticated, updateUser);

module.exports = router;
