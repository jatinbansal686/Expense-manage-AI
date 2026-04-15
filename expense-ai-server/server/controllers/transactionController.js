const Transaction = require("../models/Transaction");

// ADD TRANSACTION
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category, person, note, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category: category || "unknown",
      person: person || "",
      note: note || "",
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      date: -1,
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
