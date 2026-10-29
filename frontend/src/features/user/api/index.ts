import type { User } from "@/types/user";
import { SITE_CONFIG } from "@/lib/site-config";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { apiFetch, parseResponse } from "@/lib/api-client";

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
