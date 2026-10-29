import type { StoryType } from "@/features/story/types/story";
import { SITE_CONFIG } from "@/lib/site-config";
import { ApiError, apiFetch, parseResponse } from "@/lib/api-client";

export interface ManagedStory {
  id: number;
  title: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  storyType: StoryType;
  status: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoryInput {
  title: string;
  slug: string;
  description?: string;
  storyType: StoryType;
}

export type UpdateStoryInput = Partial<CreateStoryInput>;

export async function getStory(storyId: number): Promise<ManagedStory> {
  const response = await apiFetch(
    SITE_CONFIG.apiBaseUrl + "/api/v1/stories/" + storyId
  );

  return parseResponse<ManagedStory>(response);
}

export async function createStory(
  input: CreateStoryInput
): Promise<ManagedStory> {
  const response = await apiFetch(
    SITE_CONFIG.apiBaseUrl + "/api/v1/stories",
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
    SITE_CONFIG.apiBaseUrl + "/api/v1/stories/" + storyId,
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
    SITE_CONFIG.apiBaseUrl + "/api/v1/stories/" + storyId + "/cover",
    {
      method: "POST",
      body: formData,
    }
  );

  return parseResponse<ManagedStory>(response);
}

export async function deleteStory(storyId: number): Promise<void> {
  const response = await apiFetch(
    SITE_CONFIG.apiBaseUrl + "/api/v1/stories/" + storyId,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(
      body?.message ?? "Unable to delete the story",
      body?.code ?? "API_ERROR",
      response.status
    );
  }
}
