const Expense = require("../models/Expense");

// GET /api/dashboard
const getDashboardData = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Total expenses (all time)
    const totalResult = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    // This month
    const monthResult = await Expense.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    // Last month
    const lastMonthResult = await Expense.aggregate([
      { $match: { date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // By category (all time)
    const byCategory = await Expense.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);

    // Last 6 months trend
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyTrend = await Expense.aggregate([
      { $match: { date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Recent transactions
    const recentTransactions = await Expense.find().sort({ date: -1 }).limit(5);

    const totalAmount = totalResult[0]?.total || 0;
    const monthAmount = monthResult[0]?.total || 0;
    const lastMonthAmount = lastMonthResult[0]?.total || 0;
    const monthChange =
      lastMonthAmount > 0 ? (((monthAmount - lastMonthAmount) / lastMonthAmount) * 100).toFixed(1) : null;

    res.json({
      summary: {
        totalExpenses: totalAmount,
        totalCount: totalResult[0]?.count || 0,
        monthlyExpenses: monthAmount,
        monthlyCount: monthResult[0]?.count || 0,
        lastMonthExpenses: lastMonthAmount,
        monthChange: monthChange,
      },
      byCategory,
      monthlyTrend,
      recentTransactions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardData };
