"use client";

import Link from "next/link";
import { useT } from "@/features/preferences/i18n";

export function SectionHeader({
  title,
  subtitle,
  href,
  actionLabel,
  index,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
  index?: string;
}) {
  const t = useT();
  return (
    <div className="mb-5 border-t border-line pt-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <div className="flex items-center gap-3">
            {index && <span className="font-serif text-sm font-semibold tabular-nums text-accent">{index}</span>}
            <h2 className="text-balance font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="mt-1.5 max-w-xl text-pretty text-xs leading-6 text-ink-soft sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
        {href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center self-start border-b border-line-strong pb-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            {actionLabel ?? t("section.viewAll")}
          </Link>
        )}
      </div>
    </div>
  );
}
