const { UnauthenticatedError } = require("../errors");
const UnauthorizedError = require("../errors/UnauthorizeError");
const { validateToken } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new UnauthenticatedError("Authentication Failed ");
  }
  try {
    const { name, role, userId, email } = await validateToken(token);

    req.user = { name, userId, role, email };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication Failed");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("You are not unthorize to access this route");
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
