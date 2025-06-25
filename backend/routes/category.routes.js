const express = require("express");
const {getAllCategories, deleteCategoryByName, createCategory} = require("../controllers/category.controller");
const { authenticate } = require("../middleware/auth")

const router = express.Router();

//Ruta publica
router.get("/", getAllCategories);


router.use(authenticate);

//Rutas protegidas
router.delete("/:name", deleteCategoryByName);
router.post("/", createCategory);

module.exports = router;