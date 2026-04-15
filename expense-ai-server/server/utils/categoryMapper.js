const categoryMap = {
  food: ["pizza", "burger", "swiggy", "zomato", "restaurant"],
  travel: ["petrol", "uber", "ola", "bus", "train"],
  shopping: ["amazon", "flipkart", "mall"],
  bills: ["electricity", "rent", "wifi"],
};

const getCategory = (text) => {
  const lowerText = text.toLowerCase();

  for (let category in categoryMap) {
    for (let keyword of categoryMap[category]) {
      if (lowerText.includes(keyword)) {
        return category;
      }
    }
  }

  return "unknown";
};

module.exports = { getCategory };
