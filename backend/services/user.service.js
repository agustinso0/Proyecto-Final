const User = require("../models/User");
const Auth = require("../models/Auth");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

class UserService {
  async getAllUsers() {
    try {
      const users = await User.find({ isActive: true }).sort({ createdAt: -1 });

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
      const user = await User.findOne({ _id: id, isActive: true });

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
      const emailExists = await User.findOne({ email: userData.email });
      if (emailExists) {
        throw new ApiError(400, "El email ya esta registrado");
      }

      const user = new User(userData);
      await user.save();

      logger.info(`Usuario creado: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.code === 11000) {
        throw new ApiError(400, "El email ya esta registrado");
      }
      logger.error("Error al crear un usuario:", error);
      throw new ApiError(500, "Error al crear usuario");
    }
  }

  async updateUser(id, updateData) {
    try {
      delete updateData.password;

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
      );

      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      logger.info(`Usuario actualizado: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.code === 11000) {
        throw new ApiError(400, "El email ya esta registrado");
      }
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

      await Auth.updateMany({ user: id, isActive: true }, { isActive: false });

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
      const user = await User.findOne({ email, isActive: true });
      return user;
    } catch (error) {
      logger.error("Error al obtener un usuario por email:", error);
      throw new ApiError(500, "Error al buscar usuario por email");
    }
  }

  async updateUserBalance(id, amount, operation = "add") {
    try {
      const user = await User.findOne({ _id: id, isActive: true });
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      let newBalance;
      if (operation === "add") {
        newBalance = user.balance + amount;
      } else if (operation === "subtract") {
        newBalance = user.balance - amount;
        if (newBalance < 0) {
          throw new ApiError(400, "Balance insuficiente");
        }
      } else {
        throw new ApiError(400, "Operacion no valida. Use 'add' o 'subtract'");
      }

      user.balance = newBalance;
      await user.save();

      logger.info(
        `Balance actualizado para: ${user.email}, nuevo balance: ${newBalance}`
      );
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al actualizar el balance de un usuario:", error);
      throw new ApiError(500, "Error al actualizar balance del usuario");
    }
  }

  async updateUserPassword(id, newPassword) {
    try {
      const user = await User.findOne({ _id: id, isActive: true });
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      user.password = newPassword;
      await user.save();

      await Auth.updateMany({ user: id, isActive: true }, { isActive: false });

      logger.info(`Contraseña actualizada para: ${user.email}`);
      return { message: "Contraseña actualizada correctamente" };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al actualizar contraseña:", error);
      throw new ApiError(500, "Error al actualizar contraseña");
    }
  }

  async getUserSessions(id) {
    try {
      const user = await User.findOne({ _id: id, isActive: true });
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      const sessions = await Auth.find({
        user: id,
        isActive: true,
      }).select("loginAt expiresAt");

      return sessions;
    } catch (error) {
      logger.error("Error al obtener sesiones del usuario:", error);
      throw new ApiError(500, "Error al obtener sesiones");
    }
  }
}

module.exports = new UserService();
