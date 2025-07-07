const TransactionService = require("../services/transaction.service");
const ApiResponse = require("../middleware/ApiResponse");

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getAllTransaction();
        res.status(200).json(new ApiResponse(200, transactions, "Transacciones encontradas correctamente"));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, "Transacciones no encontradas"))
    }
};

const createTransaction = async (req, res) => {
    try {
        const transactionData = {
            amount: req.body.amount,
            type: req.body.type,
            category: req.body.category,
            description: req.body.description
        };
        const transaction = await TransactionService.createTransaction(transactionData);
        res.status(201).json(new ApiResponse(201, transaction, "Transacción creada correctamente"));
    } catch (error) {
        console.error('Error al crear transacción:', error);
        res.status(500).json(new ApiResponse(500, null, "Error al crear la transacción"));
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await TransactionService.deleteTransaction(id);
        res.status(200).json(new ApiResponse(200, transaction, "Transacción eliminada correctamente"));
    } catch (error) {
        console.error('Error al eliminar transacción:', error);
        if (error.message === "Transacción no encontrada") {
            res.status(404).json(new ApiResponse(404, null, "Transacción no encontrada"));
        } else {
            res.status(500).json(new ApiResponse(500, null, "Error al eliminar la transacción"));
        }
    }
};

const getSummary = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const summary = await TransactionService.getSummary(userId);
        res.status(200).json({
            statusCode: 200,
            data: summary,
            message: "Resumen generado correctamente",
            success: true
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllTransactions,
    createTransaction,
    deleteTransaction,
    getSummary
};