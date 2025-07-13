const CategoryService = require("../services/category.service");
const ApiResponse = require("../utils/ApiResponse");

const getAllCategories = async (req, res) => {
  const result = await CategoryService.getAllCategories();
  res
    .status(200)
    .json(new ApiResponse(200, result, "Categorías obtenidas exitosamente"));
};

const getCategory = async (req, res) => {
  const category = await CategoryService.getCategoryById(req.params.id);
  res.status(200).json(new ApiResponse(200, category, "Categoría encontrada"));
};

const createCategory = async (req, res) => {
  const newCategory = await CategoryService.createCategory(req.body);
  res
    .status(201)
    .json(new ApiResponse(201, newCategory, "Categoría creada exitosamente"));
};

const updateCategory = async (req, res) => {
  const updatedCategory = await CategoryService.updateCategory(
    req.params.id,
    req.body
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCategory,
        "Categoría actualizada exitosamente"
      )
    );
};

const deleteCategory = async (req, res) => {
  const result = await CategoryService.deleteCategory(req.params.id);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Categoría eliminada exitosamente"));
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
