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
    getSummary
};