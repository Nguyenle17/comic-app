"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { becomeAuthor } from "@/lib/api/user";
import { ApiError } from "@/lib/api/auth";

export default function AccountPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-bold">You are not signed in</h1>
          <Link
            href="/auth/login"
            className="mt-5 inline-flex rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-950"
          >
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  async function handleBecomeAuthor() {
    setError(null);
    setIsSubmitting(true);

    try {
      await becomeAuthor();
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Unable to update your role. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isAuthor = user.role === "author" || user.role === "admin";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold">My account</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Manage your account and creator access.
      </p>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-2xl font-bold text-white">
              {user.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold">{user.displayName}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
            <span className="mt-2 inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold capitalize text-amber-600 dark:text-amber-400">
              {user.role}
            </span>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {isAuthor ? (
            <>
              <Link
                href="/author/stories/new"
                className="rounded-xl bg-amber-500 px-4 py-3 text-center text-sm font-semibold text-zinc-950"
              >
                Create a story
              </Link>
              <Link
                href="/author/stories/new"
                className="rounded-xl border border-zinc-200 px-4 py-3 text-center text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
              >
                Manage stories
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => void handleBecomeAuthor()}
              disabled={isSubmitting}
              className="rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Become an author"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
