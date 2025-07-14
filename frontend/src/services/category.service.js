import { ApiError } from "../utils/ApiError";

export const validateCategoryDataForCreation = (categoryData) => {
  const errors = [];

  if (!categoryData.name || categoryData.name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  return errors;
};

export const validateCategoryDataForEdit = (categoryData) => {
  const errors = [];

  if (!categoryData.name || categoryData.name.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  return errors;
};

export const formatCategoryForCreate = (categoryData) => {
  try {
    return {
      name: categoryData.name?.trim(),
    };
  } catch (error) {
    throw new ApiError(
      "Error al formatear datos de categoría para creación",
      400,
      "Bad Request"
    );
  }
};

export const formatCategoryForUpdate = (categoryData) => {
  try {
    return {
      name: categoryData.name?.trim(),
    };
  } catch (error) {
    throw new ApiError(
      "Error al formatear datos de categoría para actualización",
      400,
      "Bad Request"
    );
  }
};
