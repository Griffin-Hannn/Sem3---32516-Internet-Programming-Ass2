export const AUTH_STORAGE_KEY = "expense_auth";
export const AUTH_TTL_MS = 30 * 60 * 1000;

export function readAuthState() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user || !parsed?.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    if (Date.now() >= parsed.expiresAt) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function writeAuthState(token, user, ttlMs = AUTH_TTL_MS) {
  const expiresAt = Date.now() + ttlMs;
  const payload = { token, user, expiresAt };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function clearAuthState() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
