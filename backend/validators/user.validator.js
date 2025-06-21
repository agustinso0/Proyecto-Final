const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const userValidationRules = () => [
  body("auth")
    .notEmpty()
    .withMessage("La referencia de autenticación es obligatoria")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("Auth debe ser un ID válido");
      }
      return true;
    }),

  body("firstname")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("lastname")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras y espacios"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La dirección no puede exceder 200 caracteres"),

  body("balance")
    .optional()
    .isNumeric()
    .withMessage("El balance debe ser un número")
    .custom((value) => {
      if (value < 0) {
        throw new Error("El balance no puede ser negativo");
      }
      return true;
    }),
];

const userUpdateValidationRules = () => [
  body("firstname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("lastname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .isLength({ min: 1, max: 50 })
    .withMessage("El apellido debe tener entre 1 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El apellido solo puede contener letras y espacios"),

  body("email")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El email no puede estar vacío")
    .isEmail()
    .withMessage("Debe ser un email válido")
    .normalizeEmail(),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La dirección no puede exceder 200 caracteres"),

  body("balance")
    .optional()
    .isNumeric()
    .withMessage("El balance debe ser un número")
    .custom((value) => {
      if (value < 0) {
        throw new Error("El balance no puede ser negativo");
      }
      return true;
    }),
];

const userIdValidation = () => [
  param("id")
    .notEmpty()
    .withMessage("El ID es obligatorio")
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error("ID de usuario inválido");
      }
      return true;
    }),
];

module.exports = {
  userValidationRules,
  userUpdateValidationRules,
  userIdValidation,
};
