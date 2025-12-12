import styles from "./Profile.module.css";
import { useNavigate } from "react-router";
import { FaUser, FaSun, FaMoon } from "react-icons/fa";
import { useThemeStore } from "../../stores/themeStore";
import Button from "../../components/Button/Button";

const ProfileSkeleton = () => {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const navigate = useNavigate();
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
      </header>
      <main className={styles["content"]}>
        <FaUser className={styles["avatar"]} />
        <div className={styles["username"]}>
          <div>Lorem Ipsum</div>
        </div>

        <div className={styles["follow-info"]}>
          <span>0 Followers</span>
          <span>0 Following</span>
        </div>
        <div className={styles["bio"]}>
          <span>...</span>
        </div>

        <div className={styles["actions"]}>
          <Button size="medium" variant="primary" onClick={() => navigate("/signin")}>
            Sign in to view profile
          </Button>
        </div>
      </main>
    </>
  );
};

export default ProfileSkeleton;
