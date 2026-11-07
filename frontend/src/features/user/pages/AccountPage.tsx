"use client";

import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/Button";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { useT } from "@/features/preferences/i18n";
import { useBecomeAuthor } from "@/features/user/hooks/useBecomeAuthor";
import { isAuthorRole } from "@/types/user";

export default function AccountPage() {
  const t = useT();
  const { user } = useAuthStore();
  const { error, isSubmitting, onSubmit } = useBecomeAuthor();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <p className="rule-label">NNovels</p>
        <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("account.signedOutTitle")}
        </h1>
        <p className="mt-4 max-w-md text-pretty text-sm leading-7 text-ink-soft">
          {t("account.subtitle")}
        </p>
        <Link
          href="/auth/login"
          className={buttonStyles({ variant: "accent", className: "mt-8 h-11" })}
        >
          {t("common.signIn")}
        </Link>
      </main>
    );
  }

  const isAuthor = isAuthorRole(user.role);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-2xl">
        <p className="rule-label">{t("common.account")}</p>
        <h1 className="mt-3 text-balance font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("account.myAccount")}
        </h1>
        <p className="mt-3 text-pretty text-sm leading-7 text-ink-soft">{t("account.subtitle")}</p>
      </header>

      <div className="mt-10 grid gap-10 border-t border-line pt-8 lg:grid-cols-[260px_1fr] lg:gap-16">
        <aside>
          <div className="flex items-center gap-4 lg:block">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="h-16 w-16 rounded-sm border border-line object-cover lg:h-24 lg:w-24"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center bg-accent font-serif text-2xl font-semibold text-surface lg:h-24 lg:w-24 lg:text-4xl">
                {user.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="lg:mt-5">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                {user.displayName}
              </h2>
              <p className="mt-1 break-all text-xs text-muted">{user.email}</p>
            </div>
          </div>

          <dl className="mt-6 border-t border-line text-xs">
            <div className="flex items-center justify-between border-b border-line py-2.5">
              <dt className="text-muted">{t("account.role")}</dt>
              <dd className="font-medium capitalize text-ink">{user.role}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-line py-2.5">
              <dt className="text-muted">{t("common.wallet")}</dt>
              <dd className="font-medium text-ink">
                {user.coinBalance ?? 0} {t("common.coins")}
              </dd>
            </div>
          </dl>
        </aside>

        <div>
          <section>
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {t("account.creatorSection")}
            </h2>

            {error && (
              <p
                role="alert"
                className="mt-4 border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-xs text-accent-strong"
              >
                {error}
              </p>
            )}

            {isAuthor ? (
              <div className="mt-4 border-t border-line">
                <ActionRow
                  href="/author/stories/new"
                  label={t("common.createStory")}
                  hint={t("stories.newSubtitle")}
                />
                <ActionRow
                  href="/author/stories"
                  label={t("account.manageStories")}
                  hint={t("stories.editSubtitle")}
                />
              </div>
            ) : (
              <div className="mt-4 border-t border-line pt-5">
                <p className="max-w-lg text-sm leading-7 text-ink-soft">
                  {t("becomeAuthor.desc")}
                </p>
                <Button
                  type="button"
                  variant="accent"
                  isLoading={isSubmitting}
                  onClick={() => void onSubmit()}
                  className="mt-5 h-11"
                >
                  {isSubmitting ? t("common.updating") : t("common.becomeAuthor")}
                </Button>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {t("account.shortcuts")}
            </h2>
            <div className="mt-4 border-t border-line">
              <ActionRow href="/tu-truyen" label={t("common.library")} />
              <ActionRow href="/lich-su" label={t("common.history")} />
              <ActionRow href="/vi-cua-toi" label={t("common.wallet")} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ActionRow({
  href,
  label,
  hint,
}: {
  href: string;
  label: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 border-b border-line py-4 transition-colors"
    >
      <span>
        <span className="text-sm font-medium text-ink transition-colors group-hover:text-accent">
          {label}
        </span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
      <svg
        className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
      </svg>
    </Link>
  );
}
