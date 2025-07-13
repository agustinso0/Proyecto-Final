import React from "react";

const BalanceCard = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0); // suma todas las transacciones de ingreso "income"

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0); //suma todas las transacciones de egreso

  const balance = income - expense;

  const formatAmount = (amount) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);

  return (
    <div className="balance-card">
      <h2>Resumen de Gastos</h2>
      <p className="income">Ingresos: {formatAmount(income)}</p>
      <p className="expense">Gastos: {formatAmount(expense)}</p>
      <p className={`balance ${balance >= 0 ? "positive" : "negative"}`}>
        Balance: {formatAmount(balance)}
      </p>
    </div>
  );
};

export default BalanceCard;
