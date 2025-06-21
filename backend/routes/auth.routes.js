const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  authValidationRules,
  loginValidationRules,
} = require("../validators/auth.validator");
const validateRequest = require("../middleware/validateRequest");
const { authenticate } = require("../middleware/auth");

// Publica
router.post(
  "/register",
  authValidationRules(),
  validateRequest,
  authController.register
);
router.post(
  "/login",
  loginValidationRules(),
  validateRequest,
  authController.login
);

// Protegida
router.use(authenticate);
router.post("/logout", authController.logout);
router.put("/change-password", authController.changePassword);

module.exports = router;
