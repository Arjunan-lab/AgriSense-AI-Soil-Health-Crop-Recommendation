import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { getNotifications, markNotificationRead, deleteNotification, NotificationItem } from '../../api/notification';
import toast from 'react-hot-toast';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const data = await getNotifications(false, 15);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success('Notification deleted');
      fetchNotifs();
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifs();
        }}
        className="p-2 text-slate-500 hover:text-emerald-500 rounded-full hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none transition-colors relative cursor-pointer"
        title="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-card shadow-soft-lg z-40 py-2 divide-y divide-slate-100 dark:divide-slate-800">
            {/* Header */}
            <div className="px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <button
                onClick={fetchNotifs}
                disabled={loading}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 transition-colors flex items-start justify-between space-x-3 ${
                      !n.is_read
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {n.title}
                        </span>
                        {!n.is_read && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-0.5">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 pt-0.5">
                      {!n.is_read && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
