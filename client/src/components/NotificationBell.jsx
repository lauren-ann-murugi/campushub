"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, formatLastSeen } from "@/lib/auth";
import { BellIcon, CheckIcon } from "@/components/icons";

const categoryColor = {
  announcement: "bg-[#004ac60d] text-[#004ac6]",
  academic: "bg-[#006c491a] text-[#006c49]",
  fees: "bg-[#f59e0b1a] text-[#f59e0b]",
  general: "bg-[#f7f9fb] text-[#434655]",
};

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from FastAPI backend
  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/v1/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      setNotifications(data || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark single notification as read
  const markAsRead = async (notifId) => {
    if (!user) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );

    try {
      await fetch(`/api/v1/notifications/${notifId}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllRead = async () => {
    if (!user) return;
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await fetch("/api/v1/notifications/read-all", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) loadNotifications();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#e6e8ea] text-[#434655] transition-colors hover:bg-[#f7f9fb] hover:text-[#191c1e]"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#e6e8ea] bg-white shadow-lg sm:w-96">
            <div className="flex items-center justify-between border-b border-[#eceef0] px-5 py-3">
              <h3 className="text-sm font-semibold text-[#191c1e]">
                Notifications{" "}
                {unreadCount > 0 && (
                  <span className="text-[#ef4444]">({unreadCount})</span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-[#004ac6] hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="py-10 text-center text-sm text-[#434655]">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10 text-center">
                  <BellIcon className="h-8 w-8 text-[#c3c6d7]" />
                  <p className="text-sm text-[#434655]">
                    No notifications yet
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`border-b border-[#f0f1f3] px-5 py-3 transition-colors last:border-0 hover:bg-[#f7f9fb] ${
                        !n.read ? "bg-[#004ac608]" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => markAsRead(n.id)}
                        className="flex w-full items-start gap-3 text-left"
                      >
                        <span
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            categoryColor[n.category] ?? categoryColor.general
                          }`}
                        >
                          {(n.sender_name || "U").charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-[#191c1e]">
                              {n.title}
                            </p>
                            {!n.read && (
                              <span className="h-2 w-2 shrink-0 rounded-full bg-[#004ac6]" />
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs text-[#434655]">
                            {n.message}
                          </p>
                          <p className="mt-1 text-[11px] text-[#434655]/70">
                            {n.sender_name || "System"} ·{" "}
                            {formatLastSeen ? formatLastSeen(n.created_at) : n.created_at}
                          </p>
                        </div>
                        {n.read && (
                          <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-[#006c49]" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationBell;