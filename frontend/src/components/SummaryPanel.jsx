export default function SummaryPanel({ expenses }) {
  const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const totalsByCategory = {};
  expenses.forEach((expense) => {
    const key = expense.category || "Uncategorized";
    totalsByCategory[key] = (totalsByCategory[key] || 0) + Number(expense.amount);
  });

  const monthlyTrend = {};
  expenses.forEach((expense) => {
    const monthKey = String(expense.date || "").slice(0, 7);
    if (!monthKey) return;
    monthlyTrend[monthKey] = (monthlyTrend[monthKey] || 0) + Number(expense.amount);
  });

  return (
    <section className="card">
      <h2>Summary</h2>
      <p className="summary-total">
        Total Spending: <strong>${totalAmount.toFixed(2)}</strong>
      </p>

      <div className="summary-grid summary-two-col">
        <div>
          <h3>By Category</h3>
          {Object.keys(totalsByCategory).length === 0 ? (
            <p className="subtle-text">No category data yet.</p>
          ) : (
            <ul className="summary-list">
              {Object.entries(totalsByCategory).map(([category, total]) => (
                <li key={category}>
                  <span>{category}</span>
                  <strong>${total.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3>Monthly Trend</h3>
          {Object.keys(monthlyTrend).length === 0 ? (
            <p className="subtle-text">No monthly data yet.</p>
          ) : (
            <ul className="summary-list">
              {Object.entries(monthlyTrend).map(([month, total]) => (
                <li key={month}>
                  <span>{month}</span>
                  <strong>${total.toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
