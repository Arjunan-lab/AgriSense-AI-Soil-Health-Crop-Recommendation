/**
 * constants/api.js
 * ----------------
 * API endpoint path constants — keeps route strings out of components.
 */

export const API_ENDPOINTS = {
  // Auth
  REGISTER:         '/auth/register',
  LOGIN:            '/auth/login',
  GET_USER:         '/auth/get',

  // Prediction
  PREDICT:          '/predict',

  // Complete pipeline
  COMPLETE_ANALYSIS: '/complete-analysis',

  // History
  HISTORY_LIST:     '/history',
  HISTORY_DETAIL:   (id) => `/history/${id}`,
  HISTORY_DELETE:   (id) => `/history/${id}`,

  // Reports
  REPORT:           (id) => `/analysis/${id}/report`,

  // Dashboard
  DASHBOARD:        '/dashboard',

  // System
  HEALTH:           '/health',
  MODEL_INFO:       '/model-info',
};
