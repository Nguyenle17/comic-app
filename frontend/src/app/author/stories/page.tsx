"use client";

import Link from "next/link";
import { AuthorStoryManager } from "@/features/story/components/AuthorStoryManager";
import { buttonStyles } from "@/components/ui/Button";
import { useT } from "@/features/preferences/i18n";

export default function AuthorStoriesPage() {
  const t = useT();

  return (
    <main className="shell py-12">
      <header className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="rule-label">{t("account.creatorSection")}</p>
          <h1 className="mt-3 text-balance font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            {t("authorStories.title")}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-sm leading-7 text-ink-soft">
            {t("authorStories.subtitle")}
          </p>
        </div>

        <Link
          href="/author/stories/new"
          className={buttonStyles({ variant: "accent", className: "h-11 shrink-0" })}
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
