"use client";

import { mockStories } from "@/features/story/data/mock-stories";

export function useHomeStories() {
  const hero = mockStories[1] || mockStories[0];

  const hotStories = [...mockStories]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6);

  const updatedStories = [...mockStories]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 6);

  const originalStories = mockStories
    .filter((s) => s.storyType === "original")
    .slice(0, 6);

  return { hero, hotStories, updatedStories, originalStories };
}
