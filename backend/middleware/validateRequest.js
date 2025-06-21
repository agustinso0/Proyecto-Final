const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(422, "Errores de validacion");
  }

  next();
};

module.exports = validateRequest;
