import { useEffect, useMemo, useReducer } from "react";

import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import SearchBar from "../components/SearchBar";
import SummaryPanel from "../components/SummaryPanel";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../api/expenses";
import { getCategories } from "../api/categories";

const initialFormData = {
  id: "",
  title: "",
  category: "",
  category_id: "",
  amount: "",
  date: "",
  description: "",
};

const initialState = {
  expenses: [],
  categories: [],
  filterCategoryId: "",
  searchText: "",
  editingId: null,
  formData: initialFormData,
  loading: false,
  errorMessage: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, errorMessage: action.payload };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_FILTER_CATEGORY_ID":
      return { ...state, filterCategoryId: action.payload };
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload };
    case "SET_EDITING_ID":
      return { ...state, editingId: action.payload };
    case "SET_FORM_DATA":
      return { ...state, formData: action.payload };
    case "UPDATE_FORM_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };
    case "RESET_FORM":
      return {
        ...state,
        formData: initialFormData,
        editingId: null,
        errorMessage: "",
      };
    default:
      return state;
  }
}

export default function ExpensesPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      dispatch({ type: "SET_CATEGORIES", payload: data });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Error loading categories" });
    }
  };

  const fetchAllExpenses = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: "" });

    try {
      const data = await getExpenses();
      dispatch({ type: "SET_EXPENSES", payload: data });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Error loading expenses" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAllExpenses();

    const handleCategoriesUpdated = () => {
      fetchCategories();
      fetchAllExpenses();
    };

    window.addEventListener("categories-updated", handleCategoriesUpdated);
    return () => {
      window.removeEventListener("categories-updated", handleCategoriesUpdated);
    };
  }, []);

  const categoryById = useMemo(() => {
    const map = new Map();
    state.categories.forEach((category) => map.set(category.id, category));
    return map;
  }, [state.categories]);

  const filteredExpenses = useMemo(() => {
    const search = state.searchText.trim().toLowerCase();

    return state.expenses.filter((expense) => {
      const matchesCategoryFilter =
        !state.filterCategoryId || expense.category_id === state.filterCategoryId;

      const haystack = [
        expense.title,
        expense.description || "",
        expense.category || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || haystack.includes(search);
      return matchesCategoryFilter && matchesSearch;
    });
  }, [state.expenses, state.searchText, state.filterCategoryId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "category_id") {
      const selectedCategory = categoryById.get(value);
      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          ...state.formData,
          category_id: value,
          category: selectedCategory?.name || "",
        },
      });
      return;
    }

    dispatch({ type: "UPDATE_FORM_FIELD", payload: { name, value } });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "SET_ERROR", payload: "" });

    if (!state.formData.title.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Title is required" });
      return;
    }

    if (!state.formData.amount || Number(state.formData.amount) <= 0) {
      dispatch({ type: "SET_ERROR", payload: "Amount must be greater than 0" });
      return;
    }

    if (!state.formData.date) {
      dispatch({ type: "SET_ERROR", payload: "Date is required" });
      return;
    }

    if (!state.formData.category.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Category is required" });
      return;
    }

    const payload = {
      ...state.formData,
      amount: Number(state.formData.amount),
    };

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      if (state.editingId) {
        await updateExpense(state.editingId, payload);
      } else {
        await createExpense({ ...payload, id: new Date().toISOString() });
      }

      await fetchAllExpenses();
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message || "Error saving expense" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleEdit = (expense) => {
    dispatch({ type: "SET_EDITING_ID", payload: expense.id });
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        id: expense.id,
        title: expense.title,
        category: expense.category,
        category_id: expense.category_id || "",
        amount: String(expense.amount),
        date: expense.date,
        description: expense.description || "",
      },
    });
    dispatch({ type: "SET_ERROR", payload: "" });
  };

  const handleDelete = async (expenseId, title) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: "" });

    try {
      await deleteExpense(expenseId);
      await fetchAllExpenses();

      if (state.editingId === expenseId) {
        dispatch({ type: "RESET_FORM" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message || "Error deleting expense" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleCancelEdit = () => {
    dispatch({ type: "RESET_FORM" });
  };

  return (
    <>
      <ExpenseForm
        formData={state.formData}
        editingId={state.editingId}
        loading={state.loading}
        errorMessage={state.errorMessage}
        categories={state.categories}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />

      <section className="card">
        <div className="filter-row">
          <div>
            <h2>Expenses</h2>
            <p className="subtle-text">Showing latest expenses first.</p>
          </div>

          <div className="filters-inline">
            <SearchBar
              value={state.searchText}
              onChange={(value) => dispatch({ type: "SET_SEARCH_TEXT", payload: value })}
            />

            <div className="filter-control">
              <label htmlFor="category-filter">Filter by Category</label>
              <select
                id="category-filter"
                value={state.filterCategoryId}
                onChange={(event) =>
                  dispatch({ type: "SET_FILTER_CATEGORY_ID", payload: event.target.value })
                }
              >
                <option value="">All</option>
                {state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          loading={state.loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      <SummaryPanel expenses={filteredExpenses} />
    </>
  );
}
