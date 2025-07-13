import apiClient from "../api/apiClient";
import { handleApiError, retryRequest } from "../utils/errorHandler";

export const getAll = async () => {
  try {
    const response = await retryRequest(() => apiClient.get("/transactions"));
    return response.data.data?.transactions || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getById = async (id) => {
  if (!id) {
    throw new Error("ID de transacción requerido");
  }

  try {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data.data || null;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const create = async (transactionData) => {
  if (!transactionData) {
    throw new Error("Datos de transacción requeridos");
  }

  try {
    const response = await apiClient.post("/transactions", transactionData);
    return response.data.data || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 400) {
      if (apiError.message?.includes("Balance insuficiente")) {
        throw new Error("Balance insuficiente para realizar esta transacción");
      }
      if (apiError.message?.includes("categoría")) {
        throw new Error("La categoría especificada no es válida");
      }
    }

    if (apiError.status === 422) {
      throw apiError;
    }

    throw apiError;
  }
};

export const update = async (id, transactionData) => {
  if (!id) {
    throw new Error("ID de transacción requerido");
  }

  if (!transactionData) {
    throw new Error("Datos de transacción requeridos");
  }

  try {
    const response = await apiClient.put(
      `/transactions/${id}`,
      transactionData
    );
    return response.data.data || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 400) {
      if (apiError.message?.includes("Balance insuficiente")) {
        throw new Error("Balance insuficiente para realizar esta transacción");
      }
    }

    if (apiError.status === 404) {
      throw new Error("Transacción no encontrada");
    }

    throw apiError;
  }
};

export const _delete = async (id) => {
  if (!id) {
    throw new Error("ID de transacción requerido");
  }

  try {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 404) {
      throw new Error("Transacción no encontrada");
    }

    throw apiError;
  }
};

export const getSummary = async () => {
  try {
    const response = await retryRequest(() =>
      apiClient.get("/transactions/summary")
    );
    return response.data.data || {};
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getByCategory = async (categoryId) => {
  if (!categoryId) {
    throw new Error("ID de categoría requerido");
  }

  try {
    const response = await apiClient.get(
      `/transactions/category/${categoryId}`
    );
    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};
