import React, { useCallback, useEffect, useRef, useState } from "react";
import { getExpenses } from "../utils/api";
import { CATEGORIES, CATEGORY_BADGE_CLASS, CATEGORY_ICONS, formatCurrency, formatDate } from "../utils/constants";
import ExpenseForm from "../components/ExpenseForm";
import DeleteModal from "../components/DeleteModal";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const searchTimeout = useRef(null);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, search, category, startDate, endDate };
      const res = await getExpenses(params);
      setExpenses(res.data.expenses);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, startDate, endDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 400);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setStartDate("");
    setEndDate("");
    setPage(1);
    document.getElementById("search-input").value = "";
  };

  const openEdit = (exp) => {
    setEditExpense(exp);
    setShowForm(true);
  };

  const openAdd = () => {
    setEditExpense(null);
    setShowForm(true);
  };

  const hasFilters = search || category !== "All" || startDate || endDate;

  return (
    <div className="page-wrapper">
      <div className="section-header mb-6">
        <div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700 }}>All Expenses</h2>
          <p className="text-muted text-sm" style={{ marginTop: 3 }}>
            {pagination.total} total record{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          ＋ Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card card-sm mb-4" style={{ padding: "14px 16px" }}>
        <div className="filters-row">
          <div className="search-bar" style={{ flex: 2 }}>
            <span className="search-icon">🔍</span>
            <input
              id="search-input"
              placeholder="Search expenses..."
              onChange={handleSearchChange}
              defaultValue={search}
            />
          </div>

          <select value={category} onChange={handleCategoryChange} className="form-select" style={{ width: 180 }}>
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            className="form-input"
            style={{ width: 150 }}
            placeholder="From"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            className="form-input"
            style={{ width: 150 }}
            placeholder="To"
          />

          {hasFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Category</th><th>Date</th><th>Method</th><th style={{ textAlign: "right" }}>Amount</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>{hasFilters ? "No results found" : "No expenses yet"}</h3>
          <p>
            {hasFilters
              ? "Try adjusting your filters or search query."
              : "Add your first expense to start tracking."}
          </p>
          {!hasFilters && (
            <button className="btn btn-primary" onClick={openAdd}>
              ＋ Add Expense
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{exp.title}</div>
                      {exp.description && (
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          {exp.description.slice(0, 45)}{exp.description.length > 45 ? "..." : ""}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${CATEGORY_BADGE_CLASS[exp.category] || "badge-other"}`}>
                        {CATEGORY_ICONS[exp.category]} {exp.category}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{formatDate(exp.date)}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{exp.paymentMethod}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className="amount-text amount-positive">{formatCurrency(exp.amount)}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => openEdit(exp)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteTarget(exp)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                ‹
              </button>
              {[...Array(pagination.pages)].map((_, i) => {
                const p = i + 1;
                if (p === 1 || p === pagination.pages || Math.abs(p - page) <= 1) {
                  return (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? "active" : ""}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                }
                if (Math.abs(p - page) === 2) return <span key={p} style={{ color: "var(--text-muted)" }}>…</span>;
                return null;
              })}
              <button
                className="page-btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.pages}
              >
                ›
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showForm && (
        <ExpenseForm
          expense={editExpense}
          onClose={() => { setShowForm(false); setEditExpense(null); }}
          onSaved={fetchExpenses}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          expense={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={fetchExpenses}
        />
      )}
    </div>
  );
};

export default Expenses;
