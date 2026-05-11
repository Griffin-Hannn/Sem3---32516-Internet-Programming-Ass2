import { clearAuthState, readAuthState } from "../auth/storage";

const DEFAULT_API_URL = "http://127.0.0.1:8000";
export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

function buildHeaders({ withAuth = false, isJson = false, extraHeaders = {} } = {}) {
  const headers = { ...extraHeaders };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (withAuth) {
    const auth = readAuthState();
    if (auth?.token) {
      headers.Authorization = `Bearer ${auth.token}`;
    }
  }

  return headers;
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (response.status === 204) {
    return null;
  }

  if (isJson) {
    return response.json();
  }

  return response.text();
}

function handleUnauthorized() {
  clearAuthState();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    withAuth = false,
    isJson = false,
    headers = {},
  } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: buildHeaders({ withAuth, isJson, extraHeaders: headers }),
    body,
  });

  if (response.status === 401 && withAuth) {
    handleUnauthorized();
    throw new Error("Session expired. Please login again.");
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && payload.detail) ||
      (typeof payload === "string" && payload) ||
      "Request failed";
    throw new Error(message);
  }

  return payload;
}
