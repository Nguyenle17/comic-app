"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useT } from "@/features/preferences/i18n";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { cn } from "@/lib/utils";
import {
  EyeIcon,
  EyeOffIcon,
  WarningIcon,
} from "@/features/auth/components/icons";

export function LoginForm() {
  const t = useT();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    serverError,
    showPassword,
    setShowPassword,
    onSubmit,
  } = useLogin();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-xs leading-5 text-accent-strong"
        >
          <WarningIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{serverError}</div>
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-xs font-medium text-ink-soft"
        >
          {t("auth.email")}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={cn("field", errors.email && "border-accent")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="login-email-error" className="mt-1.5 text-[11px] text-accent">
            {t(errors.email.message ?? "")}
          </p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs font-medium text-ink-soft">
            {t("auth.password")}
          </label>
          <Link
            href="/forgot-password"
            className="text-[11px] font-medium text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            {t("auth.forgot")}
          </Link>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className={cn("field pr-11", errors.password && "border-accent")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 grid h-11 w-11 place-items-center text-muted transition-colors hover:text-ink"
            aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" className="mt-1.5 text-[11px] text-accent">
            {t(errors.password.message ?? "")}
          </p>
        )}
      </div>

      <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
        <input
          type="checkbox"
          className="h-4 w-4 rounded-none border-line accent-accent"
          {...register("remember")}
        />
        {t("auth.remember")}
      </label>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        isLoading={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? t("auth.submittingLogin") : t("auth.submitLogin")}
      </Button>

      <div className="flex items-center gap-3 pt-1">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          {t("auth.orContinue")}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>
    </form>
  );
}

function SocialButton({ provider }: { provider: "google" | "facebook" }) {
  const t = useT();
  const isGoogle = provider === "google";
  return (
    <button
      type="button"
      onClick={() => alert(t("auth.socialAlert"))}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-line bg-surface text-xs font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
    >
      {isGoogle ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.07H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )}
      <span>{isGoogle ? "Google" : "Facebook"}</span>
    </button>
  );
}
