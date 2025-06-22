const express = require("express");
const {getAllCategories, deleteCategoryByName, createCategory} = require("../controllers/category.controller");


const router = express.Router();

router.get("/", getAllCategories);
router.delete("/:name", deleteCategoryByName);
router.post("/", createCategory);

module.exports = router;