const express = require('express');
const {getAllTransactions, createTransaction, deleteTransaction, getSummary} = require("../controllers/transaction.controller");
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.use(authenticate);
router.get("/", getAllTransactions);
router.get("/summary", getSummary);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;