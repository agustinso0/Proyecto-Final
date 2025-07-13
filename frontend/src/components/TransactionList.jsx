import React, { useEffect, useState } from "react";
import {
  getAllTransactions,
  deleteTransaction,
} from "../services/transaction.service";
import BalanceCard from "./BalanceCard";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await getAllTransactions();
      const transactionsData = response?.data || [];
      console.log("Transacciones recibidas:", transactionsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error al cargar las transacciones:", error);
      setError("Error al cargar las transacciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta transacción?")
    ) {
      try {
        await deleteTransaction(transactionId);
        // actualizamos la lista despues de eliminar
        loadTransactions();
      } catch (error) {
        console.error("Error al eliminar la transacción:", error);
        setError("Error al eliminar la transacción");
      }
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS", // formatea la moneda a pesos
    }).format(amount);
  };

  if (loading) {
    return <div>Cargando transacciones...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!transactions || transactions.length === 0) {
    return <div>No hay transacciones disponibles.</div>;
  }

  return (
    <div className="transaction-list">
      <BalanceCard transactions={transactions} />
      <h2>Transacciones</h2>
      <div className="transaction-grid">
        {transactions.map((transaction) => (
          <div
            key={transaction._id || Math.random()}
            className={`transaction-card ${transaction.type}`}
          >
            <div className="amount">{formatAmount(transaction.amount)}</div>
            <div className="category">
              {transaction.category || "Sin categoría"}
            </div>
            <div className="type">
              {transaction.type === "income" ? "↑ Ingreso" : "↓ Gasto"}
            </div>
            {transaction.description && (
              <div className="description">{transaction.description}</div>
            )}
            <button
              onClick={() => handleDelete(transaction._id)}
              className="delete-button"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
