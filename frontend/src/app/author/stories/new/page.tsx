"use client";

import { useRouter } from "next/navigation";
import { StoryEditor } from "@/features/story/components/StoryEditor";
import { useT } from "@/features/preferences/i18n";

export default function NewStoryPage() {
  const router = useRouter();
  const t = useT();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-line pb-6">
        <p className="rule-label">{t("common.createStory")}</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {t("stories.newTitle")}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-ink-soft">
          {t("stories.newSubtitle")}
        </p>
      </header>

      <div className="mt-8">
        <StoryEditor
          onSaved={(story) => {
            router.push("/author/stories/" + story.id + "/edit");
          }}
        />
      </div>
    </main>
  );
}
