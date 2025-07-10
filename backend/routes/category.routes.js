const express = require("express");
const { getAllCategories, createCategory, deleteCategory } = require("../controllers/category.controller");
const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

module.exports = router;