import styles from "./Card.module.css";
import { FaClock, FaFire, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";
import { FaCircleUser, FaHeart } from "react-icons/fa6";
import { LuText } from "react-icons/lu";
import { AiFillLike } from "react-icons/ai";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { useDiscoveryContext } from "../../context/DiscoveryContext";

interface CardProps {
  postID: string;
  postImg?: string;
  title: string;
  author?: string;
  time?: number;
  serving: number;
  difficulty: "easy" | "medium" | "hard";
  cardType: "post" | "food";
  reactions: { like: number; heart: number; yum: number };
  cardLoaded: boolean;
  userReaction?: "like" | "heart" | "yum" | "";
  isBookmarked: boolean;
  fetchRef?: null;
  onClick: () => void;
}

const reactionType = [
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
  postImg,
  title,
  author,
  time,
  serving,
  difficulty,
  cardType,
  reactions,
  cardLoaded,
  userReaction,
  isBookmarked,
  fetchRef,
  onClick,
}: CardProps) => {
  const { handleUserReaction, handleUserBookmark } = useDiscoveryContext();
  return (
    <div ref={fetchRef} className={styles["card-item"]}>
      <div
        style={
          cardLoaded
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%), url('${postImg}')`,
              }
            : {}
        }
        className={`${styles["card-image"]} ${
          !cardLoaded && styles["loading"]
        }`}
        onClick={onClick}
      >
        <div className={styles["card-info-wrapper"]}>
          <div className={styles["card-info-blur"]} />
          {cardType === "post" && (
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
          )}

          <div className={styles["card-details"]}>
            {cardLoaded && (
              <>
                <span
                  className={`${styles["card-title"]}  ${
                    cardType === "food" && styles["food"]
                  }`}
                >
                  {title}
                </span>

                {cardType === "post" && (
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
                )}
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
              className={`${styles["reaction-item"]} ${styles[reactionType]} ${
                userReaction === reactionType &&
                styles[`${reactionType}-highlight`]
              }`}
              onClick={() => handleUserReaction(postID, reactionType)}
            >
              <Icon className={styles[`${reactionType}-icon`]} />
              {reactions[reactionType]}
            </button>
          );
        })}

        <div style={{ flexGrow: "1" }}></div>

        <button
          className={`${styles["reaction-item"]} ${styles["bookmark"]}`}
          onClick={() => handleUserBookmark(postID, !isBookmarked)}
        >
          {isBookmarked && <FaBookmark className={styles["bookmark-icon"]} />}
          {!isBookmarked && (
            <FaRegBookmark className={styles["bookmark-icon"]} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Card;
