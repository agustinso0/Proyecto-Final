const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  userValidationRules,
  userUpdateValidationRules,
  userIdValidation,
} = require("../validators/user.validator");
const validateRequest = require("../middleware/validateRequest");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

// Protegidas
router.get("/email/:email", userController.getUserByEmail);
router.get("/", userController.getAll);
router.get("/:id", userIdValidation(), validateRequest, userController.getOne);
router.post("/", userValidationRules(), validateRequest, userController.create);
router.put(
  "/:id",
  userIdValidation(),
  userUpdateValidationRules(),
  validateRequest,
  userController.update
);

router.delete(
  "/:id",
  userIdValidation(),
  validateRequest,
  userController.remove
);

router.patch(
  "/:id/balance",
  userIdValidation(),
  validateRequest,
  userController.updateBalance
);

module.exports = router;
