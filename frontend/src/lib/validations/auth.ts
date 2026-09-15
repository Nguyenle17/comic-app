import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Tên hiển thị phải có ít nhất 2 ký tự")
      .max(50, "Tên hiển thị tối đa 50 ký tự"),
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(30, "Tên đăng nhập tối đa 30 ký tự")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Chỉ được dùng chữ, số và dấu gạch dưới",
      ),
    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[a-zA-Z]/, "Mật khẩu phải có ít nhất 1 chữ cái")
      .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 chữ số"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    agreeTerms: z.literal(true, {
      message: "Bạn cần đồng ý với điều khoản để tiếp tục",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;