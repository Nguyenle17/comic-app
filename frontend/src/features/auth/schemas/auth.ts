import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "val.emailRequired")
    .email("val.emailInvalid"),
  password: z
    .string()
    .min(1, "val.passwordRequired")
    .min(8, "val.passwordMin"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "val.displayNameMin")
      .max(50, "val.displayNameMax"),
    username: z
      .string()
      .min(3, "val.usernameMin")
      .max(30, "val.usernameMax")
      .regex(/^[a-zA-Z0-9_]+$/, "val.usernamePattern"),
    email: z
      .string()
      .min(1, "val.emailRequired")
      .email("val.emailInvalid"),
    password: z
      .string()
      .min(8, "val.passwordMin")
      .regex(/[a-zA-Z]/, "val.passwordLetter")
      .regex(/[0-9]/, "val.passwordNumber"),
    confirmPassword: z.string().min(1, "val.confirmRequired"),
    agreeTerms: z.literal(true, {
      message: "val.agreeRequired",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "val.passwordMismatch",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
