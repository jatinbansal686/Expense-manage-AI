import { useEffect, useState } from "react";
import API from "../api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#f59e0b"];

const Insights = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/transactions");
    setData(res.data);
  };

  // 🔥 totals
  const income = data
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = data
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const investment = data
    .filter((t) => t.type === "investment")
    .reduce((a, b) => a + b.amount, 0);

  // 📊 BAR DATA
  const barData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
    { name: "Investment", value: investment },
  ];

  // 🥧 CATEGORY PIE
  const categoryMap = {};

  data.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += t.amount;
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  // 📈 MONTHLY TREND
  const monthlyMap = {};

  data.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyMap[month]) {
      monthlyMap[month] = 0;
    }

    monthlyMap[month] += t.amount;
  });

  const lineData = Object.keys(monthlyMap).map((key) => ({
    name: key,
    value: monthlyMap[key],
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">📊 Insights</h1>

      <div className="grid grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">Overview</h2>

          <BarChart width={300} height={250} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </div>

        {/* PIE CHART */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">Category Breakdown</h2>

          <PieChart width={300} height={250}>
            <Pie data={pieData} dataKey="value" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* LINE CHART */}
        <div className="bg-white p-4 rounded-2xl shadow col-span-2">
          <h2 className="font-semibold mb-2">Monthly Trend</h2>

          <LineChart width={600} height={250} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Insights;
