"use client";

import { useState } from "react";
import {
  createStory,
  deleteStory,
  updateStory,
  uploadStoryCover,
  type CreateStoryInput,
  type ManagedStory,
} from "@/lib/api/story";
import { ApiError } from "@/lib/api/auth";

interface StoryEditorProps {
  storyId?: number;
  initialStory?: Partial<ManagedStory>;
  onSaved?: (story: ManagedStory) => void;
  onDeleted?: () => void;
}

export function StoryEditor({
  storyId,
  initialStory,
  onSaved,
  onDeleted,
}: StoryEditorProps) {
  const [title, setTitle] = useState(initialStory?.title ?? "");
  const [slug, setSlug] = useState(initialStory?.slug ?? "");
  const [description, setDescription] = useState(
    initialStory?.description ?? ""
  );
  const [storyType, setStoryType] = useState<"text" | "comic">(
    initialStory?.storyType === "comic" ? "comic" : "text"
  );
  const [cover, setCover] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const input: CreateStoryInput = {
        title,
        slug,
        description,
        storyType,
      };

      const story = storyId
        ? await updateStory(storyId, input)
        : await createStory(input);

      const storyWithCover =
        cover && story.id
          ? await uploadStoryCover(story.id, cover)
          : story;

      onSaved?.(storyWithCover);
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError("Unable to save the story. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!storyId || !window.confirm("Are you sure you want to delete this story?")) {
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await deleteStory(storyId);
      onDeleted?.();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause.message
          : "Unable to delete the story. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <input
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Story title"
        className="w-full rounded-lg border p-3"
      />

      <input
        required
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        placeholder="story-slug"
        className="w-full rounded-lg border p-3"
      />

      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Story description"
        rows={5}
        className="w-full rounded-lg border p-3"
      />

      <select
        value={storyType}
        onChange={(event) =>
          setStoryType(event.target.value as "text" | "comic")
        }
        className="w-full rounded-lg border p-3"
      >
        <option value="text">Text story</option>
        <option value="comic">Comic story</option>
      </select>

      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => setCover(event.target.files?.[0] ?? null)}
      />

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-lg bg-amber-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
      >
        {isSaving
          ? "Saving..."
          : storyId
            ? "Update story"
            : "Create story"}
      </button>

      {storyId && (
        <button
          type="button"
          onClick={() => void handleDelete()}
          className="ml-3 rounded-lg border border-red-200 px-4 py-3 font-semibold text-red-600 hover:bg-red-50"
        >
          Delete story
        </button>
      )}
    </form>
  );
}
