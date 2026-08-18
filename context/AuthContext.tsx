"use client";

import { fetchProfile, login as loginRequest } from "@/lib/auth-api";
import { clearTokens, getRefreshToken, setTokens } from "@/lib/auth-tokens";
import type { User } from "@/types/user";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = User;

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    // No refresh token at all means we've never logged in — skip the round
    // trip and go straight to "unauthenticated" instead of hitting the API.
    if (!getRefreshToken()) {
      setStatus("unauthenticated");
      return;
    }

    let ignore = false;

    // fetchProfile() attaches whatever access token is stored (possibly
    // none/expired); api-client transparently refreshes and retries once
    // on a 401, so this single call covers both "still signed in" and
    // "access token expired, refresh token still good".
    fetchProfile()
      .then((profile) => {
        if (ignore) return;
        setUser(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        if (ignore) return;
        clearTokens();
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginRequest(email, password);
    setTokens(result.accessToken, result.refreshToken);
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ user, status, login, logout }),
    [user, status, login, logout]
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
