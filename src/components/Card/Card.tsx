import React from "react";
import styles from "./Card.module.css";
import { FaClock, FaRegHeart, FaHeart } from "react-icons/fa";

interface CardProps {
  id?: string;
  image?: string;
  title?: string;
  author?: string;
  time?: string;
  useLike: boolean;
  Like?: boolean;
  onLike?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClick?: () => void;
}

const Card = ({
  id,
  image,
  title,
  author,
  time,
  useLike,
  Like,
  onLike,
  onClick,
}: CardProps) => {
  return (
    <div key={id} id={id} className={styles["card-item"]} onClick={onClick}>
      {image && <img src={image} className={styles["card-image"]} />}

      <div className={styles["card-details"]}>
        {title && <div className={styles["card-title"]}>{title}</div>}
        {author && <div className={styles["card-author"]}>{author}</div>}

        <div className={styles["card-info-wrapper"]}>
          {time && (
            <div className={styles["card-info"]}>
              <FaClock className={styles["card-info__icon"]} />
              <div className={styles["card-info__label"]}>{time}</div>
            </div>
          )}

          {useLike && (
            <button className={styles["card-like"]} onClick={onLike}>
              {Like ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
