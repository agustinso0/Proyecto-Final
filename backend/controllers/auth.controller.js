const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Auth = require("../models/Auth");
const config = require("../config/config");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

const generateToken = (userId) => {
  const sessionToken = jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  return { sessionToken };
};

const register = async (req, res) => {
  const { firstname, lastname, email, password, balance = 0 } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "El email ya esta registrado");
  }

  const user = new User({
    firstname,
    lastname,
    email,
    password,
    balance,
  });

  await user.save();

  const { sessionToken } = generateToken(user._id);

  const auth = new Auth({
    user: user._id,
    sessionToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
  });

  await auth.save();

  logger.info(`Nuevo usuario registrado: ${email}`);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          fullName: user.fullName,
          email: user.email,
          balance: user.balance,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
        sessionToken,
        sessionId: auth._id,
      },
      "Usuario registrado exitosamente"
    )
  );
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true }).select(
    "+password"
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Credenciales invalidas");
  }

  await Auth.updateMany(
    { user: user._id, isActive: true },
    { isActive: false }
  );

  const { sessionToken } = generateToken(user._id);

  const auth = new Auth({
    user: user._id,
    sessionToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await auth.save();

  logger.info(`Inicio de sesion: ${email}`);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          fullName: user.fullName,
          email: user.email,
          balance: user.balance,
          isActive: user.isActive,
        },
        sessionToken,
        sessionId: auth._id,
      },
      "Inicio de sesion exitoso"
    )
  );
};

const logout = async (req, res) => {
  const authSession = await Auth.findById(req.auth.sessionId);

  if (authSession) {
    await authSession.invalidateSession();
    logger.info(`Cierre de sesion - Usuario: ${req.user.email}`);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Sesion cerrada exitosamente"));
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, "Contraseña actual incorrecta");
  }

  user.password = newPassword;
  await user.save();

  await Auth.updateMany(
    { user: user._id, isActive: true },
    { isActive: false }
  );

  logger.info(`Cambio de contraseña - Usuario: ${user.email}`);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Contraseña actualizada exitosamente"));
};

const getUserSessions = async (req, res) => {
  const sessions = await Auth.find({
    user: req.user.id,
    isActive: true,
  }).select("loginAt expiresAt");

  res
    .status(200)
    .json(new ApiResponse(200, sessions, "Sesiones obtenidas exitosamente"));
};

const invalidateSession = async (req, res) => {
  const { sessionId } = req.params;

  const session = await Auth.findOne({
    _id: sessionId,
    user: req.user.id,
    isActive: true,
  });

  if (!session) {
    throw new ApiError(404, "Sesion no encontrada");
  }

  await session.invalidateSession();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Sesion invalidada exitosamente"));
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
  getUserSessions,
  invalidateSession,
};
