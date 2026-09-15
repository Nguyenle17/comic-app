export type NotificationType = 'new_chapter' | 'comment_reply' | 'transaction' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
