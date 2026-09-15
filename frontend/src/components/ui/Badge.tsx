import { cn } from "@/lib/utils";

type Variant = "text" | "comic" | "original" | "hot" | "new" | "default";

const styles: Record<Variant, string> = {
  text: "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/30",
  comic: "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-violet-500/30",
  original: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/30",
  hot: "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30",
  new: "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-rose-500/30",
  default: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300 ring-zinc-500/20",
};

export function Badge({
  variant = "default",
  children,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}