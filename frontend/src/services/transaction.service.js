export const validateTransactionDataForCreation = (data) => {
  const errors = [];

  if (!data.amount || data.amount <= 0) {
    errors.push("El monto debe ser mayor a 0");
  }

  if (!data.type || !["income", "expense"].includes(data.type)) {
    errors.push("El tipo debe ser 'income' o 'expense'");
  }

  if (!data.category) {
    errors.push("La categoría es obligatoria");
  }

  if (data.description && data.description.length > 500) {
    errors.push("La descripción no puede exceder 500 caracteres");
  }

  if (data.user && !data.user.id) {
    errors.push("El ID de usuario es obligatorio");
  }

  return errors;
};

export const validateTransactionDataForEdit = (data) => {
  const errors = [];

  if (data.amount !== undefined && data.amount <= 0) {
    errors.push("El monto debe ser mayor a 0");
  }

  if (data.type && !["income", "expense"].includes(data.type)) {
    errors.push("El tipo debe ser 'income' o 'expense'");
  }

  if (data.description && data.description.length > 500) {
    errors.push("La descripción no puede exceder 500 caracteres");
  }

  return errors;
};

export const formatTransactionForCreate = (data) => {
  return {
    userId: data.userId,
    amount: parseFloat(data.amount),
    type: data.type,
    category: data.category,
    description: data.description?.trim() || "",
  };
};

export const formatTransactionForUpdate = (data) => {
  const formatted = {};

  if (data.amount !== undefined) {
    formatted.amount = parseFloat(data.amount);
  }

  if (data.type) {
    formatted.type = data.type;
  }

  if (data.category) {
    formatted.category = data.category;
  }

  if (data.description !== undefined) {
    formatted.description = data.description.trim();
  }

  return formatted;
};

export const formatTransactionForDisplay = (transaction) => {
  return {
    ...transaction,
    amount: parseFloat(transaction.amount).toFixed(2),
    formattedAmount: `$${parseFloat(transaction.amount).toLocaleString(
      "es-AR",
      { minimumFractionDigits: 2 }
    )}`,
    typeLabel: transaction.type === "income" ? "Ingreso" : "Gasto",
    categoryName: transaction.category?.name || "Sin categoría",
    formattedDate: new Date(transaction.createdAt).toLocaleDateString("es-AR"),
  };
};
