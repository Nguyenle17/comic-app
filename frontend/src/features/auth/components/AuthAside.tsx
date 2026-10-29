"use client";

import { useT } from "@/features/preferences/i18n";

const FEATURES = [
  "auth.asideFeature1",
  "auth.asideFeature2",
  "auth.asideFeature3",
];

export function AuthAside() {
  const t = useT();

  return (
    <aside className="hidden flex-col justify-between border-r border-line py-12 pl-2 pr-12 lg:flex">
      <div>
        <p className="rule-label">{t("auth.asideKicker")}</p>
        <h2 className="mt-6 font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-ink">
          {t("auth.asideTitle")}
        </h2>
        <p className="mt-6 max-w-sm text-sm leading-7 text-ink-soft">
          {t("auth.asideDesc")}
        </p>
      </div>

      <ol className="mt-12 border-t border-line">
        {FEATURES.map((key, index) => (
          <li
            key={key}
            className="flex items-baseline gap-4 border-b border-line py-3 text-sm text-ink-soft"
          >
            <span className="font-serif text-base text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            {t(key)}
          </li>
        ))}
      </ol>
    </aside>
  );
}
