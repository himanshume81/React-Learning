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

export async function fetchProfile(): Promise<User> {
  const raw = await apiFetch<RawUser>("/auth/profile", { auth: true });
  return toUser(raw);
}
