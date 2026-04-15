import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Navbar from "./components/Navbar";
import ChatWidget from "./components/ChatWidget";
import Signup from "./pages/Signup";
import { TransactionProvider } from "./context/TransactionContext";
import Layout from "./components/Layout";

function App() {
  return (
    <TransactionProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/transactions"
            element={
              <Layout>
                <Transactions />
              </Layout>
            }
          />

          <Route
            path="/insights"
            element={
              <Layout>
                <Insights />
              </Layout>
            }
          />
          {/* <Route path="/" element={<Dashboard />} /> */}
          {/* <Route path="/signup" element={<Signup />} /> */}
          {/* <Route path="/transactions" element={<Transactions />} /> */}
          {/* <Route path="/insights" element={<Insights />} /> */}
          {/* <Route path="/login" element={<Login />} /> */}
        </Routes>

        {/* Global Chat */}
        <ChatWidget />
      </Router>
    </TransactionProvider>
  );
}

export default App;
