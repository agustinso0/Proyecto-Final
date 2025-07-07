const Transaction = require("../models/Transaction");
const ApiError = require("../utils/ApiError");

class TransactionService {
    static async getAllTransaction() {
        try {
            const transactions = await Transaction.find().sort({ createdAt: -1 });
            return transactions;
        } catch (error) {
            console.error('Error en getAllTransaction:', error);
            throw new ApiError(500, "Error al obtener las transacciones");
        }
    }

    static async createTransaction(transactionData) {
        try {
            console.log('Datos recibidos:', transactionData);
            const transaction = new Transaction({
                amount: Number(transactionData.amount),
                type: transactionData.type,
                category: transactionData.category,
                description: transactionData.description
            });
            const savedTransaction = await transaction.save();
            console.log('Transacción guardada:', savedTransaction);
            return savedTransaction;
        } catch (error) {
            console.error('Error en createTransaction:', error);
            throw new ApiError(500, `Error al crear la transacción: ${error.message}`);
        }
    }

    static async deleteTransaction(transactionId) {
        try {
            const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
            if (!deletedTransaction) {
                throw new ApiError(404, "Transacción no encontrada");
            }
            return deletedTransaction;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            console.error('Error en deleteTransaction:', error);
            throw new ApiError(500, "Error al eliminar la transacción");
        }
    }

    static async getSummary() {
        try {
            const transactions = await Transaction.find();
            
            let totalIngresos = 0;
            let totalEgresos = 0;
            const porCategoria = {};

            transactions.forEach(tx => {
                if (!porCategoria[tx.category]) {
                    porCategoria[tx.category] = { ingresos: 0, egresos: 0 };
                }

                if (tx.type === 'income') {
                    totalIngresos += tx.amount;
                    porCategoria[tx.category].ingresos += tx.amount;
                } else {
                    totalEgresos += tx.amount;
                    porCategoria[tx.category].egresos += tx.amount;
                }
            });

            return {
                totalIngresos,
                totalEgresos,
                porCategoria: Object.entries(porCategoria).map(([categoria, valores]) => ({
                    categoria,
                    ...valores
                }))
            };
        } catch (error) {
            console.error('Error en getSummary:', error);
            throw new ApiError(500, "Error al obtener el resumen");
        }
    }
}

module.exports = TransactionService;