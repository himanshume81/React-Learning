export type UserStatus = "active" | "inactive";

export type UserRole = "admin" | "user";

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type User = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
};

export type UserInput = {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role?: UserRole;
  status?: UserStatus;
};
