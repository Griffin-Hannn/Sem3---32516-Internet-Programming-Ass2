import { apiRequest } from "./client";

export async function loginWithPassword(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  return apiRequest("/auth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
}

export async function registerUser({ email, name, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    isJson: true,
    body: JSON.stringify({ email, name, password }),
  });
}
