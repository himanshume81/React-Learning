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
  phoneNumber: z.string().optional().or(z.literal("")),
  password: z.string().optional(),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "Select a role" }),
  }),
  status: z.enum(["active", "inactive"], {
    errorMap: () => ({ message: "Select a status" }),
  }),
});

// Add-user only: the API requires a password (min 6 characters) on create;
// edit reuses `userSchema` since users aren't re-authenticated there.
export const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserFormValues = z.infer<typeof userSchema>;
