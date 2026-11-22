import { apiClient } from './client';

export interface AdminDashboardOverview {
  total_users: number;
  active_users_today: number;
  active_users_this_week: number;
  active_users_this_month: number;
  new_registrations_today: number;
  new_registrations_this_week: number;
  new_registrations_this_month: number;
  farmers_count: number;
  researchers_count: number;
  administrators_count: number;
  total_predictions: number;
  soil_classification_count: number;
  crop_recommendation_count: number;
  fertilizer_recommendation_count: number;
  chatbot_conversations: number;
  chatbot_questions: number;
  feedback_count: number;
  average_user_rating: number;
  overall_ai_model_accuracy: number;
  system_uptime_human: string;
  api_version: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  extra?: Record<string, any>;
}

export interface DashboardChartsData {
  prediction_trend_line: ChartDataPoint[];
  soil_distribution_pie: ChartDataPoint[];
  crop_recommendations_bar: ChartDataPoint[];
  fertilizer_distribution_donut: ChartDataPoint[];
  user_growth_area: ChartDataPoint[];
  monthly_prediction_column: ChartDataPoint[];
  chatbot_usage_trend: ChartDataPoint[];
  weather_trend: ChartDataPoint[];
  feedback_trend: ChartDataPoint[];
}

export interface RecentActivityItem {
  id: string;
  type: string;
  description: string;
  user_id?: number;
  timestamp: string;
}

export interface AdminDashboardResponse {
  overview: AdminDashboardOverview;
  prediction_analytics: any;
  soil_analytics: any;
  crop_analytics: any;
  fertilizer_analytics: any;
  user_analytics: any;
  location_analytics: any;
  chatbot_analytics: any;
  ai_model_performance: any;
  weather_analytics: any;
  notification_analytics: any;
  feedback_analytics: any;
  system_health: any;
  security_analytics: any;
  recent_activities: RecentActivityItem[];
  charts: DashboardChartsData;
}

export const adminAPI = {
  getDashboardStats: async (): Promise<AdminDashboardResponse> => {
    const { data } = await apiClient.get('/api/admin/dashboard');
    return data;
  },
  getUsersList: async (params?: { search?: string; role?: string; status_filter?: string }) => {
    const { data } = await apiClient.get('/api/admin/users-list', { params });
    return data;
  },
  getUserAnalytics: async () => {
    const { data } = await apiClient.get('/api/admin/users');
    return data;
  },
  getPredictionAnalytics: async () => {
    const { data } = await apiClient.get('/api/admin/predictions');
    return data;
  },
  getCropAnalytics: async () => {
    const { data } = await apiClient.get('/api/admin/crops');
    return data;
  },
  getSoilAnalytics: async () => {
    const { data } = await apiClient.get('/api/admin/soil');
    return data;
  },
  getFertilizerAnalytics: async () => {
    const { data } = await apiClient.get('/api/admin/fertilizer');
    return data;
  },
  getChatbotAnalytics: async () => {
    const { data } = await apiClient.get('/api/admin/chatbot');
    return data;
  },
  getChatbotLogs: async (params?: { search?: string; limit?: number }) => {
    const { data } = await apiClient.get('/api/admin/chatbot/logs', { params });
    return data;
  },
  getCharts: async (): Promise<DashboardChartsData> => {
    const { data } = await apiClient.get('/api/admin/charts');
    return data;
  },
  getRecentActivities: async (limit: number = 20): Promise<RecentActivityItem[]> => {
    const { data } = await apiClient.get('/api/admin/activity', { params: { limit } });
    return data;
  },
  getUsers: async (params?: any) => {
    const { data } = await apiClient.get('/api/admin/users', { params });
    return data;
  },
  updateUserRole: async (userId: number, role: string) => {
    const { data } = await apiClient.patch(`/api/admin/users/${userId}/role`, { role });
    return data;
  },
  updateUserStatus: async (userId: number, statusPayload: any) => {
    const { data } = await apiClient.patch(`/api/admin/users/${userId}/status`, statusPayload);
    return data;
  },
  deleteUser: async (userId: number) => {
    const { data } = await apiClient.delete(`/api/admin/users/${userId}`);
    return data;
  },
  getFeedback: async (params?: any) => {
    const { data } = await apiClient.get('/api/admin/feedback', { params });
    return data;
  },
  getPredictions: async (params?: any) => {
    const { data } = await apiClient.get('/api/admin/predictions', { params });
    return data;
  },
  getAnalyticsDashboard: async (params?: { range_filter?: string }) => {
    const { data } = await apiClient.get('/api/admin/analytics-dashboard', { params });
    return data;
  },
  getFeedbackSummary: async () => {
    const { data } = await apiClient.get('/api/admin/feedback-summary');
    return data;
  },
  getFeedbackList: async (params?: { search?: string; category?: string; rating?: number }) => {
    const { data } = await apiClient.get('/api/admin/feedback-list', { params });
    return data;
  },
  replyToFeedback: async (feedbackId: number, responseText: string) => {
    const { data } = await apiClient.post(`/api/admin/feedback/${feedbackId}/reply`, { response: responseText });
    return data;
  },
  deleteFeedbackReply: async (feedbackId: number) => {
    const { data } = await apiClient.delete(`/api/admin/feedback/${feedbackId}/reply`);
    return data;
  },
  resolveFeedback: async (feedbackId: number) => {
    const { data } = await apiClient.patch(`/api/admin/feedback/${feedbackId}/resolve`);
    return data;
  },
  deleteFeedback: async (feedbackId: number) => {
    const { data } = await apiClient.delete(`/api/admin/feedback/${feedbackId}`);
    return data;
  },
  submitFeedback: async (payload: { rating: number; category?: string; comment?: string; crop_focus?: string }) => {
    const { data } = await apiClient.post('/api/admin/user-feedback', payload);
    return data;
  },
  getCommunityAnalytics: async () => {
    const { data } = await apiClient.get('/admin/community/analytics');
    return data;
  }
};
