import type { QueryFunction } from "@tanstack/react-query";
import { formatConsoleError } from "../consoleError";
import { queryClient } from "../queryClient";
import { useAuthStore } from "../stores/authStore";
import { Toast } from "../stores/toastStore";
import type { FullPostStructure } from "../types/PostType";

interface DeltePostProps {
  postId: string;
  setDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setPostSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Fetch detailed post function for tanstack useQuery()
 *
 * @param queryKey  The query key containing the post ID
 * @returns Detailed post data
 */
export const fetchDetailedPost: QueryFunction<FullPostStructure, [string, string]> = async ({
  queryKey,
}) => {
  const [, postId] = queryKey;
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };

  if (accessToken) {
    headers["authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
    headers: headers,
  });

  if (!res.ok) throw new Error("Failed to fetch posts");

  const data = await res.json();

  if (accessToken && data.tokenState && data.tokenState === "expired") {
    await useAuthStore.getState().requestNewAccessToken();
    try {
      const retryRes = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
        headers: {
          ...headers,
          authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        },
      });
      if (!retryRes.ok) throw new Error("Failed to fetch posts on retry");

      const retryData = await retryRes.json();
      const detailedPost: FullPostStructure = retryData.post;

      return detailedPost;
    } catch (e) {
      //
    }
  }

  const detailedPost: FullPostStructure = data.post;
  return detailedPost;
};

export const deletePost = async ({
  postId,
  setDeleteConfirmation,
  setPostSetting,
}: DeltePostProps): Promise<void> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete post");
    }

    queryClient.invalidateQueries({ queryKey: ["discoverPosts"] });
    setDeleteConfirmation(false);
    setPostSetting(false);
    Toast({
      type: "success",
      title: "Post Deleted",
      message: "The post has been successfully deleted.",
    });
  } catch (error) {
    Toast({
      type: "error",
      title: "Delete Post Error",
      message: "An error occurred while deleting the post.",
    });
    formatConsoleError("post.ts", "deletePost", error);
    throw error;
  }
};
