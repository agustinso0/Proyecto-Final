const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La referencia al usuario es obligatoria"],
    },
    sessionToken: {
      type: String,
      required: [true, "El token de sesión es obligatorio"],
      unique: true,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    loginAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: [true, "La fecha de expiración es obligatoria"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.sessionToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

AuthSchema.index({ user: 1 });
AuthSchema.index({ sessionToken: 1 });
AuthSchema.index({ expiresAt: 1 });
AuthSchema.index({ user: 1, isActive: 1 });

AuthSchema.virtual("userInfo", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

AuthSchema.set("toJSON", { virtuals: true });

AuthSchema.methods.isSessionActive = function () {
  return this.isActive && this.expiresAt > new Date();
};

AuthSchema.methods.invalidateSession = function () {
  this.isActive = false;
  return this.save();
};

AuthSchema.methods.extendSession = function (hours = 24) {
  this.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  return this.save();
};

AuthSchema.pre("find", function () {
  this.where({ expiresAt: { $gt: new Date() } });
});

AuthSchema.pre("findOne", function () {
  this.where({ expiresAt: { $gt: new Date() } });
});

module.exports = mongoose.model("Auth", AuthSchema);
