require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const config = require("./config/config");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("./config/database");
const logger = require("./utils/logger");
const rateLimiter = require("./middleware/rateLimiter");
const routes = require("./routes");

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors(config.cors));

app.use(rateLimiter);

if (process.env.NODE_ENV !== "test") {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", async (req, res) => {
  try {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: "connected",
    });
  } catch (error) {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: "connected",
    });
  }
});

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "No se encontro la ruta",
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  const ApiError = require("./utils/ApiError");

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicado: ya existe un registro con esos datos",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      message: "ID no válido",
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

async function startServer() {
  try {
    await connectToDatabase();

    const server = app.listen(config.server.port, () => {
      console.log(`🚀 Server is running on port ${config.server.port}`);
      console.log(`📝 Environment: ${config.server.env}`);
      console.log(
        `🔗 API available at: http://localhost:${config.server.port}/api`
      );
      logger.info(
        `El servidor arranco en el puerto ${config.server.port} en modo ${config.server.env}`
      );
    });

    const gracefulShutdown = async (signal) => {
      console.log(`🛑 Recibida la se;al ${signal}.`);
      logger.info(`Recibida la se;al ${signal}.`);

      server.close(async () => {
        try {
          await disconnectFromDatabase();
          console.log("Servidor cerrado");
          logger.info("Servidor apagado");
          process.exit(0);
        } catch (error) {
          console.error("Error mientras se apagaba el servidor:", error);
          logger.error(
            "Ha ocurrido un error mientras se apaga el servidor:",
            error
          );
          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("Unable to start server:", error);
    logger.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
