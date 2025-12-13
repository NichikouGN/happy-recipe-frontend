import { Link, useNavigate } from "react-router-dom";
import Toggle from "../../components/Toggle/Toggle";
import { useThemeStore } from "../../stores/themeStore";
import styles from "./Settings.module.css";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "../../stores/authStore";
import { PiSignOutBold } from "react-icons/pi";

const Settings = () => {
  const signInState = useAuthStore.getState().signInState;
  const theme = useThemeStore.getState().theme;
  const setTheme = useThemeStore.getState().setTheme;
  const navigate = useNavigate();
  return (
    <div className={styles["edit-profile-page"]}>
      <header className={styles["header"]}>
        <h1>Settings</h1>
        <Link to="/profile" className={styles["return-btn"]}>
          <IoClose className={styles["return-btn-icon"]} />
        </Link>
      </header>
      <main className={styles["content"]}>
        <section className={styles["setting-section"]}>
          <h2>Appearance</h2>
          <div className={styles["setting-item"]}>
            <h3>Dark Mode</h3>
            <Toggle
              size="large"
              state={theme === "dark" ? "on" : "off"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
          </div>
        </section>

        {signInState === "authorized" && (
          <section className={styles["setting-section"]}>
            <h2>Others</h2>
            <div className={styles["setting-item"]}>
              <h3>Sign Out</h3>
              <button
                className={styles["signout-btn"]}
                onClick={() => {
                  useAuthStore.getState().signOut();
                  navigate("/");
                }}
              >
                <PiSignOutBold className={styles["signout-btn-icon"]} />
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Settings;
