"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useUIStore } from "@/features/preferences/stores/ui-store";
import { useT } from "@/features/preferences/i18n";
import { logout } from "@/features/auth/api";

const NAV = [
  { key: "nav.home", href: "/" },
  { key: "nav.categories", href: "/categories" },
  { key: "nav.rankings", href: "/rankings" },
  { key: "nav.originals", href: "/stories?type=original" },
] as const;

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useT();
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
  const { isDarkMode, language, toggleDarkMode, setLanguage } = useUIStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return base === "/" ? pathname === "/" : pathname.startsWith(base);
  };

  const navLinks = (mobile = false) =>
    NAV.map((item) => {
      const active = isActive(item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={mobile ? () => setOpenMenu(false) : undefined}
          className={
            mobile
              ? `border-b border-line py-3 text-sm font-medium ${
                  active ? "text-accent" : "text-ink-soft"
                }`
              : `relative py-1 text-sm font-medium transition-colors ${
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                }`
          }
          aria-current={active ? "page" : undefined}
        >
          {t(item.key)}
          {!mobile && (
            <span
              className={`absolute -bottom-[21px] left-0 h-0.5 w-full bg-accent transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </Link>
      );
    });

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-paper/95 transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center bg-accent font-serif text-base font-semibold text-surface">
              N
            </span>
            <span className="font-serif text-xl font-semibold tracking-tight text-ink">
              NStories
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">{navLinks()}</nav>
        </div>

        <div className="hidden max-w-xs flex-1 md:block">
          <SearchInput placeholder={t("nav.search")} />
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              type="button"
              onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-accent"
              aria-label={t("lang.toggle")}
            >
              {language === "vi" ? "EN" : "VI"}
            </button>
          )}

          {mounted && (
            <button
              type="button"
              onClick={toggleDarkMode}
              className="grid h-9 w-9 place-items-center rounded-sm border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
              aria-label={isDarkMode ? t("theme.toLight") : t("theme.toDark")}
            >
              {isDarkMode ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          {mounted && isAuthenticated && user ? (
            <div className="relative flex items-center gap-3" ref={dropdownRef}>
              <Link
                href="/vi-cua-toi"
                className="hidden items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-accent sm:inline-flex"
              >
                <CoinIcon className="h-3.5 w-3.5" />
                <span>
                  {user.coinBalance ?? 0} {t("common.coins")}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setOpenUserDropdown(!openUserDropdown)}
                className="flex items-center gap-2 rounded-sm border border-line px-1.5 py-1 transition-colors hover:border-line-strong"
                aria-expanded={openUserDropdown}
                aria-haspopup="menu"
              >
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="h-7 w-7 rounded-sm object-cover"
                  />
                ) : (
                  <span className="grid h-7 w-7 place-items-center bg-ink font-serif text-xs font-semibold text-paper">
                    {user.displayName?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
                <span className="hidden max-w-28 truncate text-xs font-medium text-ink lg:inline">
                  {user.displayName}
                </span>
                <svg
                  className={`hidden h-3.5 w-3.5 text-muted transition-transform lg:block ${
                    openUserDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openUserDropdown && (
                <div
                  role="menu"
                  className="absolute right-0 top-11 z-50 w-60 rounded-sm border border-line bg-surface p-2 shadow-lg shadow-black/5"
                >
                  <div className="border-b border-line px-3 py-2.5">
                    <p className="text-xs font-semibold text-ink">{user.displayName}</p>
                    <p className="truncate text-[11px] text-muted">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <MenuLink href="/account" icon="account" label={t("common.account")} onNavigate={() => setOpenUserDropdown(false)} />
                    <MenuLink href="/tu-truyen" icon="library" label={t("common.library")} onNavigate={() => setOpenUserDropdown(false)} />
                    <MenuLink href="/vi-cua-toi" icon="coin" label={`${t("common.wallet")} (${user.coinBalance ?? 0})`} onNavigate={() => setOpenUserDropdown(false)} />
                    <MenuLink href="/lich-su" icon="history" label={t("common.history")} onNavigate={() => setOpenUserDropdown(false)} />
                    {user.role === "author" || user.role === "admin" ? (
                      <MenuLink href="/author/stories/new" icon="create" accent label={t("common.createStory")} onNavigate={() => setOpenUserDropdown(false)} />
                    ) : (
                      <MenuLink href="/become-author" icon="create" accent label={t("common.becomeAuthor")} onNavigate={() => setOpenUserDropdown(false)} />
                    )}
                  </div>

                  <div className="border-t border-line pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium text-accent transition-colors hover:bg-accent-soft"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t("common.signOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-4 sm:flex">
              <Link
                href="/auth/login"
                className="text-xs font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {t("common.signIn")}
              </Link>
              <Link
                href="/auth/register"
                className="rounded-sm bg-accent px-3.5 py-2 text-xs font-semibold text-surface transition-colors hover:bg-accent-strong"
              >
                {t("common.signUp")}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpenMenu(!openMenu)}
            aria-label="Menu"
            aria-expanded={openMenu}
            className="grid h-9 w-9 place-items-center rounded-sm border border-line text-ink transition-colors hover:border-line-strong md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {openMenu ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {openMenu && (
        <div className="border-t border-line bg-paper px-4 py-5 md:hidden">
          <div className="mb-4">
            <SearchInput placeholder={t("nav.search")} />
          </div>

          <nav className="flex flex-col">{navLinks(true)}</nav>

          <div className="mt-5 border-t border-line pt-4">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center bg-ink font-serif text-sm font-semibold text-paper">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{user.displayName}</p>
                    <p className="text-[11px] text-muted">
                      {user.coinBalance ?? 0} {t("common.coins")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <MobileLink href="/account" label={t("common.account")} onNavigate={() => setOpenMenu(false)} />
                  <MobileLink href="/tu-truyen" label={t("common.library")} onNavigate={() => setOpenMenu(false)} />
                  <MobileLink href="/vi-cua-toi" label={t("common.wallet")} onNavigate={() => setOpenMenu(false)} />
                  {user.role === "author" || user.role === "admin" ? (
                    <MobileLink href="/author/stories/new" label={t("common.createStory")} onNavigate={() => setOpenMenu(false)} />
                  ) : (
                    <MobileLink href="/become-author" label={t("common.becomeAuthor")} onNavigate={() => setOpenMenu(false)} />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full border-t border-line pt-3 text-left text-xs font-medium text-accent"
                >
                  {t("common.signOut")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setOpenMenu(false)}
                  className="rounded-sm border border-line py-2.5 text-center text-xs font-semibold text-ink"
                >
                  {t("common.signIn")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setOpenMenu(false)}
                  className="rounded-sm bg-accent py-2.5 text-center text-xs font-semibold text-surface"
                >
                  {t("common.signUp")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MobileLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="rounded-sm border border-line py-2 text-center text-xs font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
    >
      {label}
    </Link>
  );
}

const menuIcons = {
  account: "M15 19a4 4 0 00-6 0m3-8a3 3 0 100-6 3 3 0 000 6zm8 1a8 8 0 11-16 0 8 8 0 0116 0z",
  library: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
  history: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  create: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
} as const;

function MenuLink({
  href,
  icon,
  label,
  accent,
  onNavigate,
}: {
  href: string;
  icon: keyof typeof menuIcons | "coin";
  label: string;
  accent?: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      role="menuitem"
      className={`flex items-center gap-2.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
        accent
          ? "text-accent hover:bg-accent-soft"
          : "text-ink-soft hover:bg-paper hover:text-ink"
      }`}
    >
      {icon === "coin" ? (
        <CoinIcon className="h-4 w-4" />
      ) : (
        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d={menuIcons[icon]} />
        </svg>
      )}
      {label}
    </Link>
  );
}

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </span>
      <input
        type="search"
        placeholder={placeholder}
        className="h-9 w-full rounded-sm border border-line bg-surface pl-9 pr-3 text-xs text-ink placeholder:text-muted transition-colors focus:border-accent focus:outline-none"
      />
    </div>
  );
}

function CoinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" d="M12 8v8M9.5 10h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3h4" />
    </svg>
  );
}
