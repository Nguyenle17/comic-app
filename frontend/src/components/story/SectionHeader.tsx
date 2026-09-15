import Link from "next/link";

export function SectionHeader({
  title,
  subtitle,
  href,
  actionLabel = "Xem tất cả",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-50">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-xs font-medium text-amber-600 hover:text-amber-500 sm:text-sm dark:text-amber-400"
        >
          {actionLabel} →
        </Link>
      )}
    </div>
  );
}