const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(

    {
        usuario:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        monto:{
            type: Number,
            required: true,
        },
        categoria:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cateoria",
            required: true,
        },
        tipo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tipo",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);