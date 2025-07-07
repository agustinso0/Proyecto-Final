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

module.exports = {
    getAllCategories,
    createCategory
};