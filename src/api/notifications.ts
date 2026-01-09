import { Toast } from "../stores/toastStore";
import { useAuthStore } from "../stores/authStore";

export interface NotificationPost {
  postId: string;
  title: string;
  coverImageUrl: string;
}

export interface Moderator {
  userId: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
}

export interface NotificationItem {
  notificationId: string;
  postId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  post: NotificationPost;
  moderator: Moderator;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch notifications list
 * @param page The page number to fetch (default: 1)
 * @param limit The number of notifications per page (default: 20)
 */
export const fetchNotifications = async (
  page: number = 1,
  limit: number = 20
): Promise<NotificationsResponse | null> => {
  const accessToken = useAuthStore.getState().accessToken;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/notifications/list?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    if (!res.ok) {
      throw new Error("Unable to fetch notifications");
    }

    const data: NotificationsResponse = await res.json();
    return data;
  } catch (error) {
    Toast({ type: "error", title: "Error", message: "Unable to fetch notifications" });
    return null;
  }
};

/**
 * Mark a notification as read
 * @param notificationId The ID of the notification to mark as read
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<boolean> => {
  const accessToken = useAuthStore.getState().accessToken;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/notifications/${notificationId}/read`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Unable to mark notification as read");
    }

    return true;
  } catch (error) {
    Toast({ type: "error", title: "Error", message: "Unable to mark notification as read" });
    return false;
  }
};
