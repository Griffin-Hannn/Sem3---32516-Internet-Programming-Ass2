import { apiRequest } from "./client";

export async function getExpenses(category = "") {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return apiRequest(`/expenses${query}`, { withAuth: true });
}

export async function createExpense(expenseData) {
  return apiRequest("/expenses", {
    method: "POST",
    withAuth: true,
    isJson: true,
    body: JSON.stringify(expenseData),
  });
}

export async function updateExpense(expenseId, expenseData) {
  return apiRequest(`/expenses/${expenseId}`, {
    method: "PUT",
    withAuth: true,
    isJson: true,
    body: JSON.stringify(expenseData),
  });
}

export async function deleteExpense(expenseId) {
  await apiRequest(`/expenses/${expenseId}`, {
    method: "DELETE",
    withAuth: true,
  });
  return true;
}
