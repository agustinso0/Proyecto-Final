const express = require('express');
const {getAllTransactions} = require("../controllers/transaction.controller");
const {authenticate} = require("../middleware/auth");
const router = express.Router();


router.use(authenticate);
//Ruta protegida
router.get("/", getAllTransactions);

module.exports = router;