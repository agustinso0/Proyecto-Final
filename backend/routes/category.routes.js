const express = require("express");
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { authenticate } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const {
  categoryValidationRules,
  categoryUpdateValidationRules,
  categoryIdValidation,
} = require("../validators/category.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", getAllCategories);
router.get("/:id", categoryIdValidation(), validateRequest, getCategory);
router.post("/", categoryValidationRules(), validateRequest, createCategory);
router.put(
  "/:id",
  categoryIdValidation(),
  categoryUpdateValidationRules(),
  validateRequest,
  updateCategory
);
router.delete("/:id", categoryIdValidation(), validateRequest, deleteCategory);

module.exports = router;
