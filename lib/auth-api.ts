import { apiFetch } from "@/lib/api-client";
import type { RawUser } from "@/lib/users-api";
import { toUser } from "@/lib/users-api";
import type { User } from "@/types/user";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: RawUser;
};

export type LoginResult = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

type MessageResponse = {
  message: string;
};

export async function login(email: string, password: string): Promise<LoginResult> {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: toUser(data.user),
  };
}

export async function forgotPassword(email: string): Promise<string> {
  const data = await apiFetch<MessageResponse>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });

  return data.message;
}

export async function resetPassword(token: string, password: string): Promise<string> {
  const data = await apiFetch<MessageResponse>("/auth/reset-password", {
    method: "POST",
    body: { token, password },
  });

  return data.message;
}

export async function setPassword(token: string, password: string): Promise<string> {
  const data = await apiFetch<MessageResponse>("/auth/set-password", {
    method: "POST",
    body: { token, password },
  });

  return data.message;
}

export async function fetchProfile(): Promise<User> {
  const raw = await apiFetch<RawUser>("/auth/profile", { auth: true });
  return toUser(raw);
}
