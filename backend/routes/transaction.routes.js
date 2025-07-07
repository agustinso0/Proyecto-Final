const express = require('express');
const {getAllTransactions, createTransaction, deleteTransaction, getSummary} = require("../controllers/transaction.controller");
const router = express.Router();

// Rutas sin autenticación para desarrollo
router.get("/", getAllTransactions);
router.get("/summary", getSummary);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;