const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const Auth = require("../models/Auth");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return new ApiError(401, "Token de acceso requerido");
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const auth = await Auth.findById(decoded.id);

    if (!auth) {
      return new ApiError(401, "Token invalido");
    }

    req.user = auth;
    next();
  } catch (error) {
    return new ApiError(401, "Token invalido");
  }
};

module.exports = { authenticate };
