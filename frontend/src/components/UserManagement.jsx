import React from "react";
import { useUsers } from "../hooks/useUsers";
import { useUserHandlers } from "../hooks/useUserHandlers";
import EditUserForm from "./users/EditUserForm";
import UserCard from "./users/UserCard";
import "../styles/UserList.css";

const UsersManagement = () => {
  const { data: users, isLoading, error } = useUsers();
  const {
    editingUser,
    handleUpdateUser,
    handleDeleteUser,
    handleUpdateBalance,
    startEdit,
    cancelEdit,
    isUpdating,
    isUpdatingBalance,
    updateError,
  } = useUserHandlers();

  if (isLoading) return <div className="loading">Cargando usuarios...</div>;
  if (error)
    return (
      <div className="error">Error al cargar los usuarios: {error.message}</div>
    );

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h2>Gestión de Usuarios</h2>
      </div>

      {/* Lista de usuarios */}
      <div className="users-grid">
        {users?.map((user) => (
          <div key={user.id} className="user-card">
            {editingUser?.id === user.id ? (
              <EditUserForm
                user={user}
                onSubmit={(userData) => handleUpdateUser(user.id, userData)}
                onCancel={cancelEdit}
                isLoading={isUpdating}
                error={updateError}
              />
            ) : (
              <UserCard
                user={user}
                onEdit={() => startEdit(user)}
                onDelete={() => handleDeleteUser(user.id, user.fullName)}
                onUpdateBalance={(amount, operation, currentBalance) =>
                  handleUpdateBalance(
                    user.id,
                    amount,
                    operation,
                    currentBalance
                  )
                }
                isUpdatingBalance={isUpdatingBalance}
              />
            )}
          </div>
        ))}
      </div>

      {users?.length === 0 && (
        <div className="no-users">
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
