const { processUserText } = require("../services/aiService");
const { parseJSON } = require("../services/parserService");
const Transaction = require("../models/Transaction");
const { normalizeDate, normalizeAmount } = require("../utils/normalizeData");
const { getCategory } = require("../utils/categoryMapper");
const { getDateRange } = require("../utils/timeFilter");

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

      // type filter
      if (data.type) {
        filter.type = data.type;
      }

      // time filter
      const range = getDateRange(data);

      if (range) {
        filter.date = {
          $gte: range.start,
          $lte: range.end,
        };
      }

      // custom range
      if (data.startDate && data.endDate) {
        filter.date = {
          $gte: new Date(data.startDate),
          $lte: new Date(data.endDate),
        };
      }

      let query = Transaction.find(filter);

      // sorting
      query = query.sort({ date: -1 });

      if (data.limit) {
        query = query.limit(data.limit);
      }

      const results = await query;

      const total = results.reduce((sum, t) => sum + t.amount, 0);

      // 🔥 smart message
      let message = "";

      if (data.timeRange === "month") {
        message = `Is mahine ka total ₹${total}`;
      } else if (data.lastDays) {
        message = `Last ${data.lastDays} din ka total ₹${total}`;
      } else if (data.type === "investment") {
        message = `Aapki ${results.length} investments mili. Total ₹${total}`;
      } else {
        message = `Total ₹${total}`;
      }

      return res.json({
        message,
        total,
        count: results.length,
        data: results,
      });
    }

    if (data.intent === "balance") {
      const transactions = await Transaction.find({ user: req.user._id });

      let income = 0;
      let expense = 0;
      let investment = 0;

      transactions.forEach((t) => {
        if (t.type === "income") income += t.amount;
        if (t.type === "expense") expense += t.amount;
        if (t.type === "investment") investment += t.amount;
      });

      const balance = income - expense - investment;

      // 🔥 smart response
      const message = `
Aapka total income ₹${income} hai,
expense ₹${expense} hai,
investment ₹${investment} hai.

Aapka current balance ₹${balance} hai.
`;

      return res.json({
        message,
        income,
        expense,
        investment,
        balance,
      });
    }

    res.json({ message: "Unknown intent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
