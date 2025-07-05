const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");
const config = require("../config/config");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const register = async (req, res) => {
  const { username, password } = req.body;

  const existingAuth = await Auth.findOne({ username });
  if (existingAuth) {
    throw new ApiError(400, "El nombre de usuario ya esta registrado");
  }

  const auth = new Auth({
    username,
    password,
  });

  await auth.save();

  const token = generateToken(auth._id);
  auth.token = token;
  await auth.save();

  logger.info(`Nuevo usuario: ${username}`);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        auth: {
          id: auth._id,
          username: auth.username,
          isActive: auth.isActive,
          createdAt: auth.createdAt,
        },
        token,
      },
      "Usuario registrado exitosamente"
    )
  );
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const auth = await Auth.findOne({ username, isActive: true }).select(
    "+password"
  );

  if (!auth || !(await auth.comparePassword(password))) {
    throw new ApiError(401, "Credenciales invalidas");
  }

  await auth.updateLastLogin();

  const token = generateToken(auth._id);
  auth.token = token;
  await auth.save();

  logger.info(`Inicio sesion el usuario: ${username}`);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        auth: {
          id: auth._id,
          username: auth.username,
          isActive: auth.isActive,
          lastLogin: auth.lastLogin,
        },
        token,
      },
      "Inicio de sesion exitoso"
    )
  );
};

const logout = async (req, res) => {
  const auth = await Auth.findById(req.user.id);
  auth.token = null;
  await auth.save();

  logger.info(`Cierre de sesion del usuario: ${auth.username}`);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Sesion cerrada exitosamente"));
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const auth = await Auth.findById(req.user.id).select("+password");

  if (!(await auth.comparePassword(currentPassword))) {
    throw new ApiError(400, "Contraseña actual incorrecta");
  }

  auth.password = newPassword;
  await auth.save();

  logger.info(`Cambio de contrase;a del usuario: ${auth.username}`);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Contraseña actualizada exitosamente"));
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
};
