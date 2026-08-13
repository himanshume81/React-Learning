"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  name: string;
  email: string;
};

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "rl.auth.user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function deriveName(email: string) {
  const localPart = email.split("@")[0] ?? email;
  return localPart
    .split(/[.\-_]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Same SSR-safe pattern as ThemeProvider: start neutral on both server and
  // client, then hydrate from localStorage once mounted. "loading" lets a
  // route guard tell "not logged in yet" apart from "haven't checked yet".
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
        setStatus("authenticated");
        return;
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setStatus("unauthenticated");
  }, []);

  const login = (email: string) => {
    const nextUser: AuthUser = { name: deriveName(email), email };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setStatus("authenticated");
  };

  const logout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
