const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

class TransactionService {
  async getAllTransactions(userId) {
    try {
      const transactions = await Transaction.find({
        userId,
        isActive: true,
      })
        .populate("category", "name description")
        .sort({ createdAt: -1 });

      const total = await Transaction.countDocuments({
        userId,
        isActive: true,
      });

      return {
        transactions,
        total: total,
      };
    } catch (error) {
      logger.error("Error al obtener todas las transacciones", error);
      throw new ApiError(500, "Error al obtener transacciones");
    }
  }

  async getTransactionById(id, userId) {
    try {
      const transaction = await Transaction.findOne({
        _id: id,
        userId,
        isActive: true,
      }).populate("category", "name description");

      if (!transaction) {
        throw new ApiError(404, "Transacción no encontrada");
      }

      return transaction;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al obtener una transacción por su id:", error);
      throw new ApiError(500, "Error al buscar transacción");
    }
  }

  async createTransaction(transactionData) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (transactionData.category) {
        const categoryExists = await Category.findOne({
          _id: transactionData.category,
          isActive: true,
        });
        if (!categoryExists) {
          throw new ApiError(400, "La categoría especificada no existe");
        }
      }

      const user = await User.findOne({
        _id: transactionData.userId,
        isActive: true,
      });
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      const transaction = new Transaction(transactionData);
      await transaction.save({ session });

      let newBalance;
      if (transactionData.type === "income") {
        newBalance = user.balance + transactionData.amount;
      } else if (transactionData.type === "expense") {
        newBalance = user.balance - transactionData.amount;
        if (newBalance < 0) {
          throw new ApiError(
            400,
            "Balance insuficiente para realizar esta transacción"
          );
        }
      } else {
        throw new ApiError(400, "Tipo de transacción no válido");
      }

      user.balance = newBalance;
      await user.save({ session });

      await session.commitTransaction();

      await transaction.populate("category", "name description");

      logger.info(
        `Transacción creada: ${transaction._id}, Usuario: ${user.email}, Nuevo balance: ${newBalance}`
      );

      return transaction;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof ApiError) throw error;
      logger.error("Error al crear una transacción:", error);
      throw new ApiError(500, "Error al crear transacción");
    } finally {
      session.endSession();
    }
  }

  async updateTransaction(id, updateData, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const originalTransaction = await Transaction.findOne({
        _id: id,
        userId,
        isActive: true,
      });

      if (!originalTransaction) {
        throw new ApiError(404, "Transacción no encontrada");
      }

      if (updateData.category) {
        const categoryExists = await Category.findOne({
          _id: updateData.category,
          isActive: true,
        });
        if (!categoryExists) {
          throw new ApiError(400, "La categoría especificada no existe");
        }
      }

      const user = await User.findOne({ _id: userId, isActive: true });
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      let currentBalance = user.balance;
      if (originalTransaction.type === "income") {
        currentBalance -= originalTransaction.amount;
      } else {
        currentBalance += originalTransaction.amount;
      }

      let newBalance = currentBalance;
      const newType = updateData.type || originalTransaction.type;
      const newAmount = updateData.amount || originalTransaction.amount;

      if (newType === "income") {
        newBalance += newAmount;
      } else if (newType === "expense") {
        newBalance -= newAmount;
        if (newBalance < 0) {
          throw new ApiError(
            400,
            "Balance insuficiente para realizar esta transacción"
          );
        }
      }

      const updatedTransaction = await Transaction.findOneAndUpdate(
        { _id: id, userId, isActive: true },
        updateData,
        { new: true, runValidators: true, session }
      );

      user.balance = newBalance;
      await user.save({ session });

      await session.commitTransaction();

      await updatedTransaction.populate("category", "name description");

      logger.info(
        `Transacción actualizada: ${updatedTransaction._id}, Usuario: ${user.email}, Nuevo balance: ${newBalance}`
      );

      return updatedTransaction;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof ApiError) throw error;
      logger.error("Error al actualizar una transacción:", error);
      throw new ApiError(500, "Error al actualizar transacción");
    } finally {
      session.endSession();
    }
  }

  async deleteTransaction(id, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findOne({
        _id: id,
        userId,
        isActive: true,
      });

      if (!transaction) {
        throw new ApiError(404, "Transacción no encontrada");
      }

      const user = await User.findOne({ _id: userId, isActive: true });
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado");
      }

      let newBalance = user.balance;
      if (transaction.type === "income") {
        newBalance -= transaction.amount;
      } else {
        newBalance += transaction.amount;
      }

      await Transaction.findOneAndUpdate(
        { _id: id, userId, isActive: true },
        { isActive: false },
        { session }
      );

      user.balance = newBalance;
      await user.save({ session });

      await session.commitTransaction();

      logger.info(
        `Transacción eliminada (soft): ${transaction._id}, Usuario: ${user.email}, Nuevo balance: ${newBalance}`
      );

      return { message: "Transacción eliminada correctamente" };
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof ApiError) throw error;
      logger.error("Error al eliminar una transacción:", error);
      throw new ApiError(500, "Error al eliminar transacción");
    } finally {
      session.endSession();
    }
  }

  async getSummary(userId) {
    try {
      const transactions = await Transaction.find({
        userId,
        isActive: true,
      }).populate("category", "name");

      let totalIngresos = 0;
      let totalEgresos = 0;
      const porCategoria = {};

      transactions.forEach((tx) => {
        const categoryName = tx.category?.name || "Sin categoría";

        if (!porCategoria[categoryName]) {
          porCategoria[categoryName] = { ingresos: 0, egresos: 0 };
        }

        if (tx.type === "income") {
          totalIngresos += tx.amount;
          porCategoria[categoryName].ingresos += tx.amount;
        } else {
          totalEgresos += tx.amount;
          porCategoria[categoryName].egresos += tx.amount;
        }
      });

      const balanceActual = totalIngresos - totalEgresos;

      return {
        totalIngresos,
        totalEgresos,
        balanceActual,
        totalTransacciones: transactions.length,
        porCategoria: Object.entries(porCategoria).map(
          ([categoria, valores]) => ({
            categoria,
            ...valores,
            total: valores.ingresos - valores.egresos,
          })
        ),
      };
    } catch (error) {
      logger.error("Error al obtener el resumen:", error);
      throw new ApiError(500, "Error al obtener el resumen");
    }
  }

  async getTransactionsByCategory(categoryId, userId) {
    try {
      const transactions = await Transaction.find({
        userId,
        category: categoryId,
        isActive: true,
      })
        .populate("category", "name description")
        .sort({ createdAt: -1 });

      return transactions;
    } catch (error) {
      logger.error("Error al obtener transacciones por categoría:", error);
      throw new ApiError(500, "Error al obtener transacciones por categoría");
    }
  }
}

module.exports = new TransactionService();
