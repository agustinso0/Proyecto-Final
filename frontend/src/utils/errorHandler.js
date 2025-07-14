import { ApiError } from "./ApiError";

export const handleApiError = (error) => {
  if (!error.response) {
    return new ApiError(
      "Error de conexión. Verifica tu conexión a internet.",
      null,
      "Network Error",
      null
    );
  }

  const { status, statusText, data } = error.response;

  let message = "Ha ocurrido un error";
  let errorData = data;

  if (data) {
    if (data.message) {
      message = data.message;
    } else if (data.error) {
      message = data.error;
    } else if (data.errors && Array.isArray(data.errors)) {
      message = data.errors.join(", ");
    } else if (typeof data === "string") {
      message = data;
    }
  }

  return new ApiError(message, status, statusText, errorData);
};

export const showErrorNotification = (error) => {
  let message = "Ha ocurrido un error inesperado";

  if (error instanceof ApiError) {
    message = error.getUserFriendlyMessage();
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  alert(`Error: ${message}`);

  console.error("Error details:", error);
};

export const showSuccessNotification = (message) => {
  alert(`Éxito: ${message}`);
};

export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      const apiError = handleApiError(error);

      if (apiError.status >= 400 && apiError.status < 500) {
        throw apiError;
      }

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        continue;
      }

      throw apiError;
    }
  }

  throw handleApiError(lastError);
};
