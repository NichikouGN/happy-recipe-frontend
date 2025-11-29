import styles from "./Card.module.css";
import { FaClock, FaFire, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";
import { FaCircleUser, FaHeart } from "react-icons/fa6";
import { LuText } from "react-icons/lu";
import { AiFillLike } from "react-icons/ai";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { usePosts } from "../../context/PostContext";
import type { Reaction, UserActions } from "../../types/PostType";

interface CardProps {
  postID: string;
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
  onClick?: () => void;
}

export const reactionType = [
  { reactionType: "like", icon: AiFillLike },
  { reactionType: "heart", icon: FaHeart },
  { reactionType: "yum", icon: GiForkKnifeSpoon },
] as const;

/**
 * This components take in all the info to construct a card
 * that is used for discovery and home page
 *
 * @param type CardProps
 * @returns Card
 */
const Card = ({
  postID,
  postImg = "",
  title = "",
  author = "",
  time = 0,
  serving = 0,
  difficulty = "easy",
  cardType,
  reactions = { like: 0, heart: 0, yum: 0 },
  cardLoaded,
  userActions = { userReaction: null, userBookmark: false },
  fetchRef,
  rounded = false,
  onClick,
}: CardProps) => {
  const { handleUserReaction, handleUserBookmark } = usePosts();

  if (cardType === "ingredients") {
    return (
      <div
        style={{
          borderRadius: `${rounded ? "0.5rem" : "0"}`,
          backgroundImage: cardLoaded
            ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 70%), url('${postImg}')`
            : "",
        }}
        className={`${styles["card-item"]} ${styles["food"]} ${
          !cardLoaded && styles["loading"]
        } `}
        onClick={onClick}
      >
        {cardLoaded ? (
          <span className={styles["card-title"]}>{title}</span>
        ) : (
          <LuText
            style={{
              fontSize: "clamp(2.5rem, 10vw, 5rem",
              color: "rgba(255,255,255,0.5)",
              fontWeight: "bold",
            }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div
        ref={fetchRef}
        style={
          cardLoaded
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%), url('${postImg}')`,
              }
            : { backgroundImage: "" }
        }
        className={`${styles["card-item"]} ${!cardLoaded && styles["loading"]}`}
        onClick={onClick}
      >
        <div className={styles["card-info-wrapper"]}>
          <>
            {cardLoaded && (
              <img
                src="/src/assets/happy-recipe-logo-text.png"
                className={styles["card-author-logo"]}
              />
            )}

            {!cardLoaded && (
              <FaCircleUser className={styles["card-author-logo"]} />
            )}
          </>

          <div className={styles["card-details"]}>
            {cardLoaded && (
              <>
                <span className={styles["card-title"]}>{title}</span>

                <div className={styles["other-info-wrapper"]}>
                  <div className={styles["other-info-item"]}>{author}</div>
                  <div className={styles["other-info-item"]}>
                    <FaClock /> <span>{time}</span>
                  </div>

                  <div className={styles["other-info-item"]}>
                    <FaFire
                      className={`${styles["diff-color"]} ${styles[difficulty]}`}
                    />
                    <span>{difficulty}</span>
                  </div>

                  <div className={styles["other-info-item"]}>
                    <MdDinnerDining /> <span>{serving}</span>
                  </div>
                </div>
              </>
            )}

            {!cardLoaded && (
              <LuText
                style={{
                  fontSize: "clamp(2.5rem, 10vw, 5rem",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: "bold",
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div
        className={`${styles["reaction-wrapper"]} ${
          !cardLoaded && styles["hide-reaction"]
        }`}
      >
        {reactionType.map(({ reactionType, icon: Icon }) => {
          return (
            <button
              key={reactionType}
              className={`${styles["reaction-item"]} ${styles[reactionType]} ${
                userActions.userReaction === reactionType &&
                styles[`${reactionType}-highlight`]
              }`}
              onClick={() => handleUserReaction(postID, reactionType)}
            >
              <Icon
                className={`${styles[`${reactionType}-icon`]} ${
                  userActions.userReaction === reactionType &&
                  styles[`${reactionType}-highlight`]
                }`}
              />
              {reactions[reactionType]}
            </button>
          );
        })}

        <div style={{ flexGrow: "1" }}></div>

        <button
          className={`${styles["reaction-item"]} ${styles["bookmark"]}`}
          onClick={() => handleUserBookmark(postID, !userActions.userBookmark)}
        >
          {userActions.userBookmark && (
            <FaBookmark className={styles["bookmark-icon"]} />
          )}
          {!userActions.userBookmark && (
            <FaRegBookmark className={styles["bookmark-icon"]} />
          )}
        </button>
      </div>
    </>
  );
};

export default Card;
