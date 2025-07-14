const userService = require("../services/user.service");
const ApiResponse = require("../utils/ApiResponse");

const getAll = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers();

    res
      .status(200)
      .json(new ApiResponse(200, result, "Usuarios obtenidos exitosamente"));
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(new ApiResponse(200, user, "Usuario encontrado"));
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, newUser, "Usuario creado exitosamente"));
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Usuario actualizado exitosamente")
      );
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Usuario eliminado exitosamente"));
  } catch (error) {
    next(error);
  }
};

const getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Usuario no encontrado"));
    }

    res.status(200).json(new ApiResponse(200, user, "Usuario encontrado"));
  } catch (error) {
    next(error);
  }
};

const updateBalance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, operation = "sumar" } = req.body;

    const updatedUser = await userService.updateUserBalance(
      id,
      amount,
      operation
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Balance actualizado exitosamente")
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  getUserByEmail,
  updateBalance,
};
