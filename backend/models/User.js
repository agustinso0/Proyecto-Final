const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    firstname: {
      type: String,
      required: true,
      MinLength: 1,
    },
    lastname: {
      type: String,
      required: true,
      MinLength: 1,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
