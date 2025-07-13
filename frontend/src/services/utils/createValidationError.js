import { ApiError } from "../../utils/ApiError";

export const createValidationError = (errors) => {
  return new ApiError(errors.join(", "), 422, "Validation Error", { errors });
};
