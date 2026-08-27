import { apiFetch } from "@/lib/api-client";
import type { Activity, ActivityAction } from "@/types/activity";
import type { User, UserInput, UserRole, UserStatus } from "@/types/user";

// Shape returned by the backend (id is numeric, dates use created/updatedAt,
// plus a couple of password-reset fields the UI has no use for).
export type RawUser = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

export function toUser(raw: RawUser): User {
  const normalizedRole =
    String(raw.role).toLowerCase() === "admin" ? "admin" : "user";
  const normalizedStatus =
    String(raw.status).toLowerCase() === "inactive" ? "inactive" : "active";

  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    phoneNumber: raw.phoneNumber,
    role: normalizedRole,
    status: normalizedStatus,
    joinedAt: raw.createdAt,
  };
}

// In-memory, per-session activity log. The backend has no activity feed of
// its own, so this only reflects actions taken from this app instance —
// it resets on a hard refresh, same as the mock data it replaced.
let activityLog: Activity[] = [];

function logActivity(action: ActivityAction, userName: string) {
  activityLog = [
    { id: `a${activityLog.length + 1}-${Date.now()}`, action, userName, at: new Date().toISOString() },
    ...activityLog,
  ];
}

export type UserQuery = {
  search?: string;
  status?: UserStatus | "all";
  role?: UserRole | "all";
  page?: number;
  pageSize?: number;
};

export type PaginatedUsers = {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// The backend only exposes a flat GET /users with no query params, so
// search/status/pagination are all applied client-side over the full list.
async function fetchAllUsers(): Promise<User[]> {
  const raw = await apiFetch<RawUser[]>("/users", { auth: true });
  return raw.map(toUser);
}

export async function fetchUsers({
  search = "",
  status = "all",
  role = "all",
  page = 1,
  pageSize = 10,
}: UserQuery = {}): Promise<PaginatedUsers> {
  const all = await fetchAllUsers();

  const term = search.trim().toLowerCase();
  let filtered = all;

  if (term) {
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
  }

  if (status !== "all") {
    filtered = filtered.filter((user) => user.status === status);
  }

  if (role !== "all") {
    filtered = filtered.filter((user) => user.role === role);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export async function fetchUserById(id: string): Promise<User | null> {
  const all = await fetchAllUsers();
  return all.find((user) => user.id === id) ?? null;
}

export async function fetchUserStats() {
  const all = await fetchAllUsers();
  const total = all.length;
  const active = all.filter((user) => user.status === "active").length;
  return { total, active, inactive: total - active };
}

export async function fetchRecentActivity(limit = 5): Promise<Activity[]> {
  return activityLog.slice(0, limit);
}

// Blank optional fields come back from the form as "" — send them as
// omitted rather than as an empty string.
function normalize<T extends Partial<UserInput>>(input: T): T {
  return {
    ...input,
    phoneNumber: input.phoneNumber || undefined,
    password: input.password || undefined,
  };
}

export async function createUser(input: UserInput): Promise<User> {
  const raw = await apiFetch<RawUser>("/users", {
    method: "POST",
    body: normalize(input),
    auth: true,
  });
  const user = toUser(raw);
  logActivity("created", user.name);
  return user;
}

export async function updateUser(id: string, input: Partial<UserInput>): Promise<User> {
  const raw = await apiFetch<RawUser>(`/users/${id}`, {
    method: "PATCH",
    body: normalize(input),
    auth: true,
  });
  const user = toUser(raw);
  logActivity("updated", user.name);
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  const user = await fetchUserById(id);
  await apiFetch<void>(`/users/${id}`, { method: "DELETE", auth: true });
  if (user) {
    logActivity("deleted", user.name);
  }
}
