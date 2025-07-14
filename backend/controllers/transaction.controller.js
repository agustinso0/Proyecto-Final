const TransactionService = require("../services/transaction.service");
const ApiResponse = require("../utils/ApiResponse");

const getAllTransactions = async (req, res, next) => {
  try {
    // Extraer filtros de los query parameters
    const filters = {};

    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.startDate) {
      filters.startDate = req.query.startDate;
    }

    if (req.query.endDate) {
      filters.endDate = req.query.endDate;
    }

    const result = await TransactionService.getAllTransactions(
      req.user._id,
      filters
    );
    res
      .status(200)
      .json(
        new ApiResponse(200, result, "Transacciones obtenidas exitosamente")
      );
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const transaction = await TransactionService.getTransactionById(
      req.params.id,
      req.user._id
    );
    res
      .status(200)
      .json(new ApiResponse(200, transaction, "Transacción encontrada"));
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const transactionData = {
      ...req.body,
      userId: req.user._id,
    };
    const newTransaction = await TransactionService.createTransaction(
      transactionData
    );
    res
      .status(201)
      .json(
        new ApiResponse(201, newTransaction, "Transacción creada exitosamente")
      );
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const updatedTransaction = await TransactionService.updateTransaction(
      req.params.id,
      req.body,
      req.user._id
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedTransaction,
          "Transacción actualizada exitosamente"
        )
      );
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const result = await TransactionService.deleteTransaction(
      req.params.id,
      req.user._id
    );
    res
      .status(200)
      .json(new ApiResponse(200, result, "Transacción eliminada exitosamente"));
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const summary = await TransactionService.getSummary(req.user._id);
    res
      .status(200)
      .json(new ApiResponse(200, summary, "Resumen generado exitosamente"));
  } catch (error) {
    next(error);
  }
};

const getTransactionsByCategory = async (req, res, next) => {
  try {
    const transactions = await TransactionService.getTransactionsByCategory(
      req.params.categoryId,
      req.user._id
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          transactions,
          "Transacciones por categoría obtenidas exitosamente"
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getTransactionsByCategory,
};
