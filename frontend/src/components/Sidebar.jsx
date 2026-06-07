import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { path: "/", icon: "📊", label: "Dashboard" },
  { path: "/expenses", icon: "💸", label: "Expenses" },
  { path: "/add", icon: "➕", label: "Add Expense" },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo-mark">
            <div className="logo-icon">💰</div>
            <span className="logo-text">Spendly</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="toggle-wrap">
            <span>{theme === "dark" ? "🌙" : "☀️"}</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className="toggle-slider" />
            </label>
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
