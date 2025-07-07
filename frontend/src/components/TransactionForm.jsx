import React, { useState } from 'react';
import { createTransaction } from '../services/transaction.service';

const TransactionForm = ({ onTransactionCreated }) => {


  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      console.log('Enviando datos:', formData);
      const result = await createTransaction(formData);
      console.log('Respuesta:', result);
      
      setFormData({
        amount: '',
        type: 'expense',
        category: '',
        description: ''
      });
      
      setSuccess('¡Transacción creada!');
      
      if (onTransactionCreated) {
        onTransactionCreated();
      }
    } catch (error) {
      console.error('Error al crear transacción:', error);
      setError('Error al crear la transacción. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="transaction-form">
      <h3>Agregar Nueva Transacción</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Monto</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipo</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Gasto</option>
            <option value="income">Ingreso</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Ej: Comida, Transporte, Salario"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción (opcional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Agrega detalles sobre la transacción"
          />
        </div>

        <button type="submit">Agregar Transacción</button>
      </form>
    </div>
  );
};

export default TransactionForm; 