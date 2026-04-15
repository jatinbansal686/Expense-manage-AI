import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-8">💰 FinanceAI</h1>

      <nav className="space-y-4">
        <Link to="/" className="block hover:bg-gray-700 p-2 rounded">
          Dashboard
        </Link>

        <Link
          to="/transactions"
          className="block hover:bg-gray-700 p-2 rounded"
        >
          Transactions
        </Link>

        <Link to="/insights" className="block hover:bg-gray-700 p-2 rounded">
          Insights
        </Link>
      </nav>

      <div className="mt-auto text-sm text-gray-400">© 2026 FinanceAI</div>
    </div>
  );
};

export default Sidebar;
