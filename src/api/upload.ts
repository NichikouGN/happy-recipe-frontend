import type { uploadPostStructure } from "../pages/Upload/Upload";
import { useAuthStore } from "../stores/authStore";

/**
 * Uploads a new post to the backend.
 * @param data the post information that will be uploaded
 */
export const pushPost = async (data: uploadPostStructure) => {
  const accessToken = useAuthStore.getState().accessToken;

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to upload post");
  }
};
