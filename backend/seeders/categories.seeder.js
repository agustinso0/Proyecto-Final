const mongoose = require("mongoose");
const Category = require("../models/Category");
const categoriesData = require("../data/categories");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../config/database");

async function seedCategories() {
  try {
    await connectToDatabase();

    const categories = categoriesData.map((v) => ({
      ...v,
      _id: new mongoose.Types.ObjectId(v._id),
    }));

    await Category.deleteMany({});
    await Category.insertMany(categories);

    console.log("✅ Categorías insertadas correctamente");
  } catch (error) {
    console.error("❌ Error al insertar categorías:", error);
  } finally {
    await disconnectFromDatabase();
  }
}

seedCategories();
