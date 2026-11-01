"use client";

import Link from "next/link";
import { AuthorStoryManager } from "@/features/story/components/AuthorStoryManager";
import { useT } from "@/features/preferences/i18n";

export default function AuthorStoriesPage() {
  const t = useT();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="rule-label">{t("account.creatorSection")}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {t("authorStories.title")}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink-soft">
            {t("authorStories.subtitle")}
          </p>
        </div>

        <Link
          href="/author/stories/new"
          className="inline-flex h-11 shrink-0 items-center justify-center rounded-sm bg-accent px-6 text-sm font-semibold text-surface transition-colors hover:bg-accent-strong"
        >
          {t("authorStories.new")}
        </Link>
      </header>

      <div className="mt-8">
        <AuthorStoryManager />
      </div>
    </main>
  );
}
