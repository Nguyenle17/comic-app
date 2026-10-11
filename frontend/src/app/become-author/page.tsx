"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { becomeAuthor } from "@/lib/api/user";
import { ApiError } from "@/lib/api/auth";

export default function BecomeAuthorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBecomeAuthor() {
    setError(null);
    setIsSubmitting(true);

    try {
      await becomeAuthor();
      router.push("/author/stories/new");
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

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-16">
      <div className="rounded-2xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-bold">Become an author</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Become an author to create stories, upload cover images, and manage
          your own content.
        </p>

        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => void handleBecomeAuthor()}
          disabled={isSubmitting}
          className="mt-7 w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Become an author"}
        </button>
      </div>
    </main>
  );
}
