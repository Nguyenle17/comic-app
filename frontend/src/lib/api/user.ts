import type { User } from "@/types/user";
import { SITE_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth-store";
import { ApiError } from "@/lib/api/auth";
import { apiFetch } from "@/lib/api/client";

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

export async function becomeAuthor(): Promise<User> {
  const response = await apiFetch(
    SITE_CONFIG.apiBaseUrl + "/api/v1/users/me/become-author",
    {
      method: "POST",
    }
  );

  const user = await parseResponse<User>(response);
  useAuthStore.getState().setUser(user);
  return user;
}
