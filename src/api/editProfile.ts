export const uploadProfileChanges = async (profileData: {
  username?: string;
  bio?: string;
  avatarFile?: File;
}) => {
  const formData = new FormData();
  if (profileData.username) {
    formData.append("username", profileData.username);
  }
  if (profileData.bio) {
    formData.append("bio", profileData.bio);
  }
  if (profileData.avatarFile) {
    formData.append("avatar", profileData.avatarFile);
  }

  const res = await fetch("/api/profile/edit", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload profile changes");
  }

  return res.json();
};
