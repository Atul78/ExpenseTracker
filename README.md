# Spendly — Expense Tracker

A full-stack expense tracking web application built with the MERN stack. Track your daily spending, categorize expenses, and visualize monthly trends through a clean dashboard.

---

## Features

- **Add / Edit / Delete Expenses** — Full CRUD with form validation
- **Search Expenses** — Real-time debounced search across title and description
- **Filter by Category** — Filter by 10 predefined categories
- **Date Range Filter** — Narrow down expenses between any two dates
- **Paginated Expense History** — 10 per page with smart pagination
- **Dashboard** — Total expenses, monthly expenses, last month comparison, category breakdown pie chart, and 6-month bar chart trend
- **Dark Mode** — Toggle with localStorage persistence
- **Responsive UI** — Works on mobile, tablet, and desktop
- **Toast Notifications** — Feedback for every action

---

## Tech Stack

| Layer    | Tech                                     |
| -------- | ---------------------------------------- |
| Frontend | React 18, React Router v6, Recharts      |
| Backend  | Node.js, Express.js                      |
| Database | MongoDB + Mongoose                       |
| Styling  | Plain CSS with CSS variables (no UI lib) |
| HTTP     | Axios                                    |

---

## Project Structure

```
expense-tracker/
├── backend/
│   ├── controllers/
│   │   ├── expenseController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   └── Expense.js
│   ├── routes/
│   │   ├── expenseRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── ExpenseForm.jsx
    │   │   └── DeleteModal.jsx
    │   ├── context/
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Expenses.jsx
    │   │   └── AddExpense.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── constants.js
    │   ├── App.jsx
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas URI

---

### Backend Setup

```bash
cd backend
npm install
cp .env
npm run dev
```

Backend runs on **http://localhost:5000**

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

The `"proxy": "http://localhost:5000"` in `package.json` routes API calls automatically — no CORS setup needed in dev.

---

## API Endpoints

### Expenses

| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| GET    | /api/expenses     | List expenses (search, filter, page) |
| GET    | /api/expenses/:id | Get single expense                   |
| POST   | /api/expenses     | Create expense                       |
| PUT    | /api/expenses/:id | Update expense                       |
| DELETE | /api/expenses/:id | Delete expense                       |

**Query params for GET /api/expenses:**

- `search` — text search on title/description
- `category` — filter by category name
- `startDate`, `endDate` — date range (ISO format)
- `page`, `limit` — pagination (default: page=1, limit=10)
- `sort` — sort field (default: `-date`)

### Dashboard

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | /api/dashboard | Aggregated stats & charts |

---

## Expense Categories

Food & Dining, Transportation, Shopping, Entertainment, Healthcare, Utilities, Education, Travel, Housing, Other

## Payment Methods

Cash, Credit Card, Debit Card, UPI, Net Banking, Other

---

## Environment Variables

**backend/.env**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/expense-tracker
```

---

## Assumptions

- Single-user app — no authentication implemented (can be added later with JWT)
- Currency defaults to INR (₹) — change `formatCurrency` in `constants.js` to switch
- MongoDB must be running locally unless Atlas URI is provided
- Dark mode preference is saved in `localStorage`
