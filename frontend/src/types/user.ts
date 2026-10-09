export type UserRole = 'reader' | 'author' | 'moderator' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  coinBalance: number;
  bio?: string;
  createdAt: string;
}

export interface PublicUserProfile {
  id: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  storyCount: number;
  totalViews: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
