const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

// Ruta de prueba
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
