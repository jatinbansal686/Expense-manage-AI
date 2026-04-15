const { processUserText } = require("../services/aiService");
const { parseJSON } = require("../services/parserService");
const Transaction = require("../models/Transaction");
const { normalizeDate, normalizeAmount } = require("../utils/normalizeData");

// MAIN AI HANDLER
exports.handleAI = async (req, res) => {
  try {
    const { text } = req.body;

    // Step 1: AI Processing
    const aiRaw = await processUserText(text);

    // Step 2: Parse JSON
    const data = parseJSON(aiRaw);

    if (!data) {
      return res.status(400).json({ message: "AI parsing failed" });
    }

    console.log("AI DATE:", data.date);
    const finalDate = normalizeDate(data.date);
    console.log("NORMALIZED DATE:", finalDate);

    // Step 3: Handle Intent
    if (data.intent === "add") {
      const transaction = await Transaction.create({
        user: req.user._id,
        type: data.type || "expense",
        amount: normalizeAmount(data.amount),
        category: data.category || "unknown",
        person: data.person || "",
        date: normalizeDate(data.date),
      });

      return res.json({
        message: "Transaction added successfully",
        data: transaction,
      });
    }

    if (data.intent === "query") {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      const transactions = await Transaction.find({
        user: req.user._id,
        date: { $gte: start, $lte: end },
      });

      const total = transactions.reduce((sum, t) => sum + t.amount, 0);

      return res.json({
        message: "Here is your report",
        total,
        count: transactions.length,
        transactions,
      });
    }

    res.json({ message: "Unknown intent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
