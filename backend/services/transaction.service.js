const Transaction = require("../models/Transaction");
const ApiError = require("../middleware/ApiResponse");

class TransactionService{
    static async getAllTransaction() {
        try {
            const transactions = await Transaction.find()
            return transactions
        } catch (error) {
            throw new ApiError(500, null, "Error al obtener las transacciones")
        }
    }
}

module.exports = TransactionService;