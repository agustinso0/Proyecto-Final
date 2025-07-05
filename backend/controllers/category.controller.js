const CategoryService = require("../services/category.service");
const ApiResponse = require("../middleware/ApiResponse")

const getAllCategories = async (req, res, next) => {

    try{
        const search = req.query.search || ""
        const categories = await CategoryService.getAllCategories(search);
        res.status(200).json(new ApiResponse(200,categories,"Categorias encontradas correctamente"));
    }catch (error){
        next(error)
    }
}


const deleteCategoryByName = async (req,res) => {
    try{
        const {name} = req.params;
        const success = await CategoryService.deleteCategoryByName(name)
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


const createCategory = async (req, res) => {
    try {
        const {name} = req.body
        const success = await CategoryService.createCategory(name)
        if(success !== null){
            res.status(201).json(new ApiResponse(200, success, "Categoria creada correctamente"))
        }
        else {
            res.status(404).json(new ApiResponse(200, success, "Categoria no creada"))
        }
        
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, "Error al crear la categoria"))
    }
}

const getCategoryByName = async (req, res) => {
    try {
        const {name} = req.params;
        const success = await CategoryService.getCategorieByName(name);
        if(success){
            res.status(200).json(new ApiResponse(200, success, "Categoria encontrada correctamente"));
        }else{
            res.status(404).json(new ApiResponse(404, null, "Categoria no encontrada"));
        }
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, "Error al buscar la cetegoria"))
    }
}



module.exports = {
    getAllCategories,
    deleteCategoryByName,
    createCategory,
    getCategoryByName
};