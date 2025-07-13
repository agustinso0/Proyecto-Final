import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getAll,
  getById,
  create,
  update,
  _delete,
  getSummary,
  getByCategory,
} from "../repositories/transactionRepository";

import {
  validateTransactionDataForCreation,
  validateTransactionDataForEdit,
  formatTransactionForCreate,
  formatTransactionForUpdate,
} from "../services/transaction.service";
import { createValidationError } from "../services/utils/createValidationError";
import { handleApiError } from "../utils/errorHandler";

export const useTransactions = () => {
  return useQuery("transactions", getAll, {
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: false,
  });
};

export const useTransaction = (id) => {
  return useQuery(["transaction", id], () => getById(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useTransactionSummary = () => {
  return useQuery("transactionSummary", getSummary, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useTransactionsByCategory = (categoryId) => {
  return useQuery(
    ["transactionsByCategory", categoryId],
    () => getByCategory(categoryId),
    {
      enabled: !!categoryId,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );
};

export const useTransactionMutations = () => {
  const queryClient = useQueryClient();

  const createTransactionMutation = useMutation(
    async (transactionData) => {
      const validationErrors =
        validateTransactionDataForCreation(transactionData);
      if (validationErrors.length > 0) {
        throw createValidationError(validationErrors);
      }

      const formattedData = formatTransactionForCreate(transactionData);
      return await create(formattedData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("transactionSummary");
        queryClient.invalidateQueries("transactionsByCategory");
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        handleApiError(error, "crear transacción");
        throw error;
      },
    }
  );

  const updateTransactionMutation = useMutation(
    async ({ id, transactionData }) => {
      const validationErrors = validateTransactionDataForEdit(transactionData);
      if (validationErrors.length > 0) {
        throw createValidationError(validationErrors);
      }

      const formattedData = formatTransactionForUpdate(transactionData);
      return await update(id, formattedData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("transactionSummary");
        queryClient.invalidateQueries("transactionsByCategory");
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        handleApiError(error, "actualizar transacción");
        throw error;
      },
    }
  );

  const deleteTransactionMutation = useMutation(
    async (id) => {
      return await _delete(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
        queryClient.invalidateQueries("transactionSummary");
        queryClient.invalidateQueries("transactionsByCategory");
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        handleApiError(error, "eliminar transacción");
        throw error;
      },
    }
  );

  return {
    createTransaction: createTransactionMutation,
    updateTransaction: updateTransactionMutation,
    deleteTransaction: deleteTransactionMutation,
  };
};
