import { useMemo } from "react";

export default function ExpenseForm({
  formData,
  editingId,
  loading,
  errorMessage,
  categories,
  onInputChange,
  onSubmit,
  onCancel,
}) {
  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }, [categories]);

  return (
    <section className="card">
      <h2>{editingId ? "Edit Expense" : "Add Expense"}</h2>

      <form className="expense-form" onSubmit={onSubmit}>
        <div className="form-row">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="e.g. Lunch, Train ticket"
          />
        </div>

        <div className="form-row">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="category_id"
            value={formData.category_id}
            onChange={onInputChange}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={onInputChange}
            placeholder="e.g. 12.50"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-row">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={onInputChange}
          />
        </div>

        <div className="form-row">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Optional note"
            rows="3"
          />
        </div>

        {categories.length === 0 && (
          <p className="error-message">Create at least one category before adding an expense.</p>
        )}

        <div className="button-row">
          <button type="submit" disabled={loading || categories.length === 0}>
            {editingId ? "Save Changes" : "Add Expense"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </section>
  );
}
