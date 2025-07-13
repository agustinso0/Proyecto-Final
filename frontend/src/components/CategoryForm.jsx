import React, { useState } from "react";
import { createCategory } from "../services/category.service";

const CategoryForm = ({ onCategoryCreated }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!categoryName.trim()) {
      setError("El nombre de la categoría no puede estar vacío");
      return;
    }

    try {
      await createCategory(categoryName.trim());
      setSuccess("¡Categoría creada exitosamente!");
      setCategoryName("");
      if (onCategoryCreated) {
        onCategoryCreated();
      }
    } catch (error) {
      setError(error.message || "Error al crear la categoría");
    }
  };

  return (
    <div className="category-form">
      <h3>Agregar Nueva Categoría</h3>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryName">Nombre de la Categoría</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Ej: Alimentos, Transporte, Salario"
            required
          />
        </div>
        <button type="submit">Crear Categoría</button>
      </form>
    </div>
  );
};

export default CategoryForm;
