/**
 * Community Service
 * Forum, discussion posts, comments, and community interactions.
 */

import { fetchPosts, createPost, fetchPostById, toggleLike, addComment } from '../api/community';

export const CommunityService = {
  async getPosts(category?: string, query?: string) {
    return fetchPosts(category, query);
  },

  async getPostById(id: string | number) {
    return fetchPostById(id);
  },

  async createNewPost(postData: any) {
    return createPost(postData);
  },

  async likePost(id: string | number) {
    return toggleLike(id);
  },

  async postComment(id: string | number, commentText: string) {
    return addComment(id, commentText);
  },
};

export default CommunityService;
