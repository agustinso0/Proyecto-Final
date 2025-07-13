const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "El monto debe ser mayor a 0"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ userId: 1, category: 1 });
TransactionSchema.index({ userId: 1, type: 1 });
TransactionSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
