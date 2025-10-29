import styles from "./Card.module.css";
import { FaClock, FaFire } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";

interface CardProps {
  postId: string;
  postImg?: string;
  title: string;
  author?: string;
  time?: string;
  serving: string;
  difficulty: string;
  cardType: "post" | "food";
  onClick: () => void;
}

const Card = ({
  postId,
  postImg,
  title,
  author,
  time,
  serving,
  difficulty,
  cardType,
  onClick,
}: CardProps) => {
  return (
    <div key={postId} className={styles["card-item"]} onClick={onClick}>
      <div
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 70%), url('${postImg}')`,
        }}
        className={styles["card-image"]}
      >
        <div className={styles["card-info-wrapper"]}>
          <div className={styles["card-info-blur"]} />
          {cardType === "post" && (
            <img
              src="/src/assets/happy-recipe-logo-text.png"
              className={styles["card-author-logo"]}
            />
          )}

          <div className={styles["card-details"]}>
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
          </div>
        </div>
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
