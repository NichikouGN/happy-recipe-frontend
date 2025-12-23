import styles from "../Profile/Profile.module.css";
import { Link } from "react-router";
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

const UserSkeleton = () => {
  return (
    <>
      <header className={styles["header"]}>
        <Link to="/" className={styles["settings-button"]}>
          <FaHome className={styles["settings-button-icon"]} />
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
      </main>
    </>
  );
};

export default UserSkeleton;
