import { useState } from "react";
import {
  useTransactions,
  useTransactionMutations,
  useTransactionSummary,
} from "../hooks/useTransaction";
import { useCategories } from "../hooks/useCategory";
import { formatTransactionForDisplay } from "../services/transaction.service";
import "../styles/transactions.css";

export default function TransactionManagement() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
  });

  // Estados para los filtros
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Hooks
  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions(filters);
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary();
  const { data: categories } = useCategories();
  const { createTransaction, updateTransaction, deleteTransaction } =
    useTransactionMutations();

  const resetForm = () => {
    setFormData({
      amount: "",
      type: "expense",
      category: "",
      description: "",
    });
    setEditingTransaction(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync({
          id: editingTransaction._id,
          transactionData: formData,
        });
      } else {
        await createTransaction.mutateAsync(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar la transacción:", error);
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category._id,
      description: transaction.description || "",
    });
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta transacción?")
    ) {
      try {
        await deleteTransaction.mutateAsync(id);
      } catch (error) {
        console.error("Error al eliminar la transacción:", error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    filters.category || filters.startDate || filters.endDate;

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      category: "",
      startDate: "",
      endDate: "",
    });
  };

  if (transactionsLoading) {
    return (
      <div className="loading-container">
        <div>Cargando transacciones...</div>
      </div>
    );
  }

  if (transactionsError) {
    return (
      <div className="error-container">
        <div>Error al cargar transacciones</div>
        <div className="error-detail">{transactionsError.message}</div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      {/* Resumen */}
      {!summaryLoading && summary && (
        <div className="transaction-summary">
          <div className="summary-card income">
            <h3>Ingresos</h3>
            <p className="amount">
              $
              {summary.totalIngresos?.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
          <div className="summary-card expense">
            <h3>Gastos</h3>
            <p className="amount">
              $
              {summary.totalEgresos?.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
          <div className="summary-card balance">
            <h3>Balance</h3>
            <p
              className={`amount ${
                summary.balanceActual >= 0 ? "positive" : "negative"
              }`}
            >
              $
              {summary.balanceActual?.toLocaleString("es-AR", {
                minimumFractionDigits: 2,
              }) || "0.00"}
            </p>
          </div>
        </div>
      )}

      {/* Botón para mostrar formulario */}
      <div className="transaction-actions">
        <button
          onClick={() => setShowForm(!showForm)}
          className="add-transaction-btn"
        >
          {showForm ? "Cancelar" : "Nueva Transacción"}
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-btn ${hasActiveFilters ? "active" : ""}`}
        >
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          {hasActiveFilters && <span className="filter-indicator">●</span>}
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="filters-container">
          <h3>Filtrar Transacciones</h3>
          <div className="filters-form">
            <div className="filter-group">
              <label htmlFor="filterCategory">Categoría</label>
              <select
                id="filterCategory"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">Todas las categorías</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="startDate">Fecha desde</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="endDate">Fecha hasta</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="transaction-form-container">
          <form onSubmit={handleSubmit} className="transaction-form">
            <h3>
              {editingTransaction ? "Editar Transacción" : "Nueva Transacción"}
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Monto</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Tipo</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="expense">Gasto</option>
                  <option value="income">Ingreso</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoría</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona una categoría</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción (opcional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción de la transacción..."
                maxLength="500"
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingTransaction ? "Actualizar" : "Crear"}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de transacciones */}
      <div className="transactions-list">
        <div className="transactions-header">
          <h3>Historial de Transacciones</h3>
          {hasActiveFilters && (
            <div className="active-filters-info">
              <span>Filtros aplicados</span>
              <button onClick={clearFilters} className="clear-quick-btn">
                Limpiar
              </button>
            </div>
          )}
        </div>

        {transactions && transactions.length > 0 ? (
          <div className="transactions-content">
            <div className="transactions-grid">
              {transactions.map((transaction) => {
                const formattedTransaction =
                  formatTransactionForDisplay(transaction);
                return (
                  <div
                    key={transaction._id}
                    className={`transaction-card ${transaction.type}`}
                  >
                    <div className="transaction-header">
                      <span className={`transaction-type ${transaction.type}`}>
                        {formattedTransaction.typeLabel}
                      </span>
                      <span className="transaction-date">
                        {formattedTransaction.formattedDate}
                      </span>
                    </div>

                    <div className="transaction-content">
                      <div className="transaction-amount">
                        {formattedTransaction.formattedAmount}
                      </div>
                      <div className="transaction-category">
                        {formattedTransaction.categoryName}
                      </div>
                      {transaction.description && (
                        <div className="transaction-description">
                          {transaction.description}
                        </div>
                      )}
                    </div>

                    <div className="transaction-actions">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="edit-btn"
                        title="Editar transacción"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="delete-btn"
                        title="Eliminar transacción"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>No hay transacciones registradas aún.</p>
            <p>¡Agrega tu primera transacción arriba!</p>
          </div>
        )}
      </div>
    </div>
  );
}
