"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { logout } from "@/lib/api/auth";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Rankings", href: "/rankings" },
  { label: "Originals", href: "/stories?type=original" },
];

export function Header() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [openUserDropdown, setOpenUserDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUiStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    setOpenUserDropdown(false);
    setOpenMenu(false);
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-zinc-200/80 bg-white/80 backdrop-blur-md shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/80"
          : "border-b border-transparent bg-white/50 backdrop-blur-sm dark:bg-zinc-950/50"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-rose-500 text-base font-black text-white shadow-sm shadow-amber-500/30 transition-transform group-hover:scale-105">
              N
            </span>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              N<span className="text-amber-500">Stories</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden flex-1 max-w-md md:block">
          <SearchInput />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          {mounted && (
            <button
              type="button"
              onClick={toggleDarkMode}
              className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-200/80 bg-zinc-50/50 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          {/* Logged in or Guest */}
          {mounted && isAuthenticated && user ? (
            <div className="relative flex items-center gap-2" ref={dropdownRef}>
              {/* Coin Badge */}
              <Link
                href="/vi-cua-toi"
                className="hidden items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 ring-1 ring-inset ring-amber-500/30 transition hover:bg-amber-500/20 sm:inline-flex dark:text-amber-300"
              >
                <CoinIcon className="h-3.5 w-3.5" />
                <span>{user.coinBalance ?? 0} xu</span>
              </Link>

              {/* User Avatar Button */}
              <button
                type="button"
                onClick={() => setOpenUserDropdown(!openUserDropdown)}
                className="flex items-center gap-2 rounded-full p-0.5 ring-2 ring-transparent transition hover:ring-amber-400 focus:outline-none"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700"
                  />
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white shadow-sm">
                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
                <span className="hidden text-xs font-semibold text-zinc-800 lg:inline dark:text-zinc-200">
                  {user.displayName}
                </span>
                <svg
                  className={`hidden h-3.5 w-3.5 text-zinc-400 transition-transform lg:block ${
                    openUserDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {openUserDropdown && (
                <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {user.displayName}
                    </p>
                    <p className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setOpenUserDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19a4 4 0 00-6 0m3-8a3 3 0 100-6 3 3 0 000 6zm8 1a8 8 0 11-16 0 8 8 0 0116 0z" />
                      </svg>
                      My account
                    </Link>

                    <Link
                      href="/tu-truyen"
                      onClick={() => setOpenUserDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      My library
                    </Link>

                    <Link
                      href="/vi-cua-toi"
                      onClick={() => setOpenUserDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <CoinIcon className="h-4 w-4 text-amber-500" />
                      Wallet ({user.coinBalance ?? 0} coins)
                    </Link>

                    <Link
                      href="/lich-su"
                      onClick={() => setOpenUserDropdown(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Reading history
                    </Link>

                    {user.role === "author" || user.role === "admin" ? (
                      <Link
                        href="/author/stories/new"
                        onClick={() => setOpenUserDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Create a story
                      </Link>
                    ) : (
                      <Link
                        href="/become-author"
                        onClick={() => setOpenUserDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Become an author
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 pt-1 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/auth/login"
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-2 text-xs font-bold text-zinc-950 shadow-sm shadow-amber-500/20 transition hover:from-amber-400 hover:to-amber-300"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setOpenMenu(!openMenu)}
            aria-label="Open navigation menu"
            className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-200/80 text-zinc-700 transition hover:bg-zinc-100 md:hidden dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {openMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {openMenu && (
        <div className="border-t border-zinc-200/80 bg-white/95 px-4 py-4 backdrop-blur-lg md:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="mb-4">
            <SearchInput />
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpenMenu(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-zinc-200/80 pt-4 dark:border-zinc-800">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-2 py-1">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-500 text-xs font-bold text-white">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{user.displayName}</p>
                    <p className="text-[11px] text-zinc-500">{user.coinBalance ?? 0} xu</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/account"
                    onClick={() => setOpenMenu(false)}
                    className="rounded-xl border border-zinc-200 py-2 text-center text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    Account
                  </Link>
                  <Link
                    href="/tu-truyen"
                    onClick={() => setOpenMenu(false)}
                    className="rounded-xl border border-zinc-200 py-2 text-center text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    My library
                  </Link>
                  <Link
                    href="/vi-cua-toi"
                    onClick={() => setOpenMenu(false)}
                    className="rounded-xl bg-amber-500/10 py-2 text-center text-xs font-semibold text-amber-600 dark:text-amber-400"
                  >
                    Wallet
                  </Link>
                </div>
                {user.role === "author" || user.role === "admin" ? (
                  <Link
                    href="/author/stories/new"
                    onClick={() => setOpenMenu(false)}
                    className="block rounded-xl bg-amber-500/10 py-2 text-center text-xs font-semibold text-amber-600 dark:text-amber-400"
                  >
                    Create a story
                  </Link>
                ) : (
                  <Link
                    href="/become-author"
                    onClick={() => setOpenMenu(false)}
                    className="block rounded-xl bg-amber-500/10 py-2 text-center text-xs font-semibold text-amber-600 dark:text-amber-400"
                  >
                    Become an author
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl py-2 text-center text-xs font-semibold text-red-600 dark:text-red-400"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpenMenu(false)}
                  className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-center text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:text-zinc-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpenMenu(false)}
                  className="flex-1 rounded-xl bg-amber-500 py-2.5 text-center text-xs font-bold text-zinc-950"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function SearchInput() {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </span>
      <input
        type="search"
        placeholder="Search stories, authors, and categories..."
        className="h-10 w-full rounded-full border border-zinc-200/80 bg-zinc-50/70 pl-10 pr-4 text-xs text-zinc-800 placeholder:text-zinc-400 transition focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/20 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />
    </div>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v10M9.5 9.5h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
