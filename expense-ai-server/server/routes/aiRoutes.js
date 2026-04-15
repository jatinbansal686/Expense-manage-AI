const express = require("express");
const router = express.Router();

const { handleAI } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

router.post("/process", protect, handleAI);

module.exports = router;
