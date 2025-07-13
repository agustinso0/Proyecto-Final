import apiClient from "../api/apiClient";
import { handleApiError, retryRequest } from "../utils/errorHandler";

export const getAll = async () => {
  try {
    const response = await retryRequest(() => apiClient.get("/categories"));
    return response.data.data?.categories || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const create = async (categoryData) => {
  if (!categoryData) {
    throw new Error("Datos de categoria requeridos");
  }

  try {
    const response = await apiClient.post("/categories", categoryData);
    return response.data.data?.category || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 409) {
      throw new Error("Ya existe una categoria con ese nombre");
    }

    if (apiError.status === 400 || apiError.status === 422) {
      throw apiError;
    }

    throw apiError;
  }
};

export const update = async (id, categoryData) => {
  if (!id) {
    throw new Error("ID de categoria requerido");
  }

  if (!categoryData) {
    throw new Error("Datos de categoria requeridos");
  }

  try {
    const response = await apiClient.put(`/categories/${id}`, categoryData);
    return response.data.data?.category || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 404) {
      throw new Error(`categoria con ID ${id} no encontrada`);
    }

    if (apiError.status === 409) {
      throw new Error("Ya existe una categoria con ese nombre");
    }

    if (apiError.status === 400 || apiError.status === 422) {
      throw apiError;
    }

    throw apiError;
  }
};

export const _delete = async (id) => {
  if (!id) {
    throw new Error("ID de categoria requerido");
  }

  try {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data.data || { success: true };
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 404) {
      throw new Error(`categoria con ID ${id} no encontrada`);
    }

    if (apiError.status === 409) {
      throw new Error(
        "No se puede eliminar la categoria porque tiene transacciones asociadas"
      );
    }

    throw apiError;
  }
};
