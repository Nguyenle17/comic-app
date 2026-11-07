"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStory, type ManagedStory } from "@/features/story/api";
import { ApiError } from "@/lib/api-client";
import { StoryEditor } from "@/features/story/components/StoryEditor";
import { useT } from "@/features/preferences/i18n";

export default function EditStoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const t = useT();
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
          cause instanceof ApiError ? cause.message : t("stories.loadError")
        );
      });
  }, [hasValidStoryId, storyId, t]);

  if (!hasValidStoryId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p role="alert" className="border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm text-accent-strong">
          {t("stories.invalidId")}
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p role="alert" className="border-l-2 border-accent bg-accent-soft px-4 py-3 text-sm text-accent-strong">
          {error}
        </p>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm text-muted">{t("stories.loading")}</p>
      </main>
    );
  }

  return (
    <main className="shell py-12">
      <header className="border-b border-line pb-6">
        <p className="rule-label">{t("account.manageStories")}</p>
        <h1 className="mt-3 text-balance font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("stories.editTitle")}
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-sm leading-7 text-ink-soft">
          {t("stories.editSubtitle")}
        </p>
      </header>

      <div className="mt-8">
        <StoryEditor
          storyId={story.id}
          initialStory={story}
          onSaved={setStory}
          onDeleted={() => router.push("/author/stories")}
        />
      </div>
    </main>
  );
}
