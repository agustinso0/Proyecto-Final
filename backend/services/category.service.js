const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

class CategoryService {
  async getAllCategories() {
    try {
      const categories = await Category.find({ isActive: true }).sort({
        createdAt: -1,
      });

      const total = await Category.countDocuments({
        isActive: true,
      });

      return {
        categories,
        total: total,
      };
    } catch (error) {
      logger.error("Error al obtener todas las categorías", error);
      throw new ApiError(500, "Error al obtener categorías");
    }
  }

  async getCategoryById(id) {
    try {
      const category = await Category.findOne({ _id: id, isActive: true });

      if (!category) {
        throw new ApiError(404, "Categoría no encontrada");
      }

      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al obtener una categoría por su id:", error);
      throw new ApiError(500, "Error al buscar categoría");
    }
  }

  async createCategory(categoryData) {
    try {
      const nameExists = await Category.findOne({ name: categoryData.name });
      if (nameExists) {
        throw new ApiError(400, "El nombre de la categoría ya existe");
      }

      const category = new Category(categoryData);
      await category.save();

      logger.info(`Categoría creada: ${category.name}`);
      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.code === 11000) {
        throw new ApiError(400, "El nombre de la categoría ya existe");
      }
      logger.error("Error al crear una categoría:", error);
      throw new ApiError(500, "Error al crear categoría");
    }
  }

  async updateCategory(id, updateData) {
    try {
      if (updateData.name) {
        const nameExists = await Category.findOne({
          name: updateData.name,
          _id: { $ne: id },
        });
        if (nameExists) {
          throw new ApiError(400, "El nombre de la categoría ya existe");
        }
      }

      const category = await Category.findOneAndUpdate(
        { _id: id, isActive: true },
        updateData,
        { new: true, runValidators: true }
      );

      if (!category) {
        throw new ApiError(404, "Categoría no encontrada");
      }

      logger.info(`Categoría actualizada: ${category.name}`);
      return category;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error.code === 11000) {
        throw new ApiError(400, "El nombre de la categoría ya existe");
      }
      logger.error("Error al actualizar una categoría:", error);
      throw new ApiError(500, "Error al actualizar categoría");
    }
  }

  async deleteCategory(id) {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: id, isActive: true },
        { isActive: false },
        { new: true }
      );

      if (!category) {
        throw new ApiError(404, "Categoría no encontrada");
      }

      logger.info(`Categoría desactivada (soft): ${category.name}`);
      return { message: "Categoría eliminada correctamente" };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error("Error al eliminar una categoría:", error);
      throw new ApiError(500, "Error al eliminar categoría");
    }
  }

  async getCategoryByName(name) {
    try {
      const category = await Category.findOne({ name, isActive: true });
      return category;
    } catch (error) {
      logger.error("Error al obtener una categoría por nombre:", error);
      throw new ApiError(500, "Error al buscar categoría por nombre");
    }
  }
}

module.exports = new CategoryService();
