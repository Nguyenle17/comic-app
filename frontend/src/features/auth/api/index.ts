import type { User } from "@/types/user";
import type { AuthResponse } from "@/features/auth/types";
import type { LoginInput, RegisterInput } from "@/features/auth/schemas/auth";
import { SITE_CONFIG } from "@/lib/site-config";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import { parseResponse, restoreAccessToken, setAccessToken } from "@/lib/api-client";

export async function login(
  data: LoginInput
): Promise<{ user: User; accessToken: string }> {
  const response = await fetch(
    SITE_CONFIG.apiBaseUrl + "/api/v1/auth/login",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        remember: data.remember ?? true,
      }),
    }
  );

  const responseData = await parseResponse<AuthResponse>(response);
  setAccessToken(responseData.accessToken);
  useAuthStore.getState().login(responseData.user);

  return {
    user: responseData.user,
    accessToken: responseData.accessToken,
  };
}

export async function register(
  data: RegisterInput
): Promise<{ user: User; accessToken: string }> {
  const response = await fetch(
    SITE_CONFIG.apiBaseUrl + "/api/v1/auth/register",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      }),
    }
  );

  const responseData = await parseResponse<AuthResponse>(response);
  setAccessToken(responseData.accessToken);
  useAuthStore.getState().login(responseData.user);

  return {
    user: responseData.user,
    accessToken: responseData.accessToken,
  };
}

export async function restoreSession(): Promise<void> {
  try {
    const token = await restoreAccessToken();

    if (!token) {
      useAuthStore.getState().logout();
    }
  } finally {
    useAuthStore.getState().initialize();
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(
      SITE_CONFIG.apiBaseUrl + "/api/v1/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
  } finally {
    setAccessToken(null);
    useAuthStore.getState().logout();
  }
}
