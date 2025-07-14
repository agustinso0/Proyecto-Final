export class ApiError extends Error {
  constructor(message, status, statusText, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  getUserFriendlyMessage() {
    const statusMessages = {
      400: "Los datos enviados no son válidos",
      401: "No tienes autorización para realizar esta acción",
      403: "No tienes permisos para acceder a este recurso",
      404: "El recurso solicitado no fue encontrado",
      409: "Ya existe un recurso con esos datos",
      422: "Los datos enviados contienen errores de validación",
      429: "Has excedido el límite de solicitudes. Intenta más tarde",
      500: "Error interno del servidor. Intenta más tarde",
      502: "El servidor no está disponible temporalmente",
      503: "El servicio no está disponible. Intenta más tarde",
    };

    if (this.data?.message) {
      return this.data.message;
    }

    if (this.data?.errors && Array.isArray(this.data.errors)) {
      return this.data.errors.join(", ");
    }

    return statusMessages[this.status] || "Ha ocurrido un error inesperado";
  }

  isValidationError() {
    return this.status === 400 || this.status === 422;
  }

  isAuthError() {
    return this.status === 401 || this.status === 403;
  }

  isServerError() {
    return this.status >= 500;
  }

  isNetworkError() {
    return !this.status;
  }
}
