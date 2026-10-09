"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { register as registerApi, ApiError } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    try {
      await registerApi(data);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (
          err.code === "AUTH_RESOURCE_CONFLICT" ||
          err.statusCode === 409
        ) {
          setServerError("Email này đã được sử dụng.");
        } else {
          setServerError(err.message);
        }
      } else if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Không thể kết nối tới server. Vui lòng thử lại.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>{serverError}</div>
        </div>
      )}

      {/* Display Name & Username Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Tên hiển thị
          </label>
          <input
            type="text"
            autoComplete="name"
            placeholder="VD: Tu Tiên Giả"
            className={inputCls(!!errors.displayName)}
            {...register("displayName")}
          />
          {errors.displayName && (
            <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
              {errors.displayName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Tên đăng nhập
          </label>
          <input
            type="text"
            autoComplete="username"
            placeholder="tutien_99"
            className={inputCls(!!errors.username)}
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
              {errors.username.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
          Email
        </label>
        <input
          type="email"
          autoComplete="email"
          placeholder="email@example.com"
          className={inputCls(!!errors.email)}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Ít nhất 8 ký tự, có chữ & số"
            className={inputCls(!!errors.password) + " pr-10"}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="mb-1 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
          Xác nhận mật khẩu
        </label>
        <input
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu vừa tạo"
          className={inputCls(!!errors.confirmPassword)}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Agree Terms */}
      <div className="pt-1">
        <label className="inline-flex cursor-pointer items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded-md border-zinc-300 text-amber-500 focus:ring-amber-400 dark:border-zinc-700 dark:bg-zinc-950"
            {...register("agreeTerms")}
          />
          <span>
            Tôi đồng ý với{" "}
            <Link href="/dieu-khoan" className="font-semibold text-amber-600 hover:underline dark:text-amber-400">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link href="/chinh-sach" className="font-semibold text-amber-600 hover:underline dark:text-amber-400">
              Chính sách bảo mật
            </Link>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="mt-1 text-[11px] text-red-600 dark:text-red-400">
            {errors.agreeTerms.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="amber"
        size="lg"
        isLoading={isSubmitting}
        className="w-full mt-2 shadow-lg shadow-amber-500/20"
      >
        {isSubmitting ? "Đang tạo tài khoản..." : "Đăng ký tài khoản miễn phí"}
      </Button>
    </form>
  );
}

function inputCls(hasError: boolean) {
  return `h-10 w-full rounded-xl border bg-zinc-50/50 px-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:bg-white focus:outline-none focus:ring-2 dark:bg-zinc-950/60 dark:text-zinc-100 ${
    hasError
      ? "border-red-400 focus:ring-red-400/20"
      : "border-zinc-200 focus:border-amber-400 focus:ring-amber-400/20 dark:border-zinc-800"
  }`;
}
