const express = require("express");

const transactionController = require("../controllers/transactionController");

const router = express.Router();

router
  .route("/transaction")
  .get(transactionController.getAllTransactions)
  .post(transactionController.addTransaction);

module.exports = router;
