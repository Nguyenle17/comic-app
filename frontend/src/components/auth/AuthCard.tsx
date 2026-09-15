"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  const pathname = usePathname();
  const isLogin = pathname.includes("login") || pathname.includes("dang-nhap");

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Glow highlight */}
      <div className="relative rounded-3xl bg-white/90 p-6 shadow-2xl shadow-amber-500/10 ring-1 ring-zinc-200/80 backdrop-blur-xl sm:p-8 dark:bg-zinc-900/90 dark:ring-zinc-800 dark:shadow-black/50">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="group mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Trang chủ
        </Link>

        {/* Brand Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="mb-3 flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-rose-500 text-lg font-black text-white shadow-md shadow-amber-500/30">
              T
            </span>
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Truyen<span className="text-amber-500">Viet</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tabs Switcher: Đăng nhập / Đăng ký */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-zinc-100 p-1 text-center dark:bg-zinc-800/60">
          <Link
            href="/login"
            className={`rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
              isLogin
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className={`rounded-xl py-2 text-xs font-semibold transition-all duration-200 ${
              !isLogin
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            Tạo tài khoản mới
          </Link>
        </div>

        {/* Form Body */}
        {children}
      </div>

      {/* Footer Info */}
      {footer && (
        <div className="mt-5 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {footer}
        </div>
      )}
    </div>
  );
}