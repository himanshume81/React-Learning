import type { Activity } from "@/types/activity";
import type { User, UserInput, UserStatus } from "@/types/user";

// Module-level state: this only works correctly when imported from client
// components. Importing it from a server component too would create a
// second, independent copy of the data. State resets on a hard refresh —
// expected for an in-memory mock, not a bug.
let users: User[] = [
  { id: "1", name: "Ava Thompson", email: "ava.thompson@example.com", role: "admin", status: "active", joinedAt: "2025-02-03T09:15:00.000Z" },
  { id: "2", name: "Liam Carter", email: "liam.carter@example.com", role: "editor", status: "active", joinedAt: "2025-02-18T11:30:00.000Z" },
  { id: "3", name: "Sophia Nguyen", email: "sophia.nguyen@example.com", role: "viewer", status: "inactive", joinedAt: "2025-03-05T14:00:00.000Z" },
  { id: "4", name: "Noah Patel", email: "noah.patel@example.com", role: "editor", status: "active", joinedAt: "2025-03-22T08:45:00.000Z" },
  { id: "5", name: "Isabella Rossi", email: "isabella.rossi@example.com", role: "admin", status: "active", joinedAt: "2025-04-10T16:20:00.000Z" },
  { id: "6", name: "Mason Kim", email: "mason.kim@example.com", role: "viewer", status: "inactive", joinedAt: "2025-04-27T10:05:00.000Z" },
  { id: "7", name: "Mia Johansson", email: "mia.johansson@example.com", role: "editor", status: "active", joinedAt: "2025-05-14T13:40:00.000Z" },
  { id: "8", name: "Ethan Walker", email: "ethan.walker@example.com", role: "viewer", status: "active", joinedAt: "2025-05-30T09:00:00.000Z" },
  { id: "9", name: "Amelia Dubois", email: "amelia.dubois@example.com", role: "admin", status: "active", joinedAt: "2025-06-11T12:15:00.000Z" },
  { id: "10", name: "Lucas Silva", email: "lucas.silva@example.com", role: "editor", status: "inactive", joinedAt: "2025-06-25T15:50:00.000Z" },
  { id: "11", name: "Charlotte Muller", email: "charlotte.muller@example.com", role: "viewer", status: "active", joinedAt: "2025-07-08T08:30:00.000Z" },
  { id: "12", name: "Benjamin Costa", email: "benjamin.costa@example.com", role: "editor", status: "active", joinedAt: "2025-07-21T11:10:00.000Z" },
  { id: "13", name: "Harper Singh", email: "harper.singh@example.com", role: "viewer", status: "inactive", joinedAt: "2025-08-02T14:25:00.000Z" },
  { id: "14", name: "Elijah Wright", email: "elijah.wright@example.com", role: "admin", status: "active", joinedAt: "2025-09-09T09:55:00.000Z" },
  { id: "15", name: "Evelyn Rossi", email: "evelyn.rossi@example.com", role: "editor", status: "active", joinedAt: "2025-10-17T13:05:00.000Z" },
  { id: "16", name: "James Novak", email: "james.novak@example.com", role: "viewer", status: "active", joinedAt: "2025-11-29T10:45:00.000Z" },
  { id: "17", name: "Aria Fischer", email: "aria.fischer@example.com", role: "editor", status: "inactive", joinedAt: "2025-12-20T16:00:00.000Z" },
  { id: "18", name: "Henry Osei", email: "henry.osei@example.com", role: "viewer", status: "active", joinedAt: "2026-01-12T08:20:00.000Z" },
];

let activityLog: Activity[] = [
  { id: "a1", action: "created", userName: "Henry Osei", at: "2026-01-12T08:20:00.000Z" },
  { id: "a2", action: "updated", userName: "Aria Fischer", at: "2025-12-21T09:00:00.000Z" },
  { id: "a3", action: "created", userName: "James Novak", at: "2025-11-29T10:45:00.000Z" },
  { id: "a4", action: "updated", userName: "Evelyn Rossi", at: "2025-10-18T12:00:00.000Z" },
  { id: "a5", action: "created", userName: "Elijah Wright", at: "2025-09-09T09:55:00.000Z" },
];

let nextId = 19;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logActivity(action: Activity["action"], userName: string) {
  activityLog = [
    { id: `a${activityLog.length + 1}-${Date.now()}`, action, userName, at: new Date().toISOString() },
    ...activityLog,
  ];
}

export type UserQuery = {
  search?: string;
  status?: UserStatus | "all";
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

export async function fetchUsers(
  { search = "", status = "all", page = 1, pageSize = 10 }: UserQuery = {},
  ms = 600
): Promise<PaginatedUsers> {
  await delay(ms);

  const term = search.trim().toLowerCase();
  let filtered = users;

  if (term) {
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  if (status !== "all") {
    filtered = filtered.filter((user) => user.status === status);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return { data, total, page, pageSize, totalPages };
}

export async function fetchUserById(id: string, ms = 400): Promise<User | null> {
  await delay(ms);
  return users.find((user) => user.id === id) ?? null;
}

export async function fetchUserStats(ms = 500) {
  await delay(ms);
  const total = users.length;
  const active = users.filter((user) => user.status === "active").length;
  return { total, active, inactive: total - active };
}

export async function fetchRecentActivity(limit = 5, ms = 500): Promise<Activity[]> {
  await delay(ms);
  return activityLog.slice(0, limit);
}

export async function createUser(input: UserInput, ms = 700): Promise<User> {
  await delay(ms);

  const emailTaken = users.some(
    (user) => user.email.toLowerCase() === input.email.toLowerCase()
  );
  if (emailTaken) {
    throw new Error("Email already in use");
  }

  const user: User = {
    ...input,
    id: String(nextId++),
    joinedAt: new Date().toISOString(),
  };
  users = [user, ...users];
  logActivity("created", user.name);
  return user;
}

export async function updateUser(
  id: string,
  input: UserInput,
  ms = 700
): Promise<User> {
  await delay(ms);

  const existing = users.find((user) => user.id === id);
  if (!existing) {
    throw new Error("User not found");
  }

  const emailTaken = users.some(
    (user) => user.id !== id && user.email.toLowerCase() === input.email.toLowerCase()
  );
  if (emailTaken) {
    throw new Error("Email already in use");
  }

  const updated: User = { ...existing, ...input };
  users = users.map((user) => (user.id === id ? updated : user));
  logActivity("updated", updated.name);
  return updated;
}

export async function deleteUser(id: string, ms = 500): Promise<void> {
  await delay(ms);
  const existing = users.find((user) => user.id === id);
  users = users.filter((user) => user.id !== id);
  if (existing) {
    logActivity("deleted", existing.name);
  }
}
