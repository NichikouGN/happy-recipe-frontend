import { formatConsoleError } from "../consoleError";
import { queryClient } from "../queryClient";
import { useAuthStore } from "../stores/authStore";
import { Toast } from "../stores/toastStore";

interface DeltePostProps {
  postId: string;
  setDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setPostSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

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
