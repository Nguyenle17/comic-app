"use client";

import { useUiStore } from "@/features/preferences/stores/ui-store";
import { cn } from "@/lib/utils";

const styles = {
  success:
    "border-emerald-600/40 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
  error: "border-accent/40 bg-accent-soft text-accent-strong",
  warning:
    "border-amber-500/40 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
  info: "border-line bg-surface text-ink",
};

export function Toaster() {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <button
          key={toast.id}
          type="button"
          onClick={() => removeToast(toast.id)}
          className={cn(
            "pointer-events-auto flex w-full items-start gap-2.5 rounded-sm border px-4 py-3 text-left text-xs font-medium shadow-lg shadow-black/10 transition-opacity hover:opacity-90",
            styles[toast.type]
          )}
        >
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
          <span
            role={toast.type === "error" ? "alert" : "status"}
            aria-atomic="true"
            className="flex-1 leading-5"
          >
            {toast.message}
          </span>
          <span aria-hidden="true" className="text-sm leading-4 opacity-60">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}
