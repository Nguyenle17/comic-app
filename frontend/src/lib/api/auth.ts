import type { User, AuthResponse } from "@/types/user";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { SITE_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth-store";
import {
  restoreAccessToken,
  setAccessToken,
} from "@/lib/api/client";

export class ApiError extends Error {
  code: string;
  statusCode: number;

  constructor(
    message: string,
    code = "API_ERROR",
    statusCode = 400
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      body?.message ?? "Yêu cầu không thành công",
      body?.code ?? "API_ERROR",
      response.status
    );
  }

  return body as T;
}

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
