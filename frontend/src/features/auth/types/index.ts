import type { User } from "@/types/user";

export interface AuthResponse {
  user: User;
  accessToken: string;
}
