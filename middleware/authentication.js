const jwt = require("jsonwebtoken");
const UnauthenticatedError = require("../errors/unauthorized-access");
require("dotenv").config();

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("You are not authenticated");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRETKEY);

    req.user = { userId: payload.userId, username: payload.name };

    next();
  } catch (error) {
    console.log("error", error.message);
  }
};

module.exports = isAuthenticated;
