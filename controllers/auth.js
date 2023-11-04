// controllers basically contains functions
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
// const bcrypt = require("bcrypt");
const BadRequestError = require("../errors/bad-request-Error");
const { UnauthorisedAccessError } = require("../errors");
// const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  const token = await user.createJWT();

  console.log("register token", token);

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      location: user.location,
      name: user.name,
      lastName: user.lastName,
      token: token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorisedAccessError("User not exist");
  }

  const checkPasswordMatch = await user.matchPassword(password);

  if (!checkPasswordMatch) {
    throw new UnauthorisedAccessError("Invalid credentialsss");
  }

  const token = await user.createJWT();

  console.log("login token", token);

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  let { email, name, lastName, location } = req.body;

  if (!name || !lastName || !email || !location) {
    throw new BadRequestError("Please fill all the dets");
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();

  const token = await user.createJWT();

  console.log("update token", token);

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  });
};

module.exports = {
  register,
  login,
  updateUser,
};
