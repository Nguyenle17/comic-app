export interface ChapterImage {
  url: string;
  pageNumber: number;
  width?: number;
  height?: number;
}

export interface Chapter {
  id: number;
  storyId: number;
  chapterNumber: number;
  title: string;
  isFree: boolean;
  priceCoin: number;
  isUnlocked: boolean;
  viewCount: number;
  publishedAt: string;
  content?: string;
  images?: ChapterImage[];
  wordCount?: number;
}

export interface ChapterListItem {
  id: number;
  storyId: number;
  chapterNumber: number;
  title: string;
  isFree: boolean;
  priceCoin: number;
  isUnlocked: boolean;
  viewCount: number;
  publishedAt: string;
  isRead?: boolean;
}
