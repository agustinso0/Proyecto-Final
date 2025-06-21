const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("./config/database");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Middleware de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Rutas
app.use("/api", routes);

// Health check en la raíz
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Inicializar servidor
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 API available at: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    process.exit(1); // No continuar sin DB
  }
}

startServer();

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("🛑 Shutting down gracefully...");
  try {
    await disconnectFromDatabase();
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  }
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
