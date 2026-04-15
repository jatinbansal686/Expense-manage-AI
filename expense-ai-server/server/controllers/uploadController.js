const csv = require("csv-parser");
const { Readable } = require("stream");
const Transaction = require("../models/Transaction");

const uploadStatement = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const transactions = [];

    // 🟢 CSV parsing (simple version)
    const stream = Readable.from(file.buffer.toString());

    stream
      .pipe(csv())
      .on("data", (row) => {
        transactions.push(row);
      })
      .on("end", async () => {
        // 🔥 Convert via AI (optional upgrade)
        const formatted = transactions.map((t) => ({
          user: req.user._id,
          type: t.amount > 0 ? "income" : "expense",
          amount: Math.abs(t.amount),
          category: "unknown",
          note: t.description || "",
          date: new Date(t.date),
        }));

        await Transaction.insertMany(formatted);

        res.json({
          message: "Statement uploaded successfully",
          count: formatted.length,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadStatement };
