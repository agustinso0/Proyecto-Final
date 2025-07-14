export const validateRegistrationData = (userData) => {
  const errors = [];

  if (!userData.firstname || userData.firstname.trim().length < 1) {
    errors.push("El nombre es obligatorio");
  } else if (userData.firstname.trim().length > 50) {
    errors.push("El nombre no puede exceder 50 caracteres");
  }

  if (!userData.lastname || userData.lastname.trim().length < 1) {
    errors.push("El apellido es obligatorio");
  } else if (userData.lastname.trim().length > 50) {
    errors.push("El apellido no puede exceder 50 caracteres");
  }

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push("El email debe tener un formato válido");
  }

  if (!userData.password) {
    errors.push("La contraseña es obligatoria");
  } else if (userData.password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  if (userData.address && userData.address.trim().length > 200) {
    errors.push("La dirección no puede exceder 200 caracteres");
  }

  return errors;
};

export const validateLoginData = (credentials) => {
  const errors = [];

  if (!credentials.email || !isValidEmail(credentials.email)) {
    errors.push("Debe proporcionar un email válido");
  }

  if (!credentials.password) {
    errors.push("La contraseña es obligatoria");
  }

  return errors;
};

export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email?.trim()?.toLowerCase());
};

export const formatRegistrationData = (userData) => {
  return {
    firstname: userData.firstname?.trim() || "",
    lastname: userData.lastname?.trim() || "",
    email: userData.email?.trim()?.toLowerCase() || "",
    password: userData.password || "",
    address: userData.address?.trim() || "",
  };
};

export const formatLoginData = (credentials) => {
  return {
    email: credentials.email?.trim()?.toLowerCase() || "",
    password: credentials.password || "",
  };
};
