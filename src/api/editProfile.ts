import { Toast } from "../stores/toastStore";
import { useAuthStore } from "../stores/authStore";

export const uploadProfileChanges = async (profileData: {
  displayName?: string;
  bio?: string;
  avatarFile?: File | null;
}) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (!accessToken) {
    Toast({
      type: "error",
      title: "Authentication Error",
      message: "You must be signed in to edit your profile.",
    });
    return;
  }

  try {
    const formData = new FormData();
    if (profileData.displayName) {
      formData.append("displayName", profileData.displayName);
    }
    if (profileData.bio) {
      formData.append("bio", profileData.bio);
    }
    if (profileData.avatarFile) {
      formData.append("avatar", profileData.avatarFile);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/edit`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload profile changes");
    }

    return res.json();
  } catch (error) {
    Toast({
      type: "error",
      title: "Upload Error",
      message: "Error uploading profile changes. Please try again later",
    });
  }
};
