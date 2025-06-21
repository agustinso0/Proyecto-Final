const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionType",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
