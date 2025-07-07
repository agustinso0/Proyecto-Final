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

    static async getSummary(userId) {
        const transactions = await Transaction.find({ username: userId })
            .populate('category') 
            .populate('type'); 

        let totalIngresos = 0;
        let totalEgresos = 0;
        const porCategoria = {};

        transactions.forEach(tx => {
            const tipo = tx.type.name;      // "ingreso" o "egreso"
            const categoria = tx.category.name;

            if (!porCategoria[categoria]) {
                porCategoria[categoria] = { ingresos: 0, egresos: 0 };
            }

            if (tipo === "ingreso") {
                totalIngresos += tx.amount;
                porCategoria[categoria].ingresos += tx.amount;
            } else if (tipo === "egreso") {
                totalEgresos += tx.amount;
                porCategoria[categoria].egresos += tx.amount;
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
    }

}

module.exports = TransactionService;