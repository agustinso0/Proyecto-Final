import apiClient from "../api/apiClient";
import { handleApiError, retryRequest } from "../utils/errorHandler";

export const getAll = async () => {
  try {
    const response = await retryRequest(() => apiClient.get("/users"));
    return response.data.data?.users || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getById = async (id) => {
  if (!id) {
    throw new Error("ID de usuario requerido");
  }

  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data.data?.user || null;
  } catch (error) {
    const apiError = handleApiError(error);
    if (apiError.status === 404) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    throw apiError;
  }
};

export const getByEmail = async (email) => {
  if (!email) {
    throw new Error("Email requerido");
  }

  try {
    const response = await apiClient.get(
      `/users/email/${encodeURIComponent(email)}`
    );
    return response.data.data?.user || null;
  } catch (error) {
    const apiError = handleApiError(error);
    if (apiError.status === 404) {
      return null;
    }
    throw apiError;
  }
};

export const create = async (userData) => {
  if (!userData) {
    throw new Error("Datos de usuario requeridos");
  }

  try {
    const response = await apiClient.post("/users", userData);
    return response.data.data?.user || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 409) {
      throw new Error("Ya existe un usuario con ese email");
    }

    if (apiError.status === 400 || apiError.status === 422) {
      throw apiError;
    }

    throw apiError;
  }
};

export const update = async (id, userData) => {
  if (!id) {
    throw new Error("ID de usuario requerido");
  }

  if (!userData) {
    throw new Error("Datos de usuario requeridos");
  }

  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data.data?.user || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 404) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    if (apiError.status === 409) {
      throw new Error("Ya existe un usuario con ese email");
    }

    if (apiError.status === 400 || apiError.status === 422) {
      throw apiError;
    }

    throw apiError;
  }
};

export const _delete = async (id) => {
  if (!id) {
    throw new Error("ID de usuario requerido");
  }

  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data.data || { success: true };
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 404) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    if (apiError.status === 409) {
      throw new Error(
        "No se puede eliminar el usuario porque tiene transacciones asociadas"
      );
    }

    throw apiError;
  }
};

export const updateBalance = async (id, amount, operation) => {
  if (!id) {
    throw new Error("ID de usuario requerido");
  }

  if (!amount || amount <= 0) {
    throw new Error("Monto debe ser mayor a 0");
  }

  if (!operation || !["add", "subtract"].includes(operation)) {
    throw new Error("Operación debe ser 'add' o 'subtract'");
  }

  try {
    const response = await apiClient.patch(`/users/${id}/balance`, {
      amount: parseFloat(amount),
      operation,
    });
    return response.data.data?.user || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 404) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    if (apiError.status === 400) {
      if (apiError.data?.message?.includes("insufficient")) {
        throw new Error("Saldo insuficiente para realizar la operación");
      }
      if (apiError.data?.message?.includes("amount")) {
        throw new Error("El monto especificado no es válido");
      }
    }

    throw apiError;
  }
};
