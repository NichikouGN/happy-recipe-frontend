import Button from "../../components/Button/Button";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";
import styles from "./Profile.module.css";
import { IoSettingsSharp } from "react-icons/io5";

const ProfileContent = () => {
  const userInformation = useUserStore((state) => state.userInformation);
  const signOut = useAuthStore((state) => state.signOut);
  return (
    <>
      <button className={styles["user-btn"]}>
        <div className={styles["user-info"]}>
          <img
            src={userInformation.profileImageUrl || "/default-avatar.png"}
            className={styles["avatar"]}
          />
          <div className={styles["user-id"]}>{userInformation.userId}</div>
        </div>

        <div className={styles["user-info"]}>
          <div className={styles["user-name"]}>{userInformation.username}</div>
          <div className={styles["bio"]}>{userInformation.bio}</div>
        </div>
      </button>

      <button className={styles["setting-btn"]}>
        <IoSettingsSharp size={28} />
        <p>Settings</p>
      </button>

      <Button variant="primary" onClick={signOut}>
        Sign Out
      </Button>
    </>
  );
};

export default ProfileContent;
