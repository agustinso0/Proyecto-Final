import { useState } from "react";
import { useCategories, useCategoryMutations } from "../hooks/useCategory";
import "../styles/CategoryList.css";

export default function CategoryList() {
  const [newCategory, setNewCategory] = useState("");

  // Usar React Query hooks
  const { data: categories, isLoading, error } = useCategories();
  const { createCategory, deleteCategory } = useCategoryMutations();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await createCategory.mutateAsync({ name: newCategory });
      setNewCategory("");
    } catch (error) {
      console.error("Error al crear la categoria:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory.mutateAsync(id);
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
    }
  };

  if (isLoading)
    return (
      <div className="loading-container">
        <div>Cargando categorías...</div>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <div>Error al cargar categorías</div>
        <div style={{ fontSize: "14px", marginTop: "8px" }}>
          {error.message}
        </div>
      </div>
    );

  return (
    <div className="categories-container">
      <h2>Categorías</h2>

      {/* Formulario para agregar nueva categoría */}
      <div className="add-category-form">
        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría..."
            className="category-input"
          />
          <button
            type="submit"
            className="add-button"
            disabled={!newCategory.trim()}
          >
            Agregar
          </button>
        </form>
      </div>

      {/* Lista de categorías */}
      <div className="categories-grid">
        {categories &&
          categories.map((cat) => (
            <div key={cat._id} className="category-card">
              <div className="category-content">
                <span className="category-name">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="delete-button"
                  title="Eliminar categoría"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
      </div>

      {categories && categories.length === 0 && (
        <div className="empty-state">
          <p>No hay categorías creadas aún.</p>
          <p>¡Agrega tu primera categoría arriba!</p>
        </div>
      )}
    </div>
  );
}
