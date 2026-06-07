import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import AddExpense from "./pages/AddExpense";

const PAGE_TITLES = {
  "/": { title: "Dashboard", sub: "Overview of your spending" },
  "/expenses": { title: "Expenses", sub: "View and manage all transactions" },
  "/add": { title: "Add Expense", sub: "Log a new expense" },
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = PAGE_TITLES[location.pathname] || { title: "Spendly", sub: "" };
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <div className="mobile-topbar">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            Spendly
          </span>
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="topbar">
          <div className="topbar-left">
            <h1>{meta.title}</h1>
            {meta.sub && <p>{meta.sub}</p>}
          </div>
          <div className="topbar-actions">
            <button
              className="btn btn-ghost btn-icon"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/add" element={<AddExpense />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Layout />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 14,
            boxShadow: "var(--shadow-md)",
          },
          success: { iconTheme: { primary: "#2d6a4f", secondary: "#fff" } },
          error: { iconTheme: { primary: "#e63946", secondary: "#fff" } },
        }}
      />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
