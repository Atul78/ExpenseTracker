import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Expenses
export const getExpenses = (params) => api.get("/expenses", { params });
export const getExpenseById = (id) => api.get(`/expenses/${id}`);
export const createExpense = (data) => api.post("/expenses", data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Dashboard
export const getDashboard = () => api.get("/dashboard");

export default api;
