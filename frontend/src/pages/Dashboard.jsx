import { useEffect, useMemo, useState } from "react";

import { getCategories } from "../api/categories";
import { getExpenses } from "../api/expenses";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [expenseData, categoryData] = await Promise.all([
        getExpenses(),
        getCategories(),
      ]);

      setExpenses(expenseData);
      setCategories(categoryData);
    } catch (error) {
      setErrorMessage(error.message || "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalSpending = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [expenses]);

  const spendingByCategory = useMemo(() => {
    const totals = {};

    expenses.forEach((expense) => {
      const key = expense.category || "Uncategorized";
      totals[key] = (totals[key] || 0) + Number(expense.amount);
    });

    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  }, [expenses]);

  return (
    <>
      <section className="card">
        <h2>Dashboard</h2>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading && <p className="status-message">Loading dashboard...</p>}

        {!loading && !errorMessage && (
          <div className="summary-grid summary-two-col">
            <div className="summary-item">
              <p>Total Spending</p>
              <p className="summary-value">${totalSpending.toFixed(2)}</p>
            </div>
            <div className="summary-item">
              <p>Total Categories</p>
              <p className="summary-value">{categories.length}</p>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Spending By Category</h2>
        {loading && <p className="status-message">Loading...</p>}
        {!loading && spendingByCategory.length === 0 && (
          <p className="status-message">No expenses yet.</p>
        )}
        {!loading && spendingByCategory.length > 0 && (
          <ul className="summary-list">
            {spendingByCategory.map(([category, total]) => (
              <li key={category}>
                <span>{category}</span>
                <strong>${total.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Recent Expenses</h2>
        {loading && <p className="status-message">Loading...</p>}
        {!loading && recentExpenses.length === 0 && (
          <p className="status-message">No recent expenses.</p>
        )}
        {!loading && recentExpenses.length > 0 && (
          <div className="expense-list">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-main">
                  <div className="expense-top-line">
                    <h3>{expense.title}</h3>
                    <span className="amount">${Number(expense.amount).toFixed(2)}</span>
                  </div>
                  <div className="expense-meta">
                    <span className="badge">{expense.category}</span>
                    <span>{expense.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
