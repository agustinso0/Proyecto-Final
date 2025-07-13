import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getAll,
  create,
  update,
  _delete,
} from "../repositories/categoryRepository";

import {
  validateCategoryDataForCreation,
  validateCategoryDataForEdit,
  formatCategoryForCreate,
  formatCategoryForUpdate,
} from "../services/category.service";
import { createValidationError } from "../services/utils/createValidationError";
import { handleApiError } from "../utils/errorHandler";

export const useCategories = () => {
  return useQuery("categories", getAll, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation(
    async (categoryData) => {
      const validationErrors = validateCategoryDataForCreation(categoryData);
      if (validationErrors.length > 0) {
        throw createValidationError(validationErrors);
      }

      const formattedData = formatCategoryForCreate(categoryData);
      return await create(formattedData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
      onError: (error) => {
        handleApiError(error, "crear categoria");
        throw error;
      },
    }
  );

  const updateCategoryMutation = useMutation(
    async ({ id, categoryData }) => {
      if (!id) {
        throw createValidationError(["ID de categoria requerido"]);
      }

      const validationErrors = validateCategoryDataForEdit(categoryData);
      if (validationErrors.length > 0) {
        throw createValidationError(validationErrors);
      }

      const formattedData = formatCategoryForUpdate(categoryData);
      return await update(id, formattedData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
      onError: (error) => {
        handleApiError(error, "actualizar categoria");
        throw error;
      },
    }
  );

  const deleteCategoryMutation = useMutation(
    async (id) => {
      if (!id) {
        throw createValidationError(["ID de categoria requerido"]);
      }
      return await _delete(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
      },
      onError: (error) => {
        handleApiError(error, "eliminar categoria");
        throw error;
      },
    }
  );

  return {
    createCategory: createCategoryMutation,
    updateCategory: updateCategoryMutation,
    deleteCategory: deleteCategoryMutation,
  };
};
