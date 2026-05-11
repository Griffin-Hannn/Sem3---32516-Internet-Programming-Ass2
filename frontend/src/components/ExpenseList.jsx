export default function ExpenseList({ expenses, loading, onEdit, onDelete }) {
  if (loading) {
    return <p className="status-message">Loading...</p>;
  }

  if (expenses.length === 0) {
    return <p className="status-message">No expense items found.</p>;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
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

            {expense.description && <p className="description">{expense.description}</p>}
          </div>

          <div className="expense-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => onEdit(expense)}
              disabled={loading}
            >
              Edit
            </button>

            <button
              type="button"
              className="danger-button"
              onClick={() => onDelete(expense.id, expense.title)}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
