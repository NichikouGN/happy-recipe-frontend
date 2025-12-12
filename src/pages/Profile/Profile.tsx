import { useAuthStore } from "../../stores/authStore";
import styles from "./Profile.module.css";
import ProfileSkeleton from "./ProfileSkeleton";
import ProfileContent from "./ProfileContent";
import { useToastStore } from "../../stores/toastStore";

const Profile = () => {
  const signInState = useAuthStore((state) => state.signInState);
  const Toast = useToastStore((state) => state.Toast);

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Prevent keyboard from showing
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleShare = async (text: string) => {
    copyToClipboard(text);
    Toast({
      type: "info",
      title: "Share",
      message: "Copied UID to clipboard",
    });
  };

  return (
    <div className={styles["profile-page"]}>
      {signInState === "authorized" ? (
        <ProfileContent handleShare={handleShare} />
      ) : (
        <ProfileSkeleton />
      )}
    </div>
  );
};

export default Profile;
