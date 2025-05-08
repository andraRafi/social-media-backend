import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const sendOtpSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});

export const resetPasswordSchema = z.object({
  otp: z.string().min(6).max(6),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),

  email: z.string().email({ message: "Invalid email format" }),
});
