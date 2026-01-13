import { Toast } from "../stores/toastStore";
import { useAuthStore } from "../stores/authStore";
import { AuthError } from "../errors/AuthError";

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
      throw useAuthStore.getState().throwAuthError(res.status);
    }

    const data: NotificationsResponse = await res.json();
    return data;
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      await useAuthStore.getState().requestNewAccessToken();

      try {
        const retryRes = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/api/users/notifications/list?page=${page}&limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!retryRes.ok) {
          throw useAuthStore.getState().throwAuthError(retryRes.status);
        }

        const retryData: NotificationsResponse = await retryRes.json();
        return retryData;
      } catch (retryError) {
        Toast({ type: "error", title: "Error", message: "Unable to fetch notifications" });
        return null;
      }
    }
    Toast({ type: "error", title: "Error", message: "Unable to fetch notifications" });
    return null;
  }
};

/**
 * Mark a notification as read
 * @param notificationId The ID of the notification to mark as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const accessToken = useAuthStore.getState().accessToken;
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw useAuthStore.getState().throwAuthError(res.status);
    }

    return true;
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) {
      await useAuthStore.getState().requestNewAccessToken();

      try {
        const retryRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/notifications/${notificationId}/read`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
              "ngrok-skip-browser-warning": "true",
            },
            credentials: "include",
          }
        );

        if (!retryRes.ok) {
          throw useAuthStore.getState().throwAuthError(retryRes.status);
        }

        return true;
      } catch (retryError) {
        return false;
      }
    }
    return false;
  }
};
