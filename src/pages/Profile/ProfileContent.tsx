import { FaMoon, FaSun, FaUser } from "react-icons/fa";
import { useThemeStore } from "../../stores/themeStore";
import { useUserStore } from "../../stores/userStore";
import styles from "./Profile.module.css";
import { IoCopySharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useState } from "react";

const ProfileContent = ({ handleShare }: { handleShare: (text: string) => void }) => {
  const userInformation = useUserStore((state) => state.userInformation);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const [openSettings, setOpenSettings] = useState(false);
  return (
    <>
      <header className={styles["header"]}>
        <button
          className={styles["settings-button"]}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? (
            <FaSun className={styles["theme-toggle-icon"]} />
          ) : (
            <FaMoon className={styles["theme-toggle-icon"]} />
          )}
        </button>
        <button className={styles["settings-button"]} onClick={() => setOpenSettings(true)}>
          <MdEdit className={styles["settings-button-icon"]} />
        </button>
      </header>
      <main className={styles["content"]}>
        {userInformation.profileImageUrl ? (
          <img src={userInformation.profileImageUrl} alt="Avatar" className={styles["avatar"]} />
        ) : (
          <FaUser className={styles["avatar"]} />
        )}
        <div
          className={styles["username"]}
          onClick={() => {
            handleShare(userInformation.userId);
          }}
        >
          <div>{userInformation.username}</div>
          <div className={styles["share-uid"]}>
            <IoCopySharp className={styles["share-uid-icon"]} />
          </div>
        </div>

        <div className={styles["follow-info"]}>
          <span>Followers</span>
          <span>Following</span>
        </div>
      </main>
    </>
  );
};

export default ProfileContent;
