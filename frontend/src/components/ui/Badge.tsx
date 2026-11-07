import { cn } from "@/lib/utils";

type Variant = "text" | "comic" | "original" | "hot" | "new" | "default";

const styles: Record<Variant, string> = {
  text: "border-line text-ink-soft",
  comic: "border-line-strong text-ink",
  original: "border-accent/40 text-accent",
  hot: "border-accent bg-accent text-surface",
  new: "border-accent text-accent",
  default: "border-line text-ink-soft",
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
        "inline-flex items-center border px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em]",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
