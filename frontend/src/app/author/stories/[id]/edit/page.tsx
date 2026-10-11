"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStory, type ManagedStory } from "@/lib/api/story";
import { ApiError } from "@/lib/api/auth";
import { StoryEditor } from "@/components/story/StoryEditor";

export default function EditStoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const storyId = Number(params.id);
  const hasValidStoryId = Number.isInteger(storyId) && storyId > 0;
  const [story, setStory] = useState<ManagedStory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasValidStoryId) {
      return;
    }

    void getStory(storyId)
      .then(setStory)
      .catch((cause: unknown) => {
        setError(
          cause instanceof ApiError
            ? cause.message
            : "Unable to load the story."
        );
      });
  }, [hasValidStoryId, storyId]);

  if (!hasValidStoryId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          Invalid story ID.
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 text-zinc-500">
        Loading story...
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Edit story</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Update story details or replace the cover image.
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <StoryEditor
          storyId={story.id}
          initialStory={story}
          onSaved={setStory}
          onDeleted={() => router.push("/author/stories/new")}
        />
      </div>
    </main>
  );
}
