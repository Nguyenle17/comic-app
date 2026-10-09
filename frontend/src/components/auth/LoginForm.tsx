"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { login, ApiError } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  async function onSubmit(data: LoginInput) {
    setServerError(null);
    try {
      await login(data);
      const redirect = searchParams.get("redirect") ?? "/";
      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (
          err.code === "AUTH_INVALID_CREDENTIALS" ||
          err.statusCode === 401
        ) {
          setServerError("Email hoặc mật khẩu không đúng.");
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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

      {/* Email Field */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
          Email
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`h-11 w-full rounded-2xl border bg-zinc-50/50 pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:bg-white focus:outline-none focus:ring-2 dark:bg-zinc-950/60 dark:text-zinc-100 ${
              errors.email
                ? "border-red-400 focus:ring-red-400/20"
                : "border-zinc-200 focus:border-amber-400 focus:ring-amber-400/20 dark:border-zinc-800"
            }`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Mật khẩu
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={`h-11 w-full rounded-2xl border bg-zinc-50/50 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:bg-white focus:outline-none focus:ring-2 dark:bg-zinc-950/60 dark:text-zinc-100 ${
              errors.password
                ? "border-red-400 focus:ring-red-400/20"
                : "border-zinc-200 focus:border-amber-400 focus:ring-amber-400/20 dark:border-zinc-800"
            }`}
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
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
        )}
      </div>

      {/* Remember me */}
      <div className="flex items-center">
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <input
            type="checkbox"
            className="h-4 w-4 rounded-md border-zinc-300 text-amber-500 focus:ring-amber-400 dark:border-zinc-700 dark:bg-zinc-950"
            {...register("remember")}
          />
          Ghi nhớ đăng nhập trên thiết bị này
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="amber"
        size="lg"
        isLoading={isSubmitting}
        className="w-full shadow-lg shadow-amber-500/20"
      >
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập ngay"}
      </Button>

      {/* Divider */}
      <div className="relative py-2 text-center text-xs text-zinc-400">
        <span className="relative z-10 bg-white px-3 font-medium dark:bg-zinc-900">
          hoặc tiếp tục với
        </span>
        <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
    </form>
  );
}

function SocialButton({ provider }: { provider: "google" | "facebook" }) {
  const isGoogle = provider === "google";
  return (
    <button
      type="button"
      onClick={() => {
        alert("Đăng nhập bằng mạng xã hội đang được kết nối với cổng OAuth.");
      }}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {isGoogle ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )}
      <span>{isGoogle ? "Google" : "Facebook"}</span>
    </button>
  );
}
