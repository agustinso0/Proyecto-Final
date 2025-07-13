import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  getAll,
  getById,
  getByEmail,
  create,
  update,
  _delete,
  updateBalance,
} from "../repositories/userRepository";
import {
  validateUserDataForCreation,
  validateUserDataForEdit,
  formatUserForCreate,
  formatUserForUpdate,
  validateBalanceOperation,
  createValidationError,
} from "../services/user.service";
import { handleApiError } from "../utils/errorHandler";

export const useUsers = () => {
  return useQuery("users", getAll, {
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useUserById = (id) => {
  return useQuery(["user", id], () => getById(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useUserByEmail = (email) => {
  return useQuery(["userByEmail", email], () => getByEmail(email), {
    enabled: !!email,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation(
    async (userData) => {
      const validationErrors = validateUserDataForCreation(userData);
      if (validationErrors.length > 0) {
        throw createValidationError(validationErrors);
      }

      const formattedData = formatUserForCreate(userData);
      return await create(formattedData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        handleApiError(error, "crear usuario");
        throw error;
      },
    }
  );

  const updateUserMutation = useMutation(
    async ({ id, userData }) => {
      if (!id) {
        throw createValidationError(["ID de usuario requerido"]);
      }

      const validationErrors = validateUserDataForEdit(userData);
      if (validationErrors.length > 0) {
        throw createValidationError(validationErrors);
      }

      const formattedData = formatUserForUpdate(userData);
      return await update(id, formattedData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        handleApiError(error, "actualizar usuario");
        throw error;
      },
    }
  );

  const deleteUserMutation = useMutation(
    async (id) => {
      if (!id) {
        throw createValidationError(["ID de usuario requerido"]);
      }
      return await _delete(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        handleApiError(error, "eliminar usuario");
        throw error;
      },
    }
  );

  const updateBalanceMutation = useMutation(
    async ({ id, amount, operation, currentBalance = 0 }) => {
      if (!id) {
        throw createValidationError(["ID de usuario requerido"]);
      }

      const validationErrors = validateBalanceOperation(
        amount,
        operation,
        currentBalance
      );
      if (validationErrors.length > 0) {
        throw createValidationError(validationErrors);
      }

      return await updateBalance(id, parseFloat(amount), operation);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: (error) => {
        handleApiError(error, "actualizar balance");
        throw error;
      },
    }
  );

  return {
    createUser: createUserMutation,
    updateUser: updateUserMutation,
    deleteUser: deleteUserMutation,
    updateBalance: updateBalanceMutation,
  };
};

export const fetchUsers = useUsers;
