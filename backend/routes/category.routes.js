const express = require("express");
const {getAllCategories, deleteCategoryByName, createCategory, getCategoryByName} = require("../controllers/category.controller");
const { authenticate } = require("../middleware/auth")

const router = express.Router();

//Ruta publica
router.get("/", getAllCategories);
router.get("/:name", getCategoryByName);

router.use(authenticate);

//Rutas protegidas
router.delete("/:name", deleteCategoryByName);
router.post("/", createCategory);

module.exports = router;