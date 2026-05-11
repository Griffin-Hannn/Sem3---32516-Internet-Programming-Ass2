import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "expense_auth";
const AUTH_TTL_MS = 30 * 60 * 1000;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const { token: savedToken, user: savedUser, expiresAt } = parsed;
      if (!savedToken || !savedUser || !expiresAt || Date.now() >= expiresAt) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      setToken(savedToken);
      setUser(savedUser);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = (nextToken, nextUser, ttlMs = AUTH_TTL_MS) => {
    const expiresAt = Date.now() + ttlMs;
    const payload = { token: nextToken, user: nextUser, expiresAt };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
