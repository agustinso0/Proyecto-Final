const express = require("express");
const {
  getAllTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getTransactionsByCategory,
} = require("../controllers/transaction.controller");
const { authenticate } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const {
  transactionValidationRules,
  transactionUpdateValidationRules,
  transactionIdValidation,
  categoryIdValidation,
  transactionFiltersValidation,
} = require("../validators/transaction.validator");

const router = express.Router();

router.use(authenticate);

router.get(
  "/",
  transactionFiltersValidation(),
  validateRequest,
  getAllTransactions
);
router.get("/summary", getSummary);
router.get(
  "/category/:categoryId",
  categoryIdValidation(),
  validateRequest,
  getTransactionsByCategory
);
router.get("/:id", transactionIdValidation(), validateRequest, getTransaction);

router.post(
  "/",
  transactionValidationRules(),
  validateRequest,
  createTransaction
);
router.put(
  "/:id",
  transactionIdValidation(),
  transactionUpdateValidationRules(),
  validateRequest,
  updateTransaction
);
router.delete(
  "/:id",
  transactionIdValidation(),
  validateRequest,
  deleteTransaction
);

module.exports = router;
