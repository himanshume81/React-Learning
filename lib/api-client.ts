import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from "@/lib/auth-tokens";

// Always goes through the same-origin proxy (see next.config.ts), which
// forwards to the real backend server-side — the backend itself sends no
// CORS headers, so a direct browser request to it would be blocked.
// NEXT_PUBLIC_API_BASE_URL configures where that proxy points, not this.
const API_BASE_URL = "/api/proxy";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function extractMessage(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (Array.isArray(message)) return message.join(" ");
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  // Attaches the access token and, on a 401, transparently refreshes it and
  // retries the request once before giving up.
  auth?: boolean;
};

async function rawRequest<T>(path: string, { body, auth, headers, ...init }: ApiFetchOptions): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(auth && getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", 0);
  }

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    throw new ApiError(extractMessage(data, "Something went wrong. Please try again."), response.status);
  }

  return data as T;
}

// Concurrent 401s share one in-flight refresh instead of each firing their
// own /auth/refresh call.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  if (!refreshPromise) {
    refreshPromise = rawRequest<{ accessToken: string }>("/auth/refresh", {
      method: "POST",
      body: { refreshToken },
    })
      .then((data) => {
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch(() => {
        clearTokens();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  try {
    return await rawRequest<T>(path, options);
  } catch (error) {
    if (options.auth && error instanceof ApiError && error.status === 401) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return rawRequest<T>(path, options);
      }
    }
    throw error;
  }
}
