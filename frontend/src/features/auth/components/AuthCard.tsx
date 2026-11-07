"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useT } from "@/features/preferences/i18n";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  const t = useT();
  const pathname = usePathname();
  const isLogin = pathname.includes("login") || pathname.includes("dang-nhap");

  return (
    <div className="w-full">
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
      >
        <svg
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t("auth.home")}
      </Link>

      <div className="mt-8">
        <h1 className="text-balance font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-6 text-ink-soft">{subtitle}</p>
        )}
      </div>

      <nav
        aria-label={t("auth.signIn")}
        className="mb-6 mt-8 grid grid-cols-2 border-b border-line"
      >
        <Link
          href="/auth/login"
          aria-current={isLogin ? "page" : undefined}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            isLogin
              ? "border-accent text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t("auth.signIn")}
        </Link>
        <Link
          href="/auth/register"
          aria-current={!isLogin ? "page" : undefined}
          className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
            !isLogin
              ? "border-accent text-ink"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          {t("auth.createAccount")}
        </Link>
      </nav>

      {children}

      {footer && (
        <div className="mt-6 border-t border-line pt-4 text-xs leading-6 text-muted">
          {footer}
        </div>
      )}
    </div>
  );
}
