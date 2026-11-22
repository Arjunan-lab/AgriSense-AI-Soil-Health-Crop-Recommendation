import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data || []);
      const unread = (data || []).filter((n: any) => !n.is_read && !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string | number) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read: true })));
    setUnreadCount(0);
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    refetch: loadNotifications,
    markAsRead,
    markAllAsRead,
  };
}

export default useNotifications;
