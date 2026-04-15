const normalizeDate = (dateStr) => {
  const now = new Date();

  if (!dateStr || dateStr === "today") {
    console.log("today");

    return new Date(); // fresh date
  }

  if (dateStr === "yesterday" || dateStr === "kal") {
    console.log("yesterday");
    const d = new Date(); // NEW object
    d.setDate(d.getDate() - 1);
    console.log(d);

    return d;
  }

  if (dateStr === "parso") {
    console.log("day before yesterday");
    const d = new Date(); // NEW object
    d.setDate(d.getDate() - 2);
    return d;
  }

  return new Date(dateStr);
};

const normalizeAmount = (amount) => {
  if (typeof amount === "number") return amount;

  const parsed = parseInt(amount);
  return isNaN(parsed) ? 0 : parsed;
};

module.exports = {
  normalizeDate,
  normalizeAmount,
};
