const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const transactionsData = require("../data/transactions");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../config/database");

async function seedTransactions() {
  try {
    await connectToDatabase();

    const transactions = transactionsData.map((v) => ({
      ...v,
      _id: new mongoose.Types.ObjectId(v._id),
    }));

    await Transaction.deleteMany({});

    await Transaction.insertMany(transactions);

    console.log("✅ Transacciones insertadas correctamente");
  } catch (error) {
    console.error("❌ Error al insertar transacciones:", error);
  } finally {
    await disconnectFromDatabase();
  }
}

seedTransactions();
