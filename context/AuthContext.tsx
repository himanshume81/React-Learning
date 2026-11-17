"use client";

import { ApiError } from "@/lib/api-client";
import { firstPermittedPage } from "@/lib/rbac/permissions";
import { fetchProfile, login as loginRequest } from "@/lib/auth-api";
import { clearTokens, getRefreshToken, setTokens } from "@/lib/auth-tokens";
import type { User, UserRole } from "@/types/user";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  type ReactNode,
} from "react";

export type AuthUser = User;

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: AuthStatus;
  login: (email: string, password: string, userType: UserRole) => Promise<string>;
  permissionError: string | null;
  permissionsLoading: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const generation = useRef(0);
  const refreshProfile = useCallback(async () => {
    const requestGeneration = ++generation.current;
    setPermissionsLoading(true);
    try {
      const profile = await fetchProfile();
      if (generation.current !== requestGeneration) return;
      setUser(profile);
      setPermissionError(null);
    } catch (error) {
      if (generation.current !== requestGeneration) return;
      if (error instanceof ApiError && error.status === 401) {
        clearTokens();
        setUser(null);
        setStatus("unauthenticated");
      } else {
        setUser(null);
        setPermissionError(error instanceof Error ? error.message : "Could not refresh access permissions.");
      }
    } finally {
      if (generation.current === requestGeneration) setPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // No refresh token at all means we've never logged in — skip the round
    // trip and go straight to "unauthenticated" instead of hitting the API.
    if (!getRefreshToken()) {
      // Initial browser session hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unauthenticated");
      return;
    }

    let ignore = false;
    const requestGeneration = ++generation.current;

    // fetchProfile() attaches whatever access token is stored (possibly
    // none/expired); api-client transparently refreshes and retries once
    // on a 401, so this single call covers both "still signed in" and
    // "access token expired, refresh token still good".
    fetchProfile()
      .then((profile) => {
        if (ignore || generation.current !== requestGeneration) return;
        setUser(profile);
        setStatus("authenticated");
      })
      .catch(() => {
        if (ignore || generation.current !== requestGeneration) return;
        clearTokens();
        setUser(null);
        setStatus("unauthenticated");
      });

    return () => {
      ignore = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string, userType: UserRole) => {
    const requestGeneration = ++generation.current;
    const result = await loginRequest(email, password, userType);
    if (generation.current !== requestGeneration) throw new Error("Sign-in was cancelled. Please try again.");
    setPermissionsLoading(false);
    setTokens(result.accessToken, result.refreshToken);
    setUser(result.user);
    setStatus("authenticated");
    setPermissionError(null);
    return firstPermittedPage(result.user);
  }, []);

  const logout = useCallback(() => {
    generation.current += 1;
    setPermissionsLoading(false);
    setPermissionError(null);
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    const refresh = () => { if (document.visibilityState === "visible") void refreshProfile(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = window.setInterval(refresh, 60000);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.clearInterval(timer);
    };
  }, [status, refreshProfile]);

  const value = useMemo(
    () => ({ user, status, login, logout, permissionError, permissionsLoading, refreshProfile }),
    [user, status, login, logout, permissionError, permissionsLoading, refreshProfile]
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
