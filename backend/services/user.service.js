const User = require("../models/User");
const Auth = require("../models/Auth");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

class UserService {
  async getAllUsers() {
    try {
      const users = await User.find({ isActive: true })
        .populate("auth", "username isActive lastLogin") // Solo selecciona los campos del segundo parametro
        .sort({ createdAt: -1 });

      const total = await User.countDocuments({
        isActive: true,
      });

      return {
        users,
        total: total,
      };
    } catch (error) {
      logger.error("Error al obtener todos los usuarios", error);
      throw new ApiError(500, "Error al obtener usuarios");
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findOne({ _id: id, isActive: true }).populate(
        "auth",
        "username isActive lastLogin"
      );

      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al obtener a un usuario por su id:", error);
      throw new ApiError(500, "Error al buscar usuario");
    }
  }

  async createUser(userData) {
    try {
      const authExists = await Auth.findById(userData.auth);
      if (!authExists) {
        throw new ApiError(400, "Referencia de autenticacion no valida");
      }

      const existingUser = await User.findOne({ auth: userData.auth });
      if (existingUser) {
        throw new ApiError(
          400,
          "Esta cuenta de autenticacion ya esta asociada con un usuario"
        );
      }

      const emailExists = await User.findOne({ email: userData.email });
      if (emailExists) {
        throw new ApiError(400, "El email ya esta registrado");
      }

      const user = new User(userData);
      await user.save();

      await user.populate("auth", "username isActive lastLogin");

      logger.info(`Usuario creado: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al crear un usuario:", error);
      throw new ApiError(500, "Error al crear usuario");
    }
  }

  async updateUser(id, updateData) {
    try {
      delete updateData.auth;

      if (updateData.email) {
        const emailExists = await User.findOne({
          email: updateData.email,
          _id: { $ne: id },
        });
        if (emailExists) {
          throw new ApiError(400, "El email ya esta registrado");
        }
      }

      const user = await User.findOneAndUpdate(
        { _id: id, isActive: true },
        updateData,
        { new: true, runValidators: true }
      ).populate("auth", "username isActive lastLogin");

      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      logger.info(`Usuario actualizado: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al actualizar un usuario:", error);
      throw new ApiError(500, "Error al actualizar usuario");
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: id, isActive: true },
        { isActive: false },
        { new: true }
      );

      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      await Auth.findByIdAndUpdate(user.auth, { isActive: false });

      logger.info(`Usuario desactivado (soft): ${user.email}`);
      return { message: "Usuario eliminado correctamente" };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al eliminar un usuario:", error);
      throw new ApiError(500, "Error al eliminar usuario");
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email, isActive: true }).populate(
        "auth",
        "username isActive lastLogin"
      );
      return user;
    } catch (error) {
      logger.error("Error al obtener un usuario por email:", error);
      throw new ApiError(500, "Error al buscar usuario por email");
    }
  }

  async updateUserBalance(id, amount, operation = "sumar") {
    try {
      const user = await User.findOne({ _id: id, isActive: true });
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      let newBalance;
      if (operation === "sumar") {
        newBalance = user.balance + amount;
      } else if (operation === "restar") {
        newBalance = user.balance - amount;
        if (newBalance < 0) {
          throw new ApiError(400, "Balance insuficiente");
        }
      } else {
        throw new ApiError(400, "Operacion no valida");
      }

      user.balance = newBalance;
      await user.save();

      logger.info(
        `Se actualizo el dinero de: ${user.email}, nueva cantidad: ${newBalance}`
      );
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al actualizar el balance de un usuario:", error);
      throw new ApiError(500, "Error al actualizar balance del usuario");
    }
  }
}

module.exports = new UserService();
