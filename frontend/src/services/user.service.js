import { ApiError } from "../utils/ApiError";

export const validateUserDataForCreation = (userData) => {
  const errors = [];

  if (!userData.firstname || userData.firstname.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }
  if (!userData.lastname || userData.lastname.trim().length < 2) {
    errors.push("El apellido debe tener al menos 2 caracteres");
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push("El email debe tener un formato válido");
  }

  if (userData.password && userData.password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  if (userData.balance && userData.balance < 0) {
    errors.push("El balance no puede ser negativo");
  }

  return errors;
};

export const validateUserDataForEdit = (userData) => {
  const errors = [];

  if (!userData.firstname || userData.firstname.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }
  if (!userData.lastname || userData.lastname.trim().length < 2) {
    errors.push("El apellido debe tener al menos 2 caracteres");
  }
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push("El email debe tener un formato válido");
  }

  return errors;
};

export const validateBalanceOperation = (amount, operation, currentBalance) => {
  const errors = [];

  if (!amount || amount <= 0) {
    errors.push("El monto debe ser mayor a 0");
  }

  if (!operation || !["add", "subtract"].includes(operation)) {
    errors.push("La operación debe ser 'add' o 'subtract'");
  }

  if (operation === "subtract" && amount > currentBalance) {
    errors.push(
      `No se puede restar $${amount} del balance actual de $${currentBalance}`
    );
  }

  return errors;
};

export const formatUserForCreate = (userData) => {
  try {
    return {
      firstname: userData.firstname?.trim() || "",
      lastname: userData.lastname?.trim() || "",
      email: userData.email?.trim().toLowerCase() || "",
      password: userData.password || "",
      balance: parseFloat(userData.balance) || 0,
    };
  } catch (error) {
    throw new ApiError(
      "Error al formatear datos de usuario para creación",
      400,
      "Bad Request"
    );
  }
};

export const formatUserForUpdate = (userData) => {
  try {
    return {
      firstname: userData.firstname?.trim() || "",
      lastname: userData.lastname?.trim() || "",
      email: userData.email?.trim().toLowerCase() || "",
    };
  } catch (error) {
    throw new ApiError(
      "Error al formatear datos de usuario para actualización",
      400,
      "Bad Request"
    );
  }
};

const isValidEmail = (email) => {
  if (!email || typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
