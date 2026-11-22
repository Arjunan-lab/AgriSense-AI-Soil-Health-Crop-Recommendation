/**
 * Notification Service
 * In-app and system notification service.
 */

import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notification';

export const NotificationService = {
  async getNotifications() {
    return fetchNotifications();
  },

  async markAsRead(id: string | number) {
    return markNotificationRead(id);
  },

  async markAllAsRead() {
    return markAllNotificationsRead();
  },
};

export default NotificationService;
