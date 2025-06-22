const CategoryService = require("../services/category.service");
const ApiResponse = require("../middleware/ApiResponse")

const getAllCategories = async (req, res) => {

    try{
        const categories = await CategoryService.getAllCategories();
        res.status(200).json(new ApiResponse(200,categories,"Categorias encontradas correctamente"));
    }catch (error){
        res.status(500).json(new ApiResponse(500,null,"Categorias no encontradas"));
    }
}


const deleteCategoryByName = async (req,res) => {
    try{
        const {name} = req.params;
        const success = CategoryService.deleteCategoryByName(name)
        if (success !== null){
            res.status(200).json(new ApiResponse(200, success, "Categoria eliminada correctamente"))
        }
        else {
            res.status(404).json(new ApiResponse(404, null, "Categoria no encontrada"));

        }
    }catch (error) {
        res.status(500).json(new ApiResponse(200, null, "Error al eliminar la categoria"))
    }
}

module.exports = {
    getAllCategories,
    deleteCategoryByName
};