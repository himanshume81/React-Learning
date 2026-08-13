import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  role: z.enum(["admin", "editor", "viewer"], {
    errorMap: () => ({ message: "Select a role" }),
  }),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Select a status" }),
  }),
});

export type UserFormValues = z.infer<typeof userSchema>;
