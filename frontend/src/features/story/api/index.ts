import type { Category, StoryType } from "@/features/story/types/story";
import { SITE_CONFIG } from "@/lib/site-config";
import { apiFetch, parseResponse } from "@/lib/api-client";

const STORIES = SITE_CONFIG.apiBaseUrl + "/api/v1/stories";
const CATEGORIES = SITE_CONFIG.apiBaseUrl + "/api/v1/categories";

export interface ManagedStory {
  id: number;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  storyType: StoryType;
  status: string;
  visible: boolean;
  categories: Category[];
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoryInput {
  title: string;
  slug: string;
  description?: string;
  storyType: StoryType;
  visible?: boolean;
  categoryIds?: number[];
}

export type UpdateStoryInput = Partial<CreateStoryInput>;

export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch(CATEGORIES);

  return parseResponse<Category[]>(response);
}

export async function getMyStories(): Promise<ManagedStory[]> {
  const response = await apiFetch(STORIES + "/mine");

  return parseResponse<ManagedStory[]>(response);
}

export async function getStory(storyId: number): Promise<ManagedStory> {
  const response = await apiFetch(
    STORIES + "/" + storyId
  );

  return parseResponse<ManagedStory>(response);
}

export async function createStory(
  input: CreateStoryInput
): Promise<ManagedStory> {
  const response = await apiFetch(
    STORIES,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...input,
        storyType: input.storyType.toUpperCase(),
      }),
    }
  );

  return parseResponse<ManagedStory>(response);
}

export async function updateStory(
  storyId: number,
  input: UpdateStoryInput
): Promise<ManagedStory> {
  const response = await apiFetch(
    STORIES + "/" + storyId,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...input,
        storyType: input.storyType?.toUpperCase(),
      }),
    }
  );

  return parseResponse<ManagedStory>(response);
}

export async function uploadStoryCover(
  storyId: number,
  file: File
): Promise<ManagedStory> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiFetch(
    STORIES + "/" + storyId + "/cover",
    {
      method: "POST",
      body: formData,
    }
  );

  return parseResponse<ManagedStory>(response);
}

export async function deleteStory(storyId: number): Promise<void> {
  await parseResponse<void>(
    await apiFetch(STORIES + "/" + storyId, { method: "DELETE" })
  );
}
