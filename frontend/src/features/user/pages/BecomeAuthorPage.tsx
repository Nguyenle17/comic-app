"use client";

import { Button } from "@/components/ui/Button";
import { useT } from "@/features/preferences/i18n";
import { useBecomeAuthor } from "@/features/user/hooks/useBecomeAuthor";

const BENEFITS = [
  "home.ctaStepWrite",
  "home.ctaStepPublish",
  "home.ctaStepEarn",
];

export default function BecomeAuthorPage() {
  const t = useT();
  const { isSubmitting, error, onSubmit } =
    useBecomeAuthor("/author/stories/new");

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="rule-label">{t("home.ctaBadge")}</p>
        <h1 className="mt-4 text-balance font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("becomeAuthor.title")}
        </h1>
        <p className="mt-4 text-pretty text-sm leading-7 text-ink-soft">
          {t("becomeAuthor.desc")}
        </p>
      </div>

      <div className="mt-12 grid gap-10 border-t border-line pt-8 lg:grid-cols-[1fr_320px] lg:gap-16">
        <ol>
          {BENEFITS.map((key, index) => (
            <li
              key={key}
              className="flex items-baseline gap-4 border-b border-line py-4 text-sm leading-6 text-ink-soft"
            >
              <span className="font-serif text-lg text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              {t(key)}
            </li>
          ))}
        </ol>

        <div className="border border-line bg-surface p-6">
          {error && (
            <p
              role="alert"
              className="mb-4 border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-xs text-accent-strong"
            >
              {error}
            </p>
          )}
          <p className="text-xs leading-6 text-ink-soft">{t("becomeAuthor.ctaNote")}</p>
          <Button
            type="button"
            variant="accent"
            size="lg"
            isLoading={isSubmitting}
            onClick={() => void onSubmit()}
            className="mt-5 w-full"
          >
            {isSubmitting ? t("common.updating") : t("common.becomeAuthor")}
          </Button>
        </div>
      </div>
    </main>
  );
}
