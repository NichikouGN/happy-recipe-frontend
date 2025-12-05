import { useUserContext } from "../../context/userContext";
import styles from "./Profile.module.css";
import { IoSettingsSharp } from "react-icons/io5";

const ProfileContent = () => {
  const { userInformation } = useUserContext();
  return (
    <>
      <button className={styles["user-btn"]}>
        <div className={styles["user-info"]}>
          <img
            src={userInformation.profileImageURL || "/default-avatar.png"}
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
    </>
  );
};

export default ProfileContent;
