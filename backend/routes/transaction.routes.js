const express = require('express');
const {getAllTransactions} = require("../controllers/transaction.controller");
const {getSummary} = require("../controllers/transaction.controller")
const {authenticate} = require("../middleware/auth");
const router = express.Router();


router.use(authenticate);
//Ruta protegida
router.get("/", getAllTransactions);
router.get("/summary", authenticate, getSummary);

module.exports = router;