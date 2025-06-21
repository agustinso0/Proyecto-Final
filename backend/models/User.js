const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Auth,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      MinLength: 1,
    },
    apellido: {
      type: String,
      required: true,
      MinLength: 1,
    },
    email: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
    },
    saldo: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
