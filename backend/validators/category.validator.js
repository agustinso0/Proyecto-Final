const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const categoryValidationRules = () => [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)
    .withMessage("El nombre solo puede contener letras, números y espacios"),
];

const categoryUpdateValidationRules = () => [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría no puede estar vacío")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9]+$/)
    .withMessage("El nombre solo puede contener letras, números y espacios"),
];

const categoryIdValidation = () => [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("ID de categoría no válido");
    }
    return true;
  }),
];

module.exports = {
  categoryValidationRules,
  categoryUpdateValidationRules,
  categoryIdValidation,
};
