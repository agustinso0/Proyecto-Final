const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      ref: "User",
      maxlength: [50, "El nombre de usuario no puede exceder 50 caracteres"],
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      ref: "TransactionType",
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
