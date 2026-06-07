import React, { useEffect, useState } from "react";
import { getDashboard } from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { CATEGORY_ICONS, formatCurrency, formatDate } from "../utils/constants";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PIE_COLORS = [
  "#2d6a4f", "#40916c", "#52b788", "#74c99e",
  "#457b9d", "#1d3557", "#e63946", "#f4a261", "#9b5de5", "#adb5bd"
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 13,
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-md)"
      }}>
        <p style={{ fontWeight: 600, marginBottom: 2 }}>{label}</p>
        <p style={{ color: "var(--accent)" }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="stat-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ height: 40, width: 40, borderRadius: 10, marginBottom: 14 }} />
              <div className="skeleton" style={{ height: 12, width: 80, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 28, width: 120 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return <div className="page-wrapper"><p>Failed to load dashboard.</p></div>;

  const { summary, byCategory, monthlyTrend, recentTransactions } = data;

  const trendData = monthlyTrend.map((m) => ({
    name: MONTH_NAMES[m._id.month - 1],
    total: m.total,
  }));

  const pieData = byCategory.map((c) => ({
    name: c._id,
    value: c.total,
  }));

  return (
    <div className="page-wrapper">
      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--accent-light)" }}>💰</div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{formatCurrency(summary.totalExpenses)}</div>
          <div className="stat-sub">{summary.totalCount} transactions</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--warning-light)" }}>📅</div>
          <div className="stat-label">This Month</div>
          <div className="stat-value">{formatCurrency(summary.monthlyExpenses)}</div>
          <div className="stat-sub">
            {summary.monthChange !== null ? (
              <span className={parseFloat(summary.monthChange) > 0 ? "stat-change-up" : "stat-change-down"}>
                {parseFloat(summary.monthChange) > 0 ? "▲" : "▼"} {Math.abs(summary.monthChange)}% vs last month
              </span>
            ) : (
              `${summary.monthlyCount} transactions`
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--info-light)" }}>📆</div>
          <div className="stat-label">Last Month</div>
          <div className="stat-value">{formatCurrency(summary.lastMonthExpenses)}</div>
          <div className="stat-sub">Previous period</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {trendData.length > 0 && (
          <div className="chart-card">
            <h3>Monthly Trend</h3>
            <p>Last 6 months spending</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trendData} barSize={28}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-hover)" }} />
                <Bar dataKey="total" fill="var(--accent)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {pieData.length > 0 && (
          <div className="chart-card">
            <h3>By Category</h3>
            <p>Spending breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Legend
                  formatter={(v) => <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{v}</span>}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <div>
          <div className="section-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Your latest 5 expenses</p>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{e.title}</div>
                      {e.description && (
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          {e.description.slice(0, 40)}{e.description.length > 40 ? "..." : ""}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: 13 }}>
                        {CATEGORY_ICONS[e.category]} {e.category}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{formatDate(e.date)}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className="amount-text amount-positive">{formatCurrency(e.amount)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {recentTransactions.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">💸</div>
          <h3>No expenses yet</h3>
          <p>Start tracking your spending by adding your first expense.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
