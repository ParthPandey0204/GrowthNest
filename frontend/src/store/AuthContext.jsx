import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "growthnest_auth";

const AuthContext = createContext(null);

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const storedAuth = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedAuth) {
    return { token: null, user: null };
  }

  try {
    return JSON.parse(storedAuth);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return { token: null, user: null };
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth);

  const login = ({ token, user }) => {
    const nextAuth = { token, user };

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth({ token: null, user: null });
  };

  useEffect(() => {
    const handleUnauthorized = () => setAuth({ token: null, user: null });
    window.addEventListener("growthnest:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("growthnest:unauthorized", handleUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token && auth.user),
      login,
      logout,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
