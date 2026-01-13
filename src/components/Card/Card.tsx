import styles from "./Card.module.css";
import { FaClock, FaFire, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { LuText } from "react-icons/lu";
import type { Reaction, UserActions } from "../../types/PostType";
import { computeReactionState } from "../../api/discover";
import { reactionType } from "../../types/PostType";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import PostDeleteConfirmation from "../PostDeleteConfirmation/PostDeleteConfirmation";
import { usePostActions } from "../../context/PostActionContext";

interface CardProps {
  postId: string;
  postImg?: string;
  title?: string;
  authorName?: string;
  authorId?: string;
  authorImgUrl?: string;
  currentUserId?: string;
  time?: number;
  serving?: number;
  difficulty?: "easy" | "medium" | "hard";
  cardType: "post" | "ingredients";
  reactions?: Reaction;
  cardLoaded: boolean;
  userActions?: UserActions;
  fetchRef?: null;
  rounded?: boolean;
  excludeReactionSection?: boolean;
  onClick?: () => void;
}

/**
 * This components take in all the info to construct a card
 * that is used for discovery and home page
 *
 * @param type CardProps
 * @returns Card
 */
const Card = ({
  postId,
  postImg = "",
  title = "",
  authorName = "",
  authorId = "",
  authorImgUrl = "",
  currentUserId = "",
  time = 0,
  serving = 0,
  difficulty = "easy",
  cardType = "ingredients",
  reactions = { like: 0, heart: 0, yum: 0 },
  cardLoaded,
  userActions = { userReaction: null, userBookmark: false },
  fetchRef,
  rounded = false,
  excludeReactionSection = false,
  onClick,
}: CardProps) => {
  const { handleUserReaction, handleUserBookmark } = usePostActions();
  const [postSetting, setPostSetting] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleNavigateToAuthorProfile = () => {
    const currentUserId = useUserStore.getState().userInformation.userId;
    if (!authorId) return;

    if (authorId === currentUserId) {
      navigate(`/profile`);
      return;
    }

    navigate(`/user/${authorId}`);
  };

  return cardType === "ingredients" ? (
    <button
      style={
        {
          "--post-img": `url('${postImg}')`,
        } as React.CSSProperties
      }
      className={`${styles["card-item"]} ${styles["ingredients"]} ${
        cardLoaded ? styles["loaded"] : styles["loading"]
      } ${rounded ? styles["rounded"] : ""} `}
      onClick={onClick}
    >
      {cardLoaded ? (
        <h1 className={styles["card-title"]}>{title}</h1>
      ) : (
        <LuText className={styles["loading-text-icon"]} />
      )}
    </button>
  ) : (
    <>
      {deleteConfirmation && currentUserId && (
        <PostDeleteConfirmation
          postId={postId}
          setDeleteConfirmation={setDeleteConfirmation}
          setPostSetting={setPostSetting}
        />
      )}
      <div
        ref={fetchRef}
        style={
          {
            "--post-img": `url('${postImg}')`,
          } as React.CSSProperties
        }
        className={`${styles["card-item"]} ${cardLoaded ? styles["loaded"] : styles["loading"]} ${
          rounded ? styles["rounded"] : ""
        } `}
        onClick={onClick}
      >
        {currentUserId && authorId && currentUserId === authorId && cardLoaded && (
          <>
            <button
              className={styles["own-post-setting"]}
              onClick={(e) => {
                e.stopPropagation();
                setPostSetting((prev) => !prev);
              }}
            >
              :
            </button>

            {postSetting && (
              <div className={styles["post-setting-dropdown"]}>
                <button
                  className={styles["post-setting-item"]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteConfirmation(true);
                  }}
                >
                  <MdDeleteForever className={styles["post-setting-icon"]} />
                  Delete Post
                </button>
              </div>
            )}
          </>
        )}

        <div className={styles["card-info-wrapper"]}>
          {cardLoaded && authorImgUrl ? (
            <button
              style={{ backgroundImage: `url('${authorImgUrl}')` }}
              className={styles["card-author-avatar"]}
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.stopPropagation();
                handleNavigateToAuthorProfile();
              }}
            />
          ) : (
            <FaCircleUser
              className={styles["card-author-avatar"]}
              onClick={(e: React.MouseEvent<SVGElement, MouseEvent>) => {
                e.stopPropagation();
                cardLoaded ? handleNavigateToAuthorProfile() : null;
              }}
            />
          )}

          <div className={styles["card-details"]}>
            {cardLoaded ? (
              <>
                <span className={styles["card-title"]}>{title}</span>

                <div className={styles["other-info-wrapper"]}>
                  <div className={styles["other-info-item"]}>{authorName}</div>
                  <div className={styles["other-info-item"]}>
                    <FaClock /> <span>{time}</span>
                  </div>

                  <div className={styles["other-info-item"]}>
                    <FaFire className={`${styles["diff-color"]} ${styles[difficulty]}`} />
                    <span>{difficulty}</span>
                  </div>

                  <div className={styles["other-info-item"]}>
                    <MdDinnerDining /> <span>{serving}</span>
                  </div>
                </div>
              </>
            ) : (
              <LuText className={styles["loading-text-icon"]} />
            )}
          </div>
        </div>
      </div>

      {!excludeReactionSection && (
        <div className={`${styles["reaction-wrapper"]} ${rounded ? styles["rounded"] : ""}`}>
          {reactionType.map(({ reactionType, icon: Icon, color }) => {
            return (
              <button
                key={reactionType}
                style={{ "--reaction-color": color } as React.CSSProperties}
                className={`${styles["reaction-item"]} ${
                  userActions.userReaction === reactionType && styles[`reaction-highlight`]
                }`}
                onClick={() =>
                  handleUserReaction(
                    postId,
                    computeReactionState(reactionType, userActions.userReaction)
                  )
                }
              >
                <Icon className={`${styles["reaction-item-icon"]} `} />
                <span>{reactions[reactionType]}</span>
              </button>
            );
          })}

          <div style={{ flexGrow: "1" }} />

          <button
            className={`${styles["reaction-item"]} ${styles["bookmark"]}`}
            onClick={() => handleUserBookmark(postId, !userActions.userBookmark)}
          >
            {userActions.userBookmark ? (
              <FaBookmark className={styles["bookmark-icon"]} />
            ) : (
              <FaRegBookmark className={styles["bookmark-icon"]} />
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default Card;
