import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createExpense } from "../utils/api";
import { CATEGORIES, PAYMENT_METHODS } from "../utils/constants";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  paymentMethod: "Cash",
};

const validate = (form) => {
  const errors = {};
  if (!form.title.trim()) errors.title = "Title is required";
  else if (form.title.length > 100) errors.title = "Max 100 characters";
  if (!form.amount) errors.amount = "Amount is required";
  else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) errors.amount = "Enter a valid positive amount";
  if (!form.category) errors.category = "Please select a category";
  if (!form.date) errors.date = "Date is required";
  return errors;
};

const AddExpense = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      await createExpense({ ...form, amount: parseFloat(form.amount) });
      toast.success("Expense added successfully!");
      navigate("/expenses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ maxWidth: 680 }}>
      <div className="mb-6">
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>
          Add Expense
        </h1>
        <p className="text-muted text-sm" style={{ marginTop: 4 }}>
          Log a new expense to keep your budget in check.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Dinner at Restaurant"
                className={`form-input ${errors.title ? "error" : ""}`}
                maxLength={100}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className={`form-input ${errors.amount ? "error" : ""}`}
                />
                {errors.amount && <span className="form-error">{errors.amount}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`form-input ${errors.date ? "error" : ""}`}
                />
                {errors.date && <span className="form-error">{errors.date}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`form-select ${errors.category ? "error" : ""}`}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <span className="form-error">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className="form-select"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Any additional notes..."
                className="form-textarea"
                maxLength={500}
                rows={3}
              />
            </div>

            <hr className="divider" />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/expenses")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Add Expense"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
