import { useEffect, useState } from "react";
import { Link } from "react-router";
import { IoClose } from "react-icons/io5";
import {
  fetchNotifications,
  markNotificationAsRead,
  type NotificationItem,
} from "../../api/notifications";
import styles from "./Notifications.module.css";
import { FaUser } from "react-icons/fa6";

const Notifications = () => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    console.log("Notifications open state:", notificationsOpen);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    const res = await fetchNotifications(pagination.page, pagination.limit);
    if (res) {
      setNotifications(res.notifications);
      setPagination(res.pagination);
    }
    setLoading(false);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.notificationId === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.notificationId);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={styles["notifications-container"]}>
      <header className={styles["notifications-header"]}>
        <h2>Notifications</h2>
      </header>

      {loading ? (
        <div className={styles["notifications-loading"]}>
          <div className={styles["notifications-loading-spinner"]} />
        </div>
      ) : notifications.length === 0 ? (
        <div className={styles["notifications-empty"]}>
          <p>No notifications yet</p>
        </div>
      ) : (
        <ul className={styles["notifications-list"]}>
          {notifications.map((notification) => (
            <li
              key={notification.notificationId}
              className={`${styles["notification-item"]} ${
                !notification.isRead ? styles["unread"] : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              {notification.moderator.profileImageUrl ? (
                <div
                  style={{ backgroundImage: `url(${notification.moderator.profileImageUrl})` }}
                  className={styles["notification-avatar"]}
                />
              ) : (
                <FaUser className={styles["notification-avatar"]} />
              )}
              <div className={styles["notification-content"]}>
                <div className={styles["notification-header"]}>
                  <span className={styles["notification-user"]}>
                    {notification.moderator.displayName}
                  </span>
                  <span className={styles["notification-time"]}>
                    {formatTime(notification.createdAt)}
                  </span>
                </div>

                <p className={styles["notification-message"]}>{notification.message}</p>

                <Link
                  to={`/post/${notification.post.postId}`}
                  className={styles["notification-post-info"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationsOpen(false);
                  }}
                >
                  <img
                    src={notification.post.coverImageUrl}
                    alt={notification.post.title}
                    className={styles["notification-post-image"]}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/48";
                    }}
                  />
                  <div className={styles["notification-post-title"]}>{notification.post.title}</div>
                </Link>
              </div>

              {!notification.isRead && <div className={styles["notification-read-indicator"]} />}
            </li>
          ))}
        </ul>
      )}

      {notifications.length > 0 && (
        <footer className={styles["notifications-footer"]}>
          {/* <Link to="/notifications">View all notifications</Link> */}
        </footer>
      )}
    </div>
  );
};

export default Notifications;
