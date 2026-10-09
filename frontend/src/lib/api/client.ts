import { SITE_CONFIG } from "@/lib/constants";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch(
    `${SITE_CONFIG.apiBaseUrl}/api/v1/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        accessToken = null;
        return null;
      }

      const data = (await response.json()) as {
        accessToken: string;
      };

      accessToken = data.accessToken;
      return accessToken;
    })
    .catch(() => {
      accessToken = null;
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  hasRetried = false
): Promise<Response> {
  const headers = new Headers(init.headers);

  if (accessToken) {
    headers.set("Authorization", "Bearer " + accessToken);
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status !== 401 || hasRetried) {
    return response;
  }

  const newAccessToken = await refreshAccessToken();

  if (!newAccessToken) {
    return response;
  }

  return apiFetch(input, init, true);
}

export async function restoreAccessToken(): Promise<string | null> {
  return refreshAccessToken();
}
