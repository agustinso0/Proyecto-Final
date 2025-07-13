const TransactionService = require("../services/transaction.service");
const ApiResponse = require("../utils/ApiResponse");

const getAllTransactions = async (req, res) => {
  const result = await TransactionService.getAllTransactions(req.user._id);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Transacciones obtenidas exitosamente"));
};

const getTransaction = async (req, res) => {
  const transaction = await TransactionService.getTransactionById(
    req.params.id,
    req.user._id
  );
  res
    .status(200)
    .json(new ApiResponse(200, transaction, "Transacción encontrada"));
};

const createTransaction = async (req, res) => {
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
};

const updateTransaction = async (req, res) => {
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
};

const deleteTransaction = async (req, res) => {
  const result = await TransactionService.deleteTransaction(
    req.params.id,
    req.user._id
  );
  res
    .status(200)
    .json(new ApiResponse(200, result, "Transacción eliminada exitosamente"));
};

const getSummary = async (req, res) => {
  const summary = await TransactionService.getSummary(req.user._id);
  res
    .status(200)
    .json(new ApiResponse(200, summary, "Resumen generado exitosamente"));
};

const getTransactionsByCategory = async (req, res) => {
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
