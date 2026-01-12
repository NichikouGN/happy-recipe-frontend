import { IoClose } from "react-icons/io5";
import Button from "../../components/Button/Button";
import styles from "./Post.module.css";
import { useNavigate } from "react-router-dom";
import { LuText } from "react-icons/lu";

const PostSkeleton = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className={`${styles["header"]} ${styles["loading"]}`}>
        <div className={styles["action-bar"]}>
          <Button variant="rounded" size="medium" onClick={() => navigate("/")}>
            <IoClose className={styles["btn-icon"]} />
          </Button>
        </div>
      </header>

      <main className={styles["content"]}>
        <LuText className={`${styles["title"]}`} />

        <section className={styles["author-group"]}>
          <LuText className={`${styles["title"]}`} />
        </section>
      </main>
    </>
  );
};

export default PostSkeleton;
