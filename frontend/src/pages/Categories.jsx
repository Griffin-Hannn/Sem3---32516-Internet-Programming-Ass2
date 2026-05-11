import { useEffect, useState } from "react";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categories";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAllCategories = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setErrorMessage(error.message || "Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!newName.trim()) {
      setErrorMessage("Category name is required");
      return;
    }

    setLoading(true);
    try {
      await createCategory({
        id: crypto.randomUUID(),
        name: newName.trim(),
      });
      setNewName("");
      await fetchAllCategories();
      window.dispatchEvent(new Event("categories-updated"));
    } catch (error) {
      setErrorMessage(error.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setErrorMessage("");
  };

  const handleSaveEdit = async (categoryId) => {
    setErrorMessage("");

    if (!editingName.trim()) {
      setErrorMessage("Category name is required");
      return;
    }

    setLoading(true);
    try {
      await updateCategory(categoryId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
      await fetchAllCategories();
      window.dispatchEvent(new Event("categories-updated"));
    } catch (error) {
      setErrorMessage(error.message || "Error updating category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete category "${category.name}"?`
    );
    if (!confirmed) return;

    setLoading(true);
    setErrorMessage("");

    try {
      await deleteCategory(category.id);
      if (editingId === category.id) {
        setEditingId(null);
        setEditingName("");
      }
      await fetchAllCategories();
      window.dispatchEvent(new Event("categories-updated"));
    } catch (error) {
      setErrorMessage(error.message || "Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="card">
        <h2>Add Category</h2>

        <form className="expense-form" onSubmit={handleCreate}>
          <div className="form-row">
            <label htmlFor="category-name">Category Name</label>
            <input
              id="category-name"
              type="text"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="e.g. Food"
            />
          </div>

          <div className="button-row">
            <button type="submit" disabled={loading}>Add Category</button>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </section>

      <section className="card">
        <h2>Categories</h2>

        {loading && <p className="status-message">Loading...</p>}

        {!loading && categories.length === 0 && (
          <p className="status-message">No categories found.</p>
        )}

        {!loading && categories.length > 0 && (
          <div className="expense-list">
            {categories.map((category) => (
              <div key={category.id} className="expense-item">
                <div className="expense-main">
                  {editingId === category.id ? (
                    <div className="form-row">
                      <label htmlFor={`edit-${category.id}`}>Category Name</label>
                      <input
                        id={`edit-${category.id}`}
                        type="text"
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                      />
                    </div>
                  ) : (
                    <h3>{category.name}</h3>
                  )}
                </div>

                <div className="expense-actions">
                  {editingId === category.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(category.id)}
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingName("");
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => handleStartEdit(category)}
                      disabled={loading}
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(category)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
