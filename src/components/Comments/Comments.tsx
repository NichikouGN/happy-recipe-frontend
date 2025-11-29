import styles from "./Comments.module.css";
import type { CommentStructure } from "../../types/PostType";

const Comments = ({
  comments,
  fetchReplies,
  layer = 0,
  commentInitialized,
}: {
  comments: CommentStructure[];
  fetchReplies: (parentCommentID: string) => void;
  layer: number;
  commentInitialized: boolean;
}) => {
  return comments.length !== 0
    ? comments.map((comment) => (
        <div
          key={comment.commentID}
          className={styles["comment-item"]}
          style={
            {
              "--line-offset": `${layer * 1}rem`,
            } as React.CSSProperties
          }
        >
          <div
            style={{
              marginLeft: `${layer * 1}rem`,
              width: `calc(100% - ${layer * 1}rem)`,
            }}
            className={`${styles["comment-main-block"]} ${
              layer !== 0 ? styles["comment-main-block-reply"] : ""
            }`}
          >
            <div className={styles["comment-author-avatar"]} />
            <div className={styles["comment-author-group"]}>
              <div className={styles["comment-author"]}>
                {comment.userName}
                <span style={{ fontWeight: "400", fontSize: "0.7rem" }}>
                  {new Date(comment.createdAt).toLocaleDateString("en-CA")}
                </span>
              </div>
              <div className={styles["comment-content"]}>{comment.content}</div>
            </div>
          </div>

          {comment.replies && comment.replies.length > 0 ? (
            <Comments
              comments={comment.replies}
              fetchReplies={fetchReplies}
              layer={layer + 1}
              commentInitialized={commentInitialized}
            />
          ) : null}

          {comment.replyCount && comment.replyCount > 0 && !comment.replies ? (
            <div className={styles["comment-actions"]}>
              <button
                className={styles["comment-action-btn"]}
                onClick={() => fetchReplies(comment.commentID)}
              >
                View {comment.replyCount} replies
              </button>
            </div>
          ) : null}
        </div>
      ))
    : commentInitialized && (
        <div style={{ textAlign: "center", padding: "0.5rem" }}>
          No comments yet.
        </div>
      );
};

export default Comments;
