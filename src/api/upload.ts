import type { uploadPostStructure } from "../pages/Upload/Upload";
import { useAuthStore } from "../stores/authStore";

/**
 * Uploads a new post to the backend.
 * @param data the post information that will be uploaded
 */
export const pushPost = async (data: uploadPostStructure) => {
  const accessToken = useAuthStore.getState().accessToken;

  const formData = new FormData();

  // Primitive fields
  formData.append("title", data.title);
  formData.append("cookTime", String(data.cookTime));
  formData.append("servings", String(data.servings));
  formData.append("difficulty", data.difficulty);
  formData.append("description", data.description);

  // Cover image
  if (data.coverImgFile) {
    formData.append("coverImgFile", data.coverImgFile);
  }

  // Steps
  data.steps.forEach((step, index) => {
    formData.append(`steps[${index}][stepNum]`, String(step.stepNum));
    formData.append(`steps[${index}][stepDesc]`, step.stepDesc);

    if (step.stepImgFile) {
      formData.append(`steps[${index}][stepImgFile]`, step.stepImgFile);
    }
  });

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
};