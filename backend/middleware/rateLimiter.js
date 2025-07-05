const rateLimit = require("express-rate-limit");
const config = require("../config/config");

const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: "Demasiadas solicitudes, intenta de nuevo mas tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;
