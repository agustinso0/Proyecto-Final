const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: [true, "La referencia de autenticacion es obligatoria"],
      unique: true,
    },
    firstname: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [1, "El nombre debe tener al menos 1 caracter"],
      maxlength: [50, "El nombre no puede exceder 50 caracteres"],
    },
    lastname: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
      minlength: [1, "El apellido debe tener al menos 1 caracter"],
      maxlength: [50, "El apellido no puede exceder 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingresa un email valido",
      ],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, "La direccion no puede exceder 200 caracteres"],
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "El balance no puede ser negativo"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ auth: 1 });

UserSchema.virtual("fullName").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);
