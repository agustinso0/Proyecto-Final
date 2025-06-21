const mongoose = require("mongoose");
const TransactionType = require("../models/TransactionTypes");
const transactionTypesData = require("../data/transaction_type");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../config/database");

async function seedTransactionTypes() {
  try {
    await connectToDatabase();

    const transaction_types = transactionTypesData.map((v) => ({
      ...v,
      _id: new mongoose.Types.ObjectId(v._id),
    }));

    await TransactionType.deleteMany({});

    await TransactionType.insertMany(transaction_types);

    console.log("✅ Tipos de transaccion insertados correctamente");
  } catch (error) {
    console.error("❌ Error al insertar tipos de transacciones:", error);
  } finally {
    await disconnectFromDatabase();
  }
}

seedTransactionTypes();
