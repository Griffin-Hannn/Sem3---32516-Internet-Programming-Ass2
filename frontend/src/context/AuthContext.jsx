import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AUTH_TTL_MS, clearAuthState, readAuthState, writeAuthState } from "../auth/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = readAuthState();
    if (!auth) return;
    setToken(auth.token);
    setUser(auth.user);
  }, []);

  const login = (nextToken, nextUser, ttlMs = AUTH_TTL_MS) => {
    writeAuthState(nextToken, nextUser, ttlMs);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    clearAuthState();
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
