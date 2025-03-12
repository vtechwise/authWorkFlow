const { StatusCodes } = require("http-status-codes");
const {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { createJWT, createTokenUser } = require("../utils");
const { attachCookieToResponse } = require("../utils/jwt");

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new BadRequestError("Email already exist");
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const response = await User.create({
    email,
    name,
    password,
    verificationToken,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Check your email to verify your account " });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    throw new UnauthenticatedError(
      "Authentication Failed email does not exist"
    );
  }
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Invalid verification token");
  }
  user.isVerified = true;
  user.veirfied = Date.now();
  user.verificationToken = "";
  await user.save();
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide both value");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }
  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your account");
  }
  const correctPassword = await user.comparePassword(password);

  if (!correctPassword) {
    throw new UnauthenticatedError("Incorrect password");
  }
  const tokenUser = createTokenUser(user);
  // console.log(tokenUser);

  attachCookieToResponse(res, tokenUser);
  res.status(StatusCodes.OK).json(tokenUser);
};

const logoutUser = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail
};
