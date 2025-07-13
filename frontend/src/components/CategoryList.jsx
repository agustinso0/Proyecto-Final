import { useEffect, useState } from "react";
import { createCategory, getAllCategories } from "../services/category.service";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getAllCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Error al obtener las categorias:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // evita el refresh
    if (!newCategory.trim()) return;
    try {
      await createCategory(newCategory);
      const data = await getAllCategories();
      setCategories(data.data);
      setNewCategory("");
    } catch (error) {
      console.error("Error al crear la categoria:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nueva Categoria"
        />
        <button type="submit">Crear</button>
      </form>

      <ul>
        {categories &&
          categories.map((cat) => <li key={cat._id}>{cat.name}</li>)}
      </ul>
    </div>
  );
}
