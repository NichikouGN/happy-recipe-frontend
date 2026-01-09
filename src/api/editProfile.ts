import { Toast } from "../stores/toastStore";
import { useAuthStore } from "../stores/authStore";

/**
 * Upload profile changes to the backend
 * @param profileData - Profile changes
 */
export const uploadProfileChanges = async (profileData: {
  displayName?: string;
  bio?: string;
  profileImageFile?: File | null;
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

  const formData = new FormData();
  if (profileData.displayName) {
    console.log("Appending display name:", profileData.displayName);
    formData.append("displayName", profileData.displayName);
  }
  if (profileData.bio) {
    console.log("Appending bio:", profileData.bio);
    formData.append("bio", profileData.bio);
  }
  if (profileData.profileImageFile) {
    console.log("Appending profile image file:", profileData.profileImageFile.name);
    formData.append("avatar", profileData.profileImageFile);
  }

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile/edit`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "ngrok-skip-browser-warning": "true",
    },
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw useAuthStore.getState().throwAuthError(res.status);
  }
};
