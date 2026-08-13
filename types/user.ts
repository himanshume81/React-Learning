export type UserStatus = "active" | "inactive";

export type UserRole = "admin" | "editor" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
};

export type UserInput = Omit<User, "id" | "joinedAt">;
