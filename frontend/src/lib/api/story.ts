import type { StoryType } from "@/types/story";
import { SITE_CONFIG } from "@/lib/constants";
import { ApiError } from "@/lib/api/auth";
import { apiFetch } from "@/lib/api/client";

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

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      body?.message ?? "The request failed",
      body?.code ?? "API_ERROR",
      response.status
    );
  }

  return body as T;
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
