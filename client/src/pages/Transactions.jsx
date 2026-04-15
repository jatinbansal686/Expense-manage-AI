import { useEffect, useState } from "react";
import API from "../api";

const Transactions = () => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    person: "",
    asset: "",
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get("/transactions");
    setData(res.data);
  };

  // 🟢 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/transactions/${editId}`, form);
      } else {
        await API.post("/transactions", form);
      }

      setForm({
        type: "expense",
        amount: "",
        category: "",
        person: "",
        asset: "",
      });

      setEditId(null);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏ EDIT
  const handleEdit = (t) => {
    setForm(t);
    setEditId(t._id);
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Transactions</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="investment">Investment</option>
        </select>

        <input
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="border p-1"
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-1"
        />

        <input
          name="person"
          placeholder="Person"
          value={form.person}
          onChange={handleChange}
          className="border p-1"
        />

        <input
          name="asset"
          placeholder="Asset"
          value={form.asset}
          onChange={handleChange}
          className="border p-1"
        />

        <button className="bg-green-500 text-white px-3 py-1">
          {editId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      <table className="w-full border mt-6">
        <thead className="bg-gray-200">
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Person</th>
            <th>Asset</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => (
            <tr key={t._id} className="text-center border-t">
              <td>{new Date(t.date).toLocaleDateString()}</td>
              <td>{t.type}</td>
              <td>₹{t.amount}</td>
              <td>{t.category}</td>
              <td>{t.person}</td>
              <td>{t.asset}</td>

              <td className="space-x-2">
                <button
                  onClick={() => handleEdit(t)}
                  className="bg-blue-500 text-white px-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="bg-red-500 text-white px-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
