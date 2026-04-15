const TransactionTable = ({ data }) => {
  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-200">
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Person</th>
          <th>Asset</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;