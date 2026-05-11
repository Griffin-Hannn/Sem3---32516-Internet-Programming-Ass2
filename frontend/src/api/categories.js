import { apiRequest } from "./client";

export async function getCategories() {
  return apiRequest("/categories", { withAuth: true });
}

export async function createCategory(categoryData) {
  return apiRequest("/categories", {
    method: "POST",
    withAuth: true,
    isJson: true,
    body: JSON.stringify(categoryData),
  });
}

export async function updateCategory(categoryId, categoryData) {
  return apiRequest(`/categories/${categoryId}`, {
    method: "PUT",
    withAuth: true,
    isJson: true,
    body: JSON.stringify(categoryData),
  });
}

export async function deleteCategory(categoryId) {
  await apiRequest(`/categories/${categoryId}`, {
    method: "DELETE",
    withAuth: true,
  });
  return true;
}
