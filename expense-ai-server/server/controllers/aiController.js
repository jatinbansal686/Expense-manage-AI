const { processUserText } = require("../services/aiService");
const { parseJSON } = require("../services/parserService");
const Transaction = require("../models/Transaction");
const { normalizeDate, normalizeAmount } = require("../utils/normalizeData");
const { getCategory } = require("../utils/categoryMapper");

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

    // Step 3: Handle Intent
    if (data.intent === "add") {
      let finalCategory = data.category;
      // if AI gives unknown → try mapping
      if (!finalCategory || finalCategory === "unknown") {
        finalCategory = getCategory(req.body.text);
      }
      const transaction = await Transaction.create({
        user: req.user._id,
        type: data.type || "expense",
        amount: normalizeAmount(data.amount),
        category: finalCategory,
        person: data.person || "",
        asset: data.asset || "",
        date: normalizeDate(data.date),
      });

      return res.json({
        message: "Transaction added successfully",
        data: transaction,
      });
    }

    if (data.intent === "query") {
      let filter = { user: req.user._id };

      // filter by type
      if (data.type) {
        filter.type = data.type;
      }

      // date range
      if (data.startDate && data.endDate) {
        filter.date = {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        };
      }

      let query = Transaction.find(filter);

      // sorting
      if (data.sort === "desc") {
        query = query.sort({ date: -1 });
      }

      // limit
      if (data.limit) {
        query = query.limit(data.limit);
      }

      const results = await query;

      // total calculation
      const total = results.reduce((sum, t) => sum + t.amount, 0);

      return res.json({
        message: "Here is your data",
        total,
        count: results.length,
        data: results,
      });
    }

    res.json({ message: "Unknown intent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
