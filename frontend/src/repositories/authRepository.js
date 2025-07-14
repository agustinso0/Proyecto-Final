import apiClient from "../api/apiClient";
import { handleApiError, retryRequest } from "../utils/errorHandler";

export const register = async (userData) => {
  if (!userData) {
    throw new Error("Datos de registro requeridos");
  }

  const { firstname, lastname, email, password, address } = userData;

  if (!firstname || !lastname || !email || !password) {
    throw new Error("Todos los campos requeridos deben ser completados");
  }

  try {
    const response = await retryRequest(() =>
      apiClient.post("/auth/register", {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        password,
        address: address?.trim() || "",
      })
    );

    return {
      user: response.data.data?.user || null,
      sessionToken: response.data.data?.sessionToken || null,
    };
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 409) {
      throw new Error("Ya existe un usuario con ese email");
    }

    if (apiError.status === 400 || apiError.status === 422) {
      if (apiError.data?.message?.includes("email")) {
        throw new Error("El formato del email no es válido");
      }
      if (apiError.data?.message?.includes("password")) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
      throw apiError;
    }

    throw apiError;
  }
};

export const login = async (credentials) => {
  if (!credentials) {
    throw new Error("Credenciales requeridas");
  }

  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error("Email y contraseña son requeridos");
  }

  try {
    const response = await retryRequest(() =>
      apiClient.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      })
    );

    return {
      user: response.data.data?.user || null,
      sessionToken: response.data.data?.sessionToken || null,
      session: response.data.data?.session || null,
    };
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 401) {
      throw new Error("Email o contraseña incorrectos");
    }

    if (apiError.status === 404) {
      throw new Error("Usuario no encontrado");
    }

    if (apiError.status === 400) {
      if (apiError.data?.message?.includes("email")) {
        throw new Error("Formato de email inválido");
      }
      throw new Error("Datos de inicio de sesión inválidos");
    }

    throw apiError;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.warn("Error al cerrar sesión en el servidor:", error);
    return { success: true };
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data.data?.user || null;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 401) {
      throw new Error("No autorizado. Por favor inicia sesión");
    }

    throw apiError;
  }
};

export const getSessions = async () => {
  try {
    const response = await apiClient.get("/auth/sessions");
    return response.data.data?.sessions || [];
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 401) {
      throw new Error("No autorizado. Por favor inicia sesión");
    }

    throw apiError;
  }
};

export const invalidateSession = async (sessionId) => {
  if (!sessionId) {
    throw new Error("ID de sesión requerido");
  }

  try {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 401) {
      throw new Error("No autorizado");
    }

    if (apiError.status === 404) {
      throw new Error("Sesión no encontrada");
    }

    throw apiError;
  }
};

export const invalidateAllSessions = async () => {
  try {
    const response = await apiClient.delete("/auth/sessions");
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);

    if (apiError.status === 401) {
      throw new Error("No autorizado");
    }

    throw apiError;
  }
};
