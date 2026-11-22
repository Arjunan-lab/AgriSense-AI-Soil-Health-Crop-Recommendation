import { apiClient } from './client';

export interface PostAuthor {
  id: number;
  name: string;
  username: string;
  avatar: string;
  role: string;
  language: string;
  location: string;
  followers: number;
}

export interface PostItem {
  id: number;
  group_id?: number | null;
  community_name?: string | null;
  author: PostAuthor;
  title?: string | null;
  content: string;
  image?: string | null;
  tags: string[];
  likes: number;
  comments: number;
  bookmarks: number;
  isLiked: boolean;
  isSaved: boolean;
  time: string;
  raw_created_at: string;
  is_edited?: boolean;
  is_pinned?: boolean;
}

export interface PaginatedFeed {
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: PostItem[];
}

export interface CommunityGroupItem {
  id: number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  icon?: string | null;
  member_count: number;
  post_count: number;
  is_joined: boolean;
  created_at: string;
}

export interface CommentItem {
  id: number;
  post_id: number;
  user_id: number;
  user_name: string;
  user_avatar: string;
  comment: string;
  parent_id?: number | null;
  created_at: string;
  raw_created_at: string;
  replies?: CommentItem[];
}

export interface CommunityAnalyticsData {
  total_posts: number;
  posts_today: number;
  total_comments: number;
  total_likes: number;
  total_communities: number;
  most_active_community?: string | null;
  most_active_users: { user_id: number; username: string; posts_count: number }[];
  top_tags: string[];
  most_discussed_topics: string[];
  most_active_language: string;
}

export interface UserCommunityProfileData {
  user_id: number;
  username: string;
  role: string;
  language: string;
  location: string;
  avatar: string;
  total_posts: number;
  total_likes: number;
  total_comments: number;
  communities_joined: number;
  recent_posts: PostItem[];
}

export const communityAPI = {
  getFeed: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    group_id?: number;
    tag?: string;
    user_id?: number;
  }): Promise<PaginatedFeed> => {
    const { data } = await apiClient.get('/api/community/feed', { params });
    return data;
  },

  createPost: async (formData: FormData): Promise<PostItem> => {
    const { data } = await apiClient.post('/api/community/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getPostDetails: async (postId: number): Promise<PostItem> => {
    const { data } = await apiClient.get(`/api/community/posts/${postId}`);
    return data;
  },

  editPost: async (postId: number, payload: { title?: string; content?: string; image_url?: string; tags?: string[] }): Promise<PostItem> => {
    const { data } = await apiClient.put(`/api/community/posts/${postId}`, payload);
    return data;
  },

  deletePost: async (postId: number): Promise<{ message: string; id: number }> => {
    const { data } = await apiClient.delete(`/api/community/posts/${postId}`);
    return data;
  },

  toggleLike: async (postId: number): Promise<{ post_id: number; isLiked: boolean; likes: number }> => {
    const { data } = await apiClient.post(`/api/community/posts/${postId}/like`);
    return data;
  },

  toggleBookmark: async (postId: number): Promise<{ post_id: number; isSaved: boolean; bookmarks: number }> => {
    const { data } = await apiClient.post(`/api/community/posts/${postId}/bookmark`);
    return data;
  },

  getBookmarks: async (params?: { page?: number; limit?: number }): Promise<PaginatedFeed> => {
    const { data } = await apiClient.get('/api/community/bookmarks', { params });
    return data;
  },

  getComments: async (postId: number): Promise<CommentItem[]> => {
    const { data } = await apiClient.get(`/api/community/comments/post/${postId}`);
    return data;
  },

  addComment: async (payload: { post_id: number; comment: string; parent_id?: number }): Promise<CommentItem> => {
    const { data } = await apiClient.post('/api/community/comments', payload);
    return data;
  },

  getGroups: async (search?: string): Promise<CommunityGroupItem[]> => {
    const { data } = await apiClient.get('/api/community/groups', { params: { search } });
    return data;
  },

  getTrendingGroups: async (limit: number = 10): Promise<CommunityGroupItem[]> => {
    const { data } = await apiClient.get('/api/community/groups/trending', { params: { limit } });
    return data;
  },

  getGroupDetails: async (groupId: number): Promise<{ group: CommunityGroupItem; members: any[]; recent_posts: PostItem[] }> => {
    const { data } = await apiClient.get(`/api/community/group/${groupId}`);
    return data;
  },

  toggleJoinGroup: async (groupId: number): Promise<{ group_id: number; is_joined: boolean; member_count: number }> => {
    const { data } = await apiClient.post(`/api/community/groups/${groupId}/join`);
    return data;
  },

  getUserProfile: async (userId: number): Promise<UserCommunityProfileData> => {
    const { data } = await apiClient.get(`/api/community/profile/${userId}`);
    return data;
  },

  getAnalytics: async (): Promise<CommunityAnalyticsData> => {
    const { data } = await apiClient.get('/api/community/analytics');
    return data;
  },

  reportPost: async (postId: number, payload: { reason: string; description?: string; comment_id?: number }) => {
    const { data } = await apiClient.post(`/api/community/posts/${postId}/report`, payload);
    return data;
  },
};
