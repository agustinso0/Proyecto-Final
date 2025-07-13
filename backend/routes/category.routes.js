const express = require("express");
const { getAllCategories, createCategory } = require("../controllers/category.controller");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.use(authenticate);
router.get("/", getAllCategories);
router.post("/", createCategory);

module.exports = router;