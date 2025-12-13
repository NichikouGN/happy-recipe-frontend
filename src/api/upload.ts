import type { uploadPostStructure } from "../pages/Upload/Upload";
import { useAuthStore } from "../stores/authStore";

export const pushPost = async (data: uploadPostStructure) => {
  const accessToken = useAuthStore.getState().accessToken;

  const res = await fetch("https://happy-recipe-api.example.com/posts", {
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
  const result = await res.json();
  return result;
};
