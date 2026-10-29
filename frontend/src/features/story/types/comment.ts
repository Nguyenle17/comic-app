export interface Comment {
  id: number;
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  content: string;
  parentCommentId?: number;
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface Rating {
  id: number;
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  score: number;
  review?: string;
  createdAt: string;
}
