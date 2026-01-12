import { IoClose } from "react-icons/io5";
import Button from "../../components/Button/Button";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { FaRegCircleQuestion } from "react-icons/fa6";

const PostError = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className={styles["header"]} style={{ background: "var(--theme-body-primary-bg)" }}>
        <div className={styles["action-bar"]}>
          <Button variant="rounded" size="medium" onClick={() => navigate("/")}>
            <IoClose className={styles["btn-icon"]} />
          </Button>
        </div>
      </header>

      <main className={styles["content"]}>
        <h1 className={styles["title"]}>This post does not exists</h1>

        <section className={styles["author-group"]}>
          <FaRegCircleQuestion className={styles["author-avatar"]} />

          <span className={styles["author-name"]}>???</span>
        </section>
      </main>
    </>
  );
};

export default PostError;
