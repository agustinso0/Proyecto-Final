import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../services/transaction.service';

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
      console.log('Transacciones recibidas:', transactionsData);
      setTransactions(transactionsData);
    } catch (error) {
      console.error('Error al cargar las transacciones:', error);
      setError('Error al cargar las transacciones');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
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
      <h2>Transacciones</h2>
      <div className="transaction-grid">
        {transactions.map((transaction) => (
          <div 
            key={transaction._id || Math.random()} 
            className={`transaction-card ${transaction.type}`}
          >
            <div className="amount">
              {formatAmount(transaction.amount)}
            </div>
            <div className="category">
              {transaction.category || 'Sin categoría'}
            </div>
            <div className="type">
              {transaction.type === 'income' ? '↑ Ingreso' : '↓ Gasto'}
            </div>
            {transaction.description && (
              <div className="description">
                {transaction.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList; 