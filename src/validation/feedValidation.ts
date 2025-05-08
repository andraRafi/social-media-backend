import { z } from "zod";

export const createFeedSchema = z.object({
  caption: z.string({ message: "insert caption" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
