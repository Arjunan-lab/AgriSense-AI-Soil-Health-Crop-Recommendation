/**
 * User Service
 * High-level user profile & account management service.
 */

import { fetchUserProfile, updateProfile, uploadProfilePicture } from '../api/profile';
import { StorageService } from './storage.service';

const USER_STORAGE_KEY = 'user';

export const UserService = {
  async getProfile() {
    const user = await fetchUserProfile();
    if (user) {
      StorageService.setItem(USER_STORAGE_KEY, user);
    }
    return user;
  },

  async updateProfile(profileData: any) {
    const updated = await updateProfile(profileData);
    if (updated) {
      StorageService.setItem(USER_STORAGE_KEY, updated);
    }
    return updated;
  },

  async uploadAvatar(file: File) {
    const res = await uploadProfilePicture(file);
    return res;
  },
};

export default UserService;
