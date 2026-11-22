import { apiClient } from './client';

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  category: string;
  type?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationCount {
  unread_count: number;
}

export interface NotificationAction {
  success: boolean;
  message: string;
  id?: number;
}

export const notificationAPI = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    const res = await apiClient.get('/notifications');
    const body = res.data;
    if (Array.isArray(body)) {
      return body;
    }
    if (body && Array.isArray(body.items)) {
      return body.items;
    }
    return body?.data || [];
  },

  getUnreadNotifications: async (): Promise<NotificationItem[]> => {
    const res = await apiClient.get('/notifications/unread');
    const body = res.data;
    if (Array.isArray(body)) {
      return body;
    }
    return body?.data || [];
  },

  getNotificationCount: async (): Promise<NotificationCount> => {
    const res = await apiClient.get('/notifications/count');
    const body = res.data;
    if (typeof body.unread_count === 'number') {
      return { unread_count: body.unread_count };
    }
    if (typeof body.count === 'number') {
      return { unread_count: body.count };
    }
    return { unread_count: 0 };
  },

  markNotificationRead: async (id: number): Promise<NotificationItem> => {
    const res = await apiClient.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async (): Promise<NotificationAction> => {
    const res = await apiClient.put('/notifications/read-all');
    return res.data;
  },

  deleteNotification: async (id: number): Promise<NotificationAction> => {
    const res = await apiClient.delete(`/notifications/${id}`);
    return res.data;
  },
};
