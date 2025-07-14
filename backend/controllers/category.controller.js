const CategoryService = require("../services/category.service");
const ApiResponse = require("../utils/ApiResponse");

const getAllCategories = async (req, res, next) => {
  try {
    const result = await CategoryService.getAllCategories();
    res
      .status(200)
      .json(new ApiResponse(200, result, "Categorías obtenidas exitosamente"));
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.getCategoryById(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, category, "Categoría encontrada"));
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const newCategory = await CategoryService.createCategory(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, newCategory, "Categoría creada exitosamente"));
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const result = await CategoryService.deleteCategory(req.params.id);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Categoría eliminada exitosamente"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
