const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
  return token;
};

const validateToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookieToResponse = (res, user) => {
  const token = createJWT(user);
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
    signed:true
  });
};
module.exports = {
  createJWT,
  attachCookieToResponse,
  validateToken,
};
