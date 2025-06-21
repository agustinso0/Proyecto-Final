// backend/config/database.js
require("dotenv").config();
const mongoose = require("mongoose");

const getMongoURI = (env = "development") => {
  const baseName = process.env.DB_NAME || "app_database";
  const dbName = env === "test" ? `${baseName}_test` : baseName;
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 27017;

  return `mongodb://${host}:${port}/${dbName}`;
};

const connectToDatabase = async (
  env = process.env.NODE_ENV || "development"
) => {
  const uri = getMongoURI(env);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected successfully to ${uri}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Detiene la app si no se puede conectar
  }
};

module.exports = {
  connectToDatabase,
};
