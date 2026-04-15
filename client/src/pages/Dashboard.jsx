import { useEffect, useState } from "react";
import API from "../api";

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await API.get("/transactions");
    setData(res.data);
  };

  // calculations
  const income = data
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = data
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const investment = data
    .filter((t) => t.type === "investment")
    .reduce((a, b) => a + b.amount, 0);

  const balance = income - expense - investment;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your finances smartly</p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Balance</p>
          <h2 className="text-2xl font-bold mt-2 text-gray-800">₹{balance}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Income</p>
          <h2 className="text-2xl font-bold mt-2 text-green-600">₹{income}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Expense</p>
          <h2 className="text-2xl font-bold mt-2 text-red-500">₹{expense}</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <p className="text-gray-500 text-sm">Investment</p>
          <h2 className="text-2xl font-bold mt-2 text-blue-500">
            ₹{investment}
          </h2>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow-md">
          ➕ Add Transaction
        </button>

        <button className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-2 rounded-lg shadow-md">
          🎤 Speak
        </button>
      </div>

      {/* TRANSACTIONS TABLE */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Transactions
        </h2>

        <table className="w-full text-base">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-3 text-left">Date</th>
              <th className="text-left">Type</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Category</th>
              <th className="text-left">Person</th>
            </tr>
          </thead>

          <tbody>
            {data.slice(0, 6).map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-4">
                  {new Date(t.date).toLocaleDateString()}
                </td>

                <td className="capitalize">{t.type}</td>

                <td className="font-semibold text-gray-800">₹{t.amount}</td>

                <td className="text-gray-600">{t.category}</td>

                <td className="text-gray-600">{t.person}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
