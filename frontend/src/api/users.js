import { apiRequest } from "./client";

export async function getUsers(skip = 0, limit = 100) {
  return apiRequest(`/users?skip=${skip}&limit=${limit}`, { withAuth: true });
}

export async function updateUser(userId, userData) {
  return apiRequest(`/users/${userId}`, {
    method: "PUT",
    withAuth: true,
    isJson: true,
    body: JSON.stringify(userData),
  });
}

export async function deactivateUser(userId) {
  return apiRequest(`/users/${userId}`, {
    method: "DELETE",
    withAuth: true,
  });
}
