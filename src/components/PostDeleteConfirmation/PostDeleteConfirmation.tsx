import type React from "react";
import styles from "./PostDeleteConfirmation.module.css";
import { createPortal } from "react-dom";
import { deletePost } from "../../api/post";

interface PostDeleteConfirmationProps {
  postId: string;
  setDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
  setPostSetting: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostDeleteConfirmation = ({
  postId,
  setDeleteConfirmation,
  setPostSetting,
}: PostDeleteConfirmationProps) => {
  return createPortal(
    <div className={styles["delete-confirmation-wrapper"]}>
      <div className={styles["delete-confirmation-container"]}>
        <h2 className={styles["delete-confirmation-title"]}>Delete Post</h2>
        <span className={styles["delete-confirmation-text"]}>
          Are you sure you want to delete this post?
        </span>

        <div className={styles["delete-confirmation-actions"]}>
          <button
            className={`  ${styles["delete-confirmation-btn"]} ${styles["cancel"]}`}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmation(false);
              setPostSetting(false);
            }}
          >
            No
          </button>

          <button
            className={`  ${styles["delete-confirmation-btn"]} ${styles["confirm"]}`}
            onClick={(e) => {
              e.stopPropagation();
              deletePost({ postId, setDeleteConfirmation, setPostSetting });
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PostDeleteConfirmation;
