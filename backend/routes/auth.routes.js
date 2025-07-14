const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  registerValidationRules,
  loginValidationRules,
  changePasswordValidationRules,
} = require("../validators/auth.validator");
const validateRequest = require("../middleware/validateRequest");
const { authenticate } = require("../middleware/auth");

router.post(
  "/register",
  registerValidationRules(),
  validateRequest,
  authController.register
);

router.post(
  "/login",
  loginValidationRules(),
  validateRequest,
  authController.login
);

router.use(authenticate);

router.get("/me", authController.me);

router.post("/logout", authController.logout);

router.put(
  "/change-password",
  changePasswordValidationRules(),
  validateRequest,
  authController.changePassword
);

router.get("/sessions", authController.getUserSessions);

router.delete("/sessions/:sessionId", authController.invalidateSession);

module.exports = router;
