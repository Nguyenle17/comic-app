export type StoryType = 'text' | 'comic' | 'original';
export type StoryStatus = 'ongoing' | 'completed' | 'paused' | 'dropped';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  storyCount?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Story {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  storyType: StoryType;
  status: StoryStatus;
  author: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
  categories: Category[];
  tags: Tag[];
  viewCount: number;
  followCount: number;
  ratingAvg: number;
  ratingCount: number;
  chapterCount: number;
  latestChapterNumber?: number;
  latestChapterTitle?: string;
  isHot?: boolean;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoryListItem extends Omit<Story, 'description'> {
  description?: string;
}
