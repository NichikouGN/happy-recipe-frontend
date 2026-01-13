import { Link } from "react-router-dom";
import styles from "../Profile/Profile.module.css";
import { FaHome } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";

const UserError = () => {
  return (
    <>
      <header className={styles["header"]}>
        <Link to="/" className={styles["settings-button"]}>
          <FaHome className={styles["settings-button-icon"]} />
        </Link>
      </header>
      <main className={styles["content"]}>
        <FaRegCircleQuestion className={styles["avatar"]} />

        <section className={styles["display-name"]}>
          <div>This user does not exist.</div>
        </section>

        <section className={styles["username"]}>Please check the user ID and try again.</section>
      </main>
    </>
  );
};

export default UserError;
