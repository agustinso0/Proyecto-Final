const Category = require("../models/Category");

class CategoryService {
    static async getAllCategories() {
        const categories = await Category.find();
        return categories;
    }

    static async createCategory(nombre) {
        const nuevaCategoria = new Category({ name: nombre });
        return await nuevaCategoria.save();
    }
}

module.exports = CategoryService;