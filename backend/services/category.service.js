const Category = require("../models/Category")

class CategoryService {
    static async getAllCategories(){
        try {
            const categories = await Category.find()
            return categories
        } catch (error) {
            console.log("Error al obtener todas las categorias", error);
            throw error;
        }
    }

    static async deleteCategoryByName(nombre){
        try {
            const categoria = await Category.findOneAndDelete({name : nombre});
            return categoria; //null si no existe
        } catch (error) {
            console.log("Error al encontrar la categoria", error)
            return false
        }
    }
}




module.exports = CategoryService;