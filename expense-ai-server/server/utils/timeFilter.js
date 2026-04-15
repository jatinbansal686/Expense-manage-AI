const getDateRange = (data) => {
  const now = new Date();

  if (data.timeRange === "month") {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: now,
    };
  }

  if (data.timeRange === "week") {
    const start = new Date();
    start.setDate(now.getDate() - 7);
    return { start, end: now };
  }

  if (data.timeRange === "year") {
    return {
      start: new Date(now.getFullYear(), 0, 1),
      end: now,
    };
  }

  if (data.lastDays) {
    const start = new Date();
    start.setDate(now.getDate() - data.lastDays);
    return { start, end: now };
  }

  return null;
};

module.exports = { getDateRange };
