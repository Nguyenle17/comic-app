"use client";

import { useState } from "react";
import {
  createStory,
  deleteStory,
  updateStory,
  uploadStoryCover,
  type CreateStoryInput,
  type ManagedStory,
} from "@/features/story/api";
import { ApiError } from "@/lib/api-client";
import { useT } from "@/features/preferences/i18n";

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
  const t = useT();
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
      setError(
        cause instanceof ApiError ? cause.message : t("editor.saveError")
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!storyId || !window.confirm(t("editor.confirmDelete"))) {
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await deleteStory(storyId);
      onDeleted?.();
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : t("editor.deleteError")
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_280px] lg:gap-14">
      <div className="space-y-6">
        {error && (
          <p
            role="alert"
            className="border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-xs leading-5 text-accent-strong"
          >
            {error}
          </p>
        )}

        <div>
          <label htmlFor="story-title" className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("editor.title")}
          </label>
          <input
            id="story-title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder={t("editor.titlePlaceholder")}
            className="field"
          />
        </div>

        <div>
          <label htmlFor="story-slug" className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("editor.slug")}
          </label>
          <input
            id="story-slug"
            required
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder={t("editor.slugPlaceholder")}
            className="field font-mono text-xs"
          />
          <p className="mt-1.5 text-[11px] text-muted">{t("editor.slugHint")}</p>
        </div>

        <div>
          <label htmlFor="story-description" className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("editor.description")}
          </label>
          <textarea
            id="story-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t("editor.descriptionPlaceholder")}
            rows={6}
            className="field h-auto min-h-40 resize-y py-3 leading-6"
          />
        </div>
      </div>

      <aside className="space-y-6 border-t border-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        <div>
          <label htmlFor="story-type" className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("editor.type")}
          </label>
          <select
            id="story-type"
            value={storyType}
            onChange={(event) =>
              setStoryType(event.target.value as "text" | "comic")
            }
            className="field"
          >
            <option value="text">{t("editor.typeText")}</option>
            <option value="comic">{t("editor.typeComic")}</option>
          </select>
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("editor.cover")}
          </span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setCover(event.target.files?.[0] ?? null)}
            className="block w-full text-xs text-ink-soft file:mr-3 file:border file:border-line file:bg-paper file:px-3 file:py-2 file:text-xs file:font-medium file:text-ink hover:file:border-line-strong"
          />
          <p className="mt-1.5 truncate text-[11px] text-muted">
            {cover ? cover.name : t("editor.coverHint")}
          </p>
        </div>

        <div className="space-y-2 border-t border-line pt-5">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 w-full items-center justify-center rounded-sm bg-accent px-5 text-sm font-semibold text-surface transition-colors hover:bg-accent-strong disabled:opacity-50"
          >
            {isSaving
              ? t("editor.saving")
              : storyId
                ? t("editor.update")
                : t("editor.create")}
          </button>

          {storyId && (
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={isSaving}
              className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-accent px-5 text-sm font-medium text-accent transition-colors hover:bg-accent-soft disabled:opacity-50"
            >
              {t("editor.delete")}
            </button>
          )}
        </div>
      </aside>
    </form>
  );
}
