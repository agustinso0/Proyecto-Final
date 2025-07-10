const CategoryService = require("../services/category.service");

const getAllCategories = async (req, res) => {
    const categories = await CategoryService.getAllCategories();
    res.json({ data: categories });
};

const createCategory = async (req, res) => {
    const { name } = req.body;
    const category = await CategoryService.createCategory(name);
    res.json({ data: category });
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CategoryService.deleteCategory(id);
    res.json({ message: "Categoría eliminada correctamente", data: deleted });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la categoría" });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategory
};
