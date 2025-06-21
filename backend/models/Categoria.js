const mongoose = require("mongoose");

const CatSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        }
    }
);

module.exports = mongoose.model("Categoria", CatSchema);