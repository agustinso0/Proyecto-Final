const express = require('express');
const {getAllTransactions, createTransaction} = require("../controllers/transaction.controller");
const {getSummary} = require("../controllers/transaction.controller")
const router = express.Router();

// Rutas sin autenticación para desarrollo
router.get("/", getAllTransactions);
router.get("/summary", getSummary);
router.post("/", createTransaction);

module.exports = router;