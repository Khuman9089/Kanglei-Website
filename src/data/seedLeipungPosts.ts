import leipungPostsData from '../../data/leipung_posts.json';

export interface LeipungAuthor {
  id: string;
  name: string;
  avatar_url?: string;
  badge?: string;
  is_verified?: boolean;
  color?: string;
}

export interface LeipungPostItem {
  id: string;
  author: LeipungAuthor;
  content_text: string;
  media_urls?: string[];
  category_tag?: string;
  likes_count: number;
  khurumjari_count?: number;
  comments_count: number;
  shares_count: number;
  is_pinned?: boolean;
  is_hidden?: boolean;
  created_at: string;
}

export const SEED_LEIPUNG_POSTS: LeipungPostItem[] = leipungPostsData as LeipungPostItem[];
