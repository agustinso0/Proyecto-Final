const { body } = require("express-validator");

const authValidationRules = () => [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 3, max: 30 })
    .withMessage("El nombre de usuario debe tener entre 3 y 30 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    ),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número"
    ),
];

const loginValidationRules = () => [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

module.exports = {
  authValidationRules,
  loginValidationRules,
};
