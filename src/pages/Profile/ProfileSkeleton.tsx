import styles from "./Profile.module.css";
import { Link, useNavigate } from "react-router";
import { FaUser } from "react-icons/fa";
import Button from "../../components/Button/Button";
import { IoSettingsSharp } from "react-icons/io5";

const ProfileSkeleton = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className={styles["header"]} style={{ justifyContent: "flex-end" }}>
        <Link to="/settings" className={styles["settings-button"]}>
          <IoSettingsSharp className={styles["settings-button-icon"]} />
        </Link>
      </header>
      <main className={styles["content"]}>
        <FaUser className={styles["avatar"]} />
        <div className={styles["username"]}>
          <div>...</div>
        </div>

        <div className={styles["bio"]}>
          <span>...</span>
        </div>

        <div className={styles["actions"]}>
          <Button size="medium" variant="primary" onClick={() => navigate("/signin")}>
            Sign in
          </Button>
        </div>
      </main>
    </>
  );
};

export default ProfileSkeleton;
