import styles from "./Card.module.css";
import { FaClock, FaFire, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";
import { FaCircleUser, FaHeart } from "react-icons/fa6";
import { LuText } from "react-icons/lu";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

interface CardProps {
  postImg?: string;
  title: string;
  author?: string;
  time?: number;
  serving: number;
  difficulty: "easy" | "medium" | "hard";
  cardType: "post" | "food";
  likeCount: number;
  heartCount: number;
  dislikeCount: number;
  cardLoaded: boolean;
  isBookmarked: boolean;
  fetchRef?: null;
  onClick: () => void;
}

/**
 * This components take in all the info to construct a card
 * that is used for discovery and home page
 *
 * @param type CardProps
 * @returns Card
 */
const Card = ({
  postImg,
  title,
  author,
  time,
  serving,
  difficulty,
  cardType,
  likeCount,
  heartCount,
  dislikeCount,
  cardLoaded,
  isBookmarked,
  fetchRef,
  onClick,
}: CardProps) => {
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
        <button className={`${styles["reaction-item"]} ${styles["like"]}`}>
          <AiFillLike className={styles["like-icon"]} />
          {likeCount}
        </button>
        <button className={`${styles["reaction-item"]} ${styles["heart"]}`}>
          <FaHeart className={styles["heart-icon"]} />
          {heartCount}
        </button>
        <button className={`${styles["reaction-item"]} ${styles["dislike"]}`}>
          <AiFillDislike className={styles["dislike-icon"]} />
          {dislikeCount}
        </button>

        <div style={{ flexGrow: "1" }}></div>

        <button className={`${styles["reaction-item"]} ${styles["bookmark"]}`}>
          {isBookmarked && <FaBookmark className={styles["bookmark-icon"]} />}
          {!isBookmarked && (
            <FaRegBookmark className={styles["bookmark-icon"]} />
          )}
        </button>
      </div>
    </div>

    // <div key={postId} className={styles["card-item"]} onClick={onClick}>
    //   {postImg && <img src={postImg} className={styles["card-image"]} />}

    //   <div className={styles["card-details"]}>
    //     {title && <div className={styles["card-title"]}>{title}</div>}
    //     {author && <div className={styles["card-author"]}>{author}</div>}

    //     <div className={styles["card-info-wrapper"]}>
    //       {time && (
    //         <div className={styles["card-info"]}>
    //           <FaClock className={styles["card-info__icon"]} />
    //           <div className={styles["card-info__label"]}>{time}</div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default Card;
