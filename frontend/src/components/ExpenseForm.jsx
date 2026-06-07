import React, { useEffect, useState } from "react";
import { createExpense, updateExpense } from "../utils/api";
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
  else if (isNaN(form.amount) || parseFloat(form.amount) <= 0) errors.amount = "Enter a valid amount";
  if (!form.category) errors.category = "Please select a category";
  if (!form.date) errors.date = "Date is required";
  return errors;
};

const ExpenseForm = ({ expense, onClose, onSaved }) => {
  const isEdit = Boolean(expense);
  const [form, setForm] = useState(
    isEdit
      ? {
          ...expense,
          amount: expense.amount.toString(),
          date: expense.date?.split("T")[0] || new Date().toISOString().split("T")[0],
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      setLoading(true);
      const payload = { ...form, amount: parseFloat(form.amount) };
      if (isEdit) {
        await updateExpense(expense._id, payload);
        toast.success("Expense updated!");
      } else {
        await createExpense(payload);
        toast.success("Expense added!");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Expense" : "Add Expense"}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Coffee at Starbucks"
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
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="form-select">
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
              placeholder="Optional note..."
              className="form-textarea"
              maxLength={500}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Expense" : "Add Expense"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
