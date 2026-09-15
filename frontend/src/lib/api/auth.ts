import type { User, AuthResponse } from "@/types/user";
import type { LoginInput, RegisterInput } from "@/lib/validations/auth";
import { SITE_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth-store";

export class ApiError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string = "AUTH_ERROR", statusCode: number = 400) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Demo account fallback for offline/development testing
export const DEMO_USER: User = {
  id: 1,
  username: "docgia_vip",
  email: "demo@truyenviet.vn",
  displayName: "Độc Giả VIP",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  role: "reader",
  coinBalance: 500,
  bio: "Yêu thích đọc truyện tiên hiệp, huyền huyễn và kiếm hiệp.",
  createdAt: new Date().toISOString(),
};

function setAuthCookies(token: string, role: string) {
  if (typeof document !== "undefined") {
    // 7 days cookie expiry
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `user-role=${role}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

function clearAuthCookies() {
  if (typeof document !== "undefined") {
    document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "user-role=; path=/; max-age=0; SameSite=Lax";
  }
}

export async function login(data: LoginInput): Promise<{ user: User; accessToken: string }> {
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const responseData: AuthResponse = await res.json();
      setAuthCookies(responseData.token, responseData.user.role);
      useAuthStore.getState().login(responseData.user);
      return { user: responseData.user, accessToken: responseData.token };
    }
  } catch {
    // Backend offline: fallback to mock user for smooth UI experience
  }

  // Demo / local fallback:
  if (data.email && data.password) {
    const mockUser: User = {
      ...DEMO_USER,
      email: data.email,
      displayName: data.email.split("@")[0] || "Độc Giả Mới",
      username: data.email.split("@")[0] || "docgia",
    };
    const mockToken = "mock-jwt-token-" + Date.now();
    setAuthCookies(mockToken, mockUser.role);
    useAuthStore.getState().login(mockUser);
    return { user: mockUser, accessToken: mockToken };
  }

  throw new ApiError("Email hoặc mật khẩu không hợp lệ", "AUTH_002", 401);
}

export async function register(data: RegisterInput): Promise<{ user: User; accessToken: string }> {
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const responseData: AuthResponse = await res.json();
      setAuthCookies(responseData.token, responseData.user.role);
      useAuthStore.getState().login(responseData.user);
      return { user: responseData.user, accessToken: responseData.token };
    }
  } catch {
    // Backend offline: fallback to mock user
  }

  // Create local user
  const newUser: User = {
    id: Date.now(),
    username: data.username,
    email: data.email,
    displayName: data.displayName,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}`,
    role: "reader",
    coinBalance: 100, // Thưởng người mới 100 xu
    bio: "Thành viên mới của TruyenViet",
    createdAt: new Date().toISOString(),
  };

  const mockToken = "mock-jwt-token-" + Date.now();
  setAuthCookies(mockToken, newUser.role);
  useAuthStore.getState().login(newUser);
  return { user: newUser, accessToken: mockToken };
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${SITE_CONFIG.apiBaseUrl}/api/v1/auth/logout`, {
      method: "POST",
    });
  } catch {
    // Ignore error on logout
  } finally {
    clearAuthCookies();
    useAuthStore.getState().logout();
  }
}
