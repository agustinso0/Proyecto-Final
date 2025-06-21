require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("../utils/logger");

let isConnected = false;

const getMongoURI = (env = "development") => {
  const name = process.env.DB_NAME || "database";
  const dbName = env === "test" ? `${name}_test` : name;
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 27017;

  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  return `mongodb://${host}:${port}/${dbName}`;
};

const connectToDatabase = async (
  env = process.env.NODE_ENV || "development"
) => {
  if (isConnected) {
    return mongoose.connection;
  }

  const uri = getMongoURI(env);

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.info(`MongoDB conectado a ${uri.replace(/\/\/.*@/, "//***:***@")}`);
    console.log(`MongoDB conectado!`);

    return mongoose.connection;
  } catch (error) {
    logger.error("Error en la conexion de MongoDB:", error);
    console.error("Error en la conexion de MongoDB:", error);
    process.exit(1);
  }
};

const disconnectFromDatabase = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info("MongoDB desconectado");
    console.log("🔌 MongoDB desconectado");
  }
};

mongoose.connection.on("connected", () => {
  logger.info("Mongoose conectado a MongoDB");
});

mongoose.connection.on("error", (err) => {
  logger.error("Error en la conexion de Mongoose:", err);
});

mongoose.connection.on("disconnected", () => {
  logger.info("Mongoose desconectado de MongoDB");
});

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  getMongoURI,
};
