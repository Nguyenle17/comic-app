"use client";

import { useEffect, useState } from "react";
import {
  createStory,
  deleteStory,
  getCategories,
  updateStory,
  uploadStoryCover,
  type CreateStoryInput,
  type ManagedStory,
} from "@/features/story/api";
import type { Category } from "@/features/story/types/story";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";
import { useT } from "@/features/preferences/i18n";
import { useUiStore } from "@/features/preferences/stores/ui-store";

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
  const addToast = useUiStore((state) => state.addToast);
  const [title, setTitle] = useState(initialStory?.title ?? "");
  const [slug, setSlug] = useState(initialStory?.slug ?? "");
  const [description, setDescription] = useState(
    initialStory?.description ?? ""
  );
  const [storyType, setStoryType] = useState<"text" | "comic">(
    initialStory?.storyType === "comic" ? "comic" : "text"
  );
  const [visible, setVisible] = useState(initialStory?.visible ?? true);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [categoryIds, setCategoryIds] = useState<number[]>(
    initialStory?.categories?.map((category) => category.id) ?? []
  );
  const [cover, setCover] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCategories([]);
          addToast({ type: "error", message: t("editor.categoriesLoadError") });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [t, addToast]);

  function toggleCategory(categoryId: number) {
    setCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }

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
        visible,
        categoryIds,
      };

      const story = storyId
        ? await updateStory(storyId, input)
        : await createStory(input);

      const storyWithCover =
        cover && story.id
          ? await uploadStoryCover(story.id, cover)
          : story;

      onSaved?.(storyWithCover);
      addToast({
        type: "success",
        message: t(storyId ? "toast.storyUpdated" : "toast.storyCreated"),
      });
    } catch (cause) {
      const message =
        cause instanceof ApiError ? cause.message : t("editor.saveError");
      setError(message);
      addToast({ type: "error", message });
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
      addToast({ type: "success", message: t("toast.storyDeleted") });
    } catch (cause) {
      const message =
        cause instanceof ApiError ? cause.message : t("editor.deleteError");
      setError(message);
      addToast({ type: "error", message });
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
            aria-describedby="story-slug-hint"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            placeholder={t("editor.slugPlaceholder")}
            className="field font-mono text-xs"
          />
          <p id="story-slug-hint" className="mt-1.5 text-[11px] text-muted">{t("editor.slugHint")}</p>
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

        <fieldset>
          <legend className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("editor.categories")}
          </legend>
          <p className="mb-2 text-[11px] text-muted">
            {t("editor.categoriesHint")}
          </p>
          {categories === null ? (
            <p className="text-xs text-muted">{t("common.loading")}</p>
          ) : categories.length === 0 ? (
            <p className="text-xs text-muted">{t("editor.noCategories")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {categories.map((category) => (
                <label key={category.id} className="cursor-pointer">
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="peer sr-only"
                  />
                  <span className="flex min-h-11 items-center border border-line bg-surface px-3 text-xs font-medium text-ink-soft transition-colors hover:border-line-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-accent-strong peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      </div>

      <aside className="space-y-6 border-t border-line pt-6 lg:sticky lg:top-24 lg:self-start lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
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
          <label htmlFor="story-visibility" className="mb-1.5 block text-xs font-medium text-ink-soft">
            {t("editor.visibility")}
          </label>
          <select
            id="story-visibility"
            value={visible ? "visible" : "hidden"}
            onChange={(event) => setVisible(event.target.value === "visible")}
            className="field"
          >
            <option value="visible">{t("editor.visible")}</option>
            <option value="hidden">{t("editor.hidden")}</option>
          </select>
          <p className="mt-1.5 text-[11px] text-muted">
            {t("editor.visibilityHint")}
          </p>
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
          <Button
            type="submit"
            variant="accent"
            size="lg"
            isLoading={isSaving}
            className="w-full"
          >
            {isSaving
              ? t("editor.saving")
              : storyId
                ? t("editor.update")
                : t("editor.create")}
          </Button>

          {storyId && (
            <Button
              type="button"
              variant="danger"
              size="lg"
              disabled={isSaving}
              onClick={() => void handleDelete()}
              className="w-full"
            >
              {t("editor.delete")}
            </Button>
          )}
        </div>
      </aside>
    </form>
  );
}
