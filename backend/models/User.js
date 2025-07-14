const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
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
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false,
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
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.index({ email: 1 });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.virtual("fullName").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

UserSchema.virtual("authSessions", {
  ref: "Auth",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

UserSchema.set("toJSON", { virtuals: true });

UserSchema.methods.comparePassword = async function (password) {
  if (!this.password) {
    const userWithPassword = await this.constructor
      .findById(this._id)
      .select("+password");
    if (!userWithPassword || !userWithPassword.password) return false;
    return bcrypt.compare(password, userWithPassword.password);
  }
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.isValidEmail = function () {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(this.email);
};

module.exports = mongoose.model("User", UserSchema);
