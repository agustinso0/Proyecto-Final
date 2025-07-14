import React, { useState } from "react";

const UserCard = ({
  user,
  onEdit,
  onDelete,
  onUpdateBalance,
  isUpdatingBalance,
}) => {
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [operation, setOperation] = useState("add");

  const handleBalanceSubmit = (e) => {
    e.preventDefault();
    onUpdateBalance(balanceAmount, operation, user.balance);
    setShowBalanceForm(false);
    setBalanceAmount(0);
  };

  const toggleBalanceForm = () => {
    setShowBalanceForm(!showBalanceForm);
    if (!showBalanceForm) {
      setBalanceAmount(0);
      setOperation("add");
    }
  };

  return (
    <div className="user-card-content">
      <div className="user-info">
        <h4>{user.fullName}</h4>
        <p className="user-email">{user.email}</p>
        <p className="user-balance">
          Balance:{" "}
          <span className="balance-amount">
            ${user.balance?.toFixed(2) || "0.00"}
          </span>
        </p>
      </div>

      <div className="user-actions">
        <button className="btn btn-sm btn-secondary" onClick={onEdit}>
          Editar
        </button>
        <button className="btn btn-sm btn-info" onClick={toggleBalanceForm}>
          Balance
        </button>
        <button className="btn btn-sm btn-danger" onClick={onDelete}>
          Eliminar
        </button>
      </div>

      {showBalanceForm && (
        <div className="balance-form">
          <form onSubmit={handleBalanceSubmit}>
            <div className="form-group">
              <label>Operación:</label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                disabled={isUpdatingBalance}
              >
                <option value="add">Agregar</option>
                <option value="subtract">Restar</option>
              </select>
            </div>
            <div className="form-group">
              <label>Monto:</label>
              <input
                type="number"
                value={balanceAmount}
                onChange={(e) =>
                  setBalanceAmount(parseFloat(e.target.value) || 0)
                }
                step="0.01"
                min="0.01"
                required
                disabled={isUpdatingBalance}
              />
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={isUpdatingBalance}
              >
                {isUpdatingBalance ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={toggleBalanceForm}
                disabled={isUpdatingBalance}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserCard;
