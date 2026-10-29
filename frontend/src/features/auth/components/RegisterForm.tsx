"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useT } from "@/features/preferences/i18n";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, WarningIcon } from "@/features/auth/components/icons";

export function RegisterForm() {
  const t = useT();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    serverError,
    showPassword,
    setShowPassword,
    onSubmit,
  } = useRegister();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-xs leading-5 text-accent-strong"
        >
          <WarningIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{serverError}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="register-name" className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("auth.displayName")}
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder={t("auth.displayNamePlaceholder")}
            className={cn("field", errors.displayName && "border-accent")}
            aria-invalid={!!errors.displayName}
            {...register("displayName")}
          />
          {errors.displayName && (
            <p className="mt-1.5 text-[11px] text-accent">
              {t(errors.displayName.message ?? "")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-username" className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("auth.username")}
          </label>
          <input
            id="register-username"
            type="text"
            autoComplete="username"
            placeholder="tutien_99"
            className={cn("field", errors.username && "border-accent")}
            aria-invalid={!!errors.username}
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1.5 text-[11px] text-accent">
              {t(errors.username.message ?? "")}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="register-email" className="mb-1.5 block text-xs font-medium text-ink-soft">
          {t("auth.email")}
        </label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          placeholder="email@example.com"
          className={cn("field", errors.email && "border-accent")}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-[11px] text-accent">
            {t(errors.email.message ?? "")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-password" className="mb-1.5 block text-xs font-medium text-ink-soft">
          {t("auth.password")}
        </label>
        <div className="relative">
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder={t("auth.passwordHint")}
            className={cn("field pr-11", errors.password && "border-accent")}
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
            aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-[11px] text-accent">
            {t(errors.password.message ?? "")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-confirm" className="mb-1.5 block text-xs font-medium text-ink-soft">
          {t("auth.confirmPassword")}
        </label>
        <input
          id="register-confirm"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder={t("auth.confirmPlaceholder")}
          className={cn("field", errors.confirmPassword && "border-accent")}
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-[11px] text-accent">
            {t(errors.confirmPassword.message ?? "")}
          </p>
        )}
      </div>

      <div>
        <label className="inline-flex cursor-pointer items-start gap-2 text-xs leading-5 text-ink-soft">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded-none border-line accent-accent"
            {...register("agreeTerms")}
          />
          <span>
            {t("auth.agreePrefix")}{" "}
            <Link href="/dieu-khoan" className="prose-link font-medium text-ink">
              {t("auth.termsOfUse")}
            </Link>{" "}
            {t("auth.and")}{" "}
            <Link href="/chinh-sach" className="prose-link font-medium text-ink">
              {t("auth.privacyPolicy")}
            </Link>
          </span>
        </label>
        {errors.agreeTerms && (
          <p className="mt-1.5 text-[11px] text-accent">
            {t(errors.agreeTerms.message ?? "")}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="amber"
        size="lg"
        isLoading={isSubmitting}
        className="mt-2 w-full"
      >
        {isSubmitting ? t("auth.submittingRegister") : t("auth.submitRegister")}
      </Button>
    </form>
  );
}
