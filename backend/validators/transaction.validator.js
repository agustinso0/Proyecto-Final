const { body, param, query } = require("express-validator");
const mongoose = require("mongoose");

const transactionValidationRules = () => [
  body("amount")
    .isNumeric()
    .withMessage("El monto debe ser un número")
    .isFloat({ min: 0.01 })
    .withMessage("El monto debe ser mayor a 0"),

  body("type")
    .isIn(["income", "expense"])
    .withMessage("El tipo debe ser 'income' o 'expense'"),

  body("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("ID de categoría no válido");
      }
      return true;
    }),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),
];

const transactionUpdateValidationRules = () => [
  body("amount")
    .optional()
    .isNumeric()
    .withMessage("El monto debe ser un número")
    .isFloat({ min: 0.01 })
    .withMessage("El monto debe ser mayor a 0"),

  body("type")
    .optional()
    .isIn(["income", "expense"])
    .withMessage("El tipo debe ser 'income' o 'expense'"),

  body("category")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("ID de categoría no válido");
      }
      return true;
    }),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres"),
];

const transactionIdValidation = () => [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("ID de transacción no válido");
    }
    return true;
  }),
];

const categoryIdValidation = () => [
  param("categoryId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("ID de categoría no válido");
    }
    return true;
  }),
];

const transactionFiltersValidation = () => [
  query("category")
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("ID de categoría no válido");
      }
      return true;
    }),
  
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Fecha de inicio debe estar en formato ISO8601 (YYYY-MM-DD)"),
  
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("Fecha de fin debe estar en formato ISO8601 (YYYY-MM-DD)")
    .custom((endDate, { req }) => {
      if (endDate && req.query.startDate) {
        const start = new Date(req.query.startDate);
        const end = new Date(endDate);
        if (end < start) {
          throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
        }
      }
      return true;
    }),
];

module.exports = {
  transactionValidationRules,
  transactionUpdateValidationRules,
  transactionIdValidation,
  categoryIdValidation,
  transactionFiltersValidation,
};
