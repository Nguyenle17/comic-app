"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  deleteStory,
  getMyStories,
  updateStory,
  type ManagedStory,
} from "@/features/story/api";
import { useLanguage, useT } from "@/features/preferences/i18n";
import { useUiStore } from "@/features/preferences/stores/ui-store";
import { ApiError } from "@/lib/api-client";
import { SITE_CONFIG } from "@/lib/site-config";
import { formatTimeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonStyles } from "@/components/ui/Button";

const coverUrl = (url?: string) =>
  url?.startsWith("/") ? SITE_CONFIG.apiBaseUrl + url : url ?? null;

export function AuthorStoryManager() {
  const t = useT();
  const language = useLanguage();
  const addToast = useUiStore((state) => state.addToast);
  const [stories, setStories] = useState<ManagedStory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMyStories()
      .then((data) => {
        if (!cancelled) {
          setStories(data);
        }
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return;
        }
        setStories([]);
        const message =
          cause instanceof ApiError
            ? cause.message
            : t("authorStories.loadError");
        setError(message);
        addToast({ type: "error", message });
      });

    return () => {
      cancelled = true;
    };
  }, [t, addToast]);

  async function handleDelete(story: ManagedStory) {
    if (!window.confirm(t("authorStories.confirmDelete"))) {
      return;
    }

    setError(null);
    setDeletingId(story.id);

    try {
      await deleteStory(story.id);
      setStories((current) =>
        current ? current.filter((item) => item.id !== story.id) : current
      );
      addToast({ type: "success", message: t("toast.storyDeleted") });
    } catch (cause) {
      const message =
        cause instanceof ApiError
          ? cause.message
          : t("authorStories.deleteError");
      setError(message);
      addToast({ type: "error", message });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggleVisibility(story: ManagedStory) {
    setError(null);
    setTogglingId(story.id);

    try {
      const updated = await updateStory(story.id, { visible: !story.visible });
      setStories((current) =>
        current
          ? current.map((item) => (item.id === story.id ? updated : item))
          : current
      );
      addToast({ type: "success", message: t("toast.storyUpdated") });
    } catch (cause) {
      const message =
        cause instanceof ApiError
          ? cause.message
          : t("authorStories.toggleError");
      setError(message);
      addToast({ type: "error", message });
    } finally {
      setTogglingId(null);
    }
  }

  if (stories === null) {
    return (
      <div className="pt-2" aria-busy="true">
        <span className="sr-only">{t("common.loading")}</span>
        <ul className="animate-pulse">
          {[0, 1, 2].map((row) => (
            <li key={row} className="flex gap-4 border-b border-line py-5">
              <div className="h-24 w-16 shrink-0 bg-line/60" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-5 w-2/3 bg-line/60" />
                <div className="h-3 w-1/3 bg-line/40" />
                <div className="h-3 w-1/4 bg-line/40" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="pt-2">
      {error && (
        <p
          role="alert"
          className="mb-6 border-l-2 border-accent bg-accent-soft px-3 py-2.5 text-xs text-accent-strong"
        >
          {error}
        </p>
      )}

      {stories.length === 0 ? (
        <div className="border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
          <p className="font-serif text-xl font-semibold text-ink">
            {t("authorStories.empty")}
          </p>
          <Link
            href="/author/stories/new"
            className={buttonStyles({ variant: "accent", className: "mt-5" })}
          >
            {t("authorStories.emptyCta")}
          </Link>
        </div>
      ) : (
        <ul>
          {stories.map((story) => {
            const cover = coverUrl(story.coverImageUrl);
            const isComic = story.storyType === "comic";

            return (
              <li
                key={story.id}
                className="grid grid-cols-[4rem_1fr] items-start gap-x-4 gap-y-3 border-b border-line py-5 transition-colors hover:bg-surface sm:flex sm:items-center sm:gap-4"
              >
                <div className="h-24 w-16 shrink-0 overflow-hidden border border-line bg-paper">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={story.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center font-serif text-2xl text-muted">
                      {story.title.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={"/author/stories/" + story.id + "/edit"}
                      title={story.title}
                      className="truncate font-serif text-lg font-semibold text-ink transition-colors hover:text-accent"
                    >
                      {story.title}
                    </Link>
                    <Badge variant={isComic ? "comic" : "text"}>
                      {isComic ? t("story.comic") : t("story.text")}
                    </Badge>
                    {story.categories.map((category) => (
                      <Badge key={category.id}>{category.name}</Badge>
                    ))}
                    <Badge
                      variant={
                        story.status === "completed" ? "original" : "default"
                      }
                    >
                      {story.status === "completed"
                        ? t("authorStories.completed")
                        : t("authorStories.ongoing")}
                    </Badge>
                    <Badge variant={story.visible ? "original" : "default"}>
                      {story.visible
                        ? t("authorStories.visible")
                        : t("authorStories.hidden")}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate font-mono text-[11px] text-muted">
                    /{story.slug}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {t("authorStories.updated", {
                      time: formatTimeAgo(story.updatedAt, language),
                    })}
                  </p>
                </div>

                <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-1 sm:ml-auto sm:shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={togglingId === story.id}
                    onClick={() => void handleToggleVisibility(story)}
                  >
                    {story.visible
                      ? t("authorStories.hide")
                      : t("authorStories.show")}
                  </Button>
                  <Link
                    href={"/author/stories/" + story.id + "/edit"}
                    className={buttonStyles({ variant: "secondary", size: "sm" })}
                  >
                    {t("authorStories.edit")}
                  </Link>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    disabled={deletingId === story.id}
                    onClick={() => void handleDelete(story)}
                  >
                    {t("authorStories.delete")}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
