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

export const isAuthorRole = (role: UserRole) =>
  role === 'author' || role === 'admin';
