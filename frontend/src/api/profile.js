/**
 * api/profile.js
 * ---------------
 * Profile management API helpers using the shared Axios client.
 * The request interceptor in services/api.js auto-attaches the stored JWT.
 *
 * Endpoints:
 *   GET    /profile                 → getProfile()
 *   PATCH  /profile                 → updateProfile(payload)
 *   POST   /profile/change-password → changePassword(payload)
 *   DELETE /profile                 → deleteAccount(payload)
 *   GET    /profile/export-data     → exportData()
 */
import api from '../services/api';

// ── Types (JSDoc) ─────────────────────────────────────────────────────────

/**
 * @typedef {Object} UserProfile
 * @property {number} id
 * @property {string} email
 * @property {string} username
 * @property {string} preferred_language
 * @property {string} created_at
 * @property {string|null} last_login_at
 * @property {string|null} last_logout_at
 */

/**
 * @typedef {Object} UpdateProfilePayload
 * @property {string} username
 * @property {string} preferred_language
 */

/**
 * @typedef {Object} ChangePasswordPayload
 * @property {string} current_password
 * @property {string} new_password
 * @property {string} confirm_new_password
 */

/**
 * @typedef {Object} DeleteAccountPayload
 * @property {string} confirm_phrase  Must be "DELETE MY ACCOUNT"
 */

// ── API functions ─────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's extended profile (includes created_at).
 * GET /profile
 * @returns {Promise<UserProfile>}
 */
export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

/**
 * Update display name and preferred language.
 * PATCH /profile
 * @param {UpdateProfilePayload} payload
 * @returns {Promise<UserProfile>}
 */
export const updateProfile = async (payload) => {
  const response = await api.patch('/profile', payload);
  return response.data;
};

/**
 * Change the user's password.
 * POST /profile/change-password
 * @param {ChangePasswordPayload} payload
 * @returns {Promise<{message: string}>}
 */
export const changePassword = async (payload) => {
  const response = await api.post('/profile/change-password', payload);
  return response.data;
};

/**
 * Permanently delete the account and all associated data.
 * DELETE /profile
 * @param {DeleteAccountPayload} payload
 * @returns {Promise<{message: string}>}
 */
export const deleteAccount = async (payload) => {
  const response = await api.delete('/profile', { data: payload });
  return response.data;
};

/**
 * Export all user analysis history as a JSON object.
 * GET /profile/export-data
 * @returns {Promise<Object>}
 */
export const exportData = async () => {
  const response = await api.get('/profile/export-data');
  return response.data;
};

export const profileAPI = {
  getProfile,
  updateProfile,
  updateLocation: async (locationData) => {
    const response = await api.patch('/profile', locationData);
    return response.data;
  },
  changePassword,
  deleteAccount,
  exportData,
};
