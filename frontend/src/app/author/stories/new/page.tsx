"use client";

import { useRouter } from "next/navigation";
import { StoryEditor } from "@/components/story/StoryEditor";

export default function NewStoryPage() {
  const router = useRouter();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Create a story</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Add story details and upload a cover image.
      </p>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <StoryEditor
          onSaved={(story) => {
            router.push("/author/stories/" + story.id + "/edit");
          }}
        />
      </div>
    </main>
  );
}
