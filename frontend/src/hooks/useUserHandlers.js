import { useState } from "react";
import { useUserMutations } from "./useUsers";

export const useUserHandlers = () => {
  const [editingUser, setEditingUser] = useState(null);

  const mutations = useUserMutations();

  const handleUpdateUser = async (id, userData) => {
    try {
      await mutations.updateUser.mutateAsync({ id, userData });
      setEditingUser(null);
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return { success: false, error };
    }
  };

  const handleDeleteUser = async (id, userName) => {
    if (
      window.confirm(`¿Estás seguro de que quieres eliminar a ${userName}?`)
    ) {
      try {
        await mutations.deleteUser.mutateAsync(id);
        return { success: true };
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert(`Error al eliminar usuario: ${error.message}`);
        return { success: false, error };
      }
    }
    return { success: false, cancelled: true };
  };

  const handleUpdateBalance = async (id, amount, operation, currentBalance) => {
    try {
      await mutations.updateBalance.mutateAsync({
        id,
        amount: parseFloat(amount),
        operation,
        currentBalance: currentBalance || 0,
      });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar balance:", error);
      alert(`Error al actualizar balance: ${error.message}`);
      return { success: false, error };
    }
  };

  const startEdit = (user) => setEditingUser(user);
  const cancelEdit = () => setEditingUser(null);

  return {
    editingUser,

    handleUpdateUser,
    handleDeleteUser,
    handleUpdateBalance,

    startEdit,
    cancelEdit,

    isCreating: mutations.createUser.isLoading,
    isUpdating: mutations.updateUser.isLoading,
    isDeleting: mutations.deleteUser.isLoading,
    isUpdatingBalance: mutations.updateBalance.isLoading,

    createError: mutations.createUser.error,
    updateError: mutations.updateUser.error,
    deleteError: mutations.deleteUser.error,
    balanceError: mutations.updateBalance.error,
  };
};
