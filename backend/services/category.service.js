const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");

class CategoryService {
    static async getAllCategories(){
        try {
            const categories = await Category.find()
            return categories
        } catch (error) {
            throw new ApiError(500, null, "Error al al obtener las categorias", error)
        }
    }

    static async deleteCategoryByName(nombre){
        try {
            const categoria = await Category.findOneAndDelete({name : nombre});
            return categoria; //null si no existe
        } catch (error) {
            throw new ApiError(500, null, "Error al encontrar la categoria")
        }
    }

    static async createCategory(nombre){

        try {
            const nombreCategory = await Category.findOne({name: nombre}); //null si no lo encuentra
            if(nombreCategory !== null){
                throw new ApiError(400, null, "La categoria ya existe")
            }else {
                const nuevaCategoria = new Category({name: nombre});
                await nuevaCategoria.save();
                return nuevaCategoria;
            }
        } catch (error) {
            throw new ApiError(500, null, "Error al crear la categoria")
        }
    }
}




module.exports = CategoryService;