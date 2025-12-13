import styles from "./Card.module.css";
import { FaClock, FaFire, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";
import { FaCircleUser, FaHeart } from "react-icons/fa6";
import { LuText } from "react-icons/lu";
import { AiFillLike } from "react-icons/ai";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { usePosts } from "../../context/PostContext";
import type { Reaction, UserActions } from "../../types/PostType";
import { computeReactionState } from "../../api/posts";

interface CardProps {
  postId: string;
  postImg?: string;
  title?: string;
  author?: string;
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

export const reactionType = [
  { reactionType: "like", icon: AiFillLike, color: "var(--sky-500)" },
  { reactionType: "heart", icon: FaHeart, color: "var(--red-500)" },
  { reactionType: "yum", icon: GiForkKnifeSpoon, color: "var(--yellow-600)" },
] as const;

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
  author = "",
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
  const { handleUserReaction, handleUserBookmark } = usePosts();

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
      <button
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
        <div className={styles["card-info-wrapper"]}>
          {cardLoaded ? (
            <img
              src="/src/assets/happy-recipe-logo-text.png"
              className={styles["card-author-logo"]}
            />
          ) : (
            <FaCircleUser className={styles["card-author-logo"]} />
          )}

          <div className={styles["card-details"]}>
            {cardLoaded ? (
              <>
                <span className={styles["card-title"]}>{title}</span>

                <div className={styles["other-info-wrapper"]}>
                  <div className={styles["other-info-item"]}>{author}</div>
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
      </button>

      {!excludeReactionSection && (
        <div className={`${styles["reaction-wrapper"]}`}>
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
