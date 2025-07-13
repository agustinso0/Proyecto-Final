const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const Auth = require("../models/Auth");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === "null" || token === "undefined") {
    return next(new ApiError(401, "Token de acceso requerido"));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const authSession = await Auth.findOne({
      sessionToken: token,
      isActive: true,
    }).populate("user");

    if (!authSession || !authSession.isSessionActive()) {
      return next(new ApiError(401, "Sesion invalida o expirada"));
    }

    if (!authSession.user || !authSession.user.isActive) {
      return next(new ApiError(401, "Usuario inactivo"));
    }

    req.user = authSession.user;
    req.auth = {
      sessionId: authSession._id,
      loginAt: authSession.loginAt,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Token malformado"));
    }
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expirado"));
    }
    return next(new ApiError(401, "Token invalido"));
  }
};

module.exports = {
  authenticate,
};
