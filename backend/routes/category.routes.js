const express = require("express");
const {getAllCategories, deleteCategoryByName} = require("../controllers/category.controller");


const router = express.Router();

router.get("/", getAllCategories);
router.delete("/:name", deleteCategoryByName);

module.exports = router;