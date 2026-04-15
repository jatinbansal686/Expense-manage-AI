const express = require("express");
const router = express.Router();

const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

// GET
router.get("/", authMiddleware, getTransactions);

// POST
router.post("/", authMiddleware, addTransaction);

// PUT (UPDATE)
router.put("/:id", authMiddleware, updateTransaction);

// DELETE
router.delete("/:id", authMiddleware, deleteTransaction);

module.exports = router;
