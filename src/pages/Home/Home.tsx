import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSquareFacebook, FaSquareGithub, FaYoutube } from "react-icons/fa6";
import Card from "../../components/Card/Card";

//Dummy structure
interface postStructure {
  id: string;
  title: string;
  author: string;
  time: number;
  serving: number;
  difficulty: "easy" | "medium" | "hard";
  likeCount: number;
  heartCount: number;
  dislikeCount: number;
}

// Dummy Data
const data: postStructure[] = [
  {
    id: "01",
    title: "Zesty Curry",
    author: "Alan",
    time: 17,
    difficulty: "easy",
    serving: 2,
    likeCount: 240,
    heartCount: 180,
    dislikeCount: 8,
  },
  {
    id: "02",
    title: "Sweet Burger",
    author: "Bella",
    time: 43,
    difficulty: "hard",
    serving: 5,
    likeCount: 320,
    heartCount: 250,
    dislikeCount: 14,
  },
  {
    id: "03",
    title: "Crispy Salad",
    author: "Chris",
    time: 25,
    difficulty: "medium",
    serving: 4,
    likeCount: 180,
    heartCount: 130,
    dislikeCount: 5,
  },
  {
    id: "04",
    title: "Hearty Soup",
    author: "Dyson",
    time: 9,
    difficulty: "easy",
    serving: 3,
    likeCount: 210,
    heartCount: 160,
    dislikeCount: 6,
  },
  {
    id: "05",
    title: "Tangy Sandwich",
    author: "Eve",
    time: 32,
    difficulty: "easy",
    serving: 2,
    likeCount: 260,
    heartCount: 200,
    dislikeCount: 10,
  },
];

const Home = () => {
  const [scrollY, setScrollY] = useState<number>(0); //Parallax Var
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const navigate = useNavigate();

  /**
   * Get the header height
   * Add an event listener for scroll, update scrollY position
   */
  useEffect(() => {
    setHeaderHeight(
      document.getElementsByClassName(styles.header)[0].clientHeight
    );

    const handleScroll = () => {
      setScrollY(Math.min(Math.max(0, window.scrollY)));
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Transform translate value with hard limit tie to the header height
  const translateVal = Math.min(headerHeight / 4, scrollY / 4);

  return (
    <>
      {/*Banner Image with parallax inline styling*/}
      <header
        className={styles["header"]}
        style={{ transform: `translateY(${translateVal}px)` }}
      >
        <div className={styles["header-title"]}>
          Bring&nbsp;
          <span style={{ color: "#ef4444", textDecoration: "underline" }}>
            joy
          </span>
          &nbsp;to your cooking
        </div>
      </header>

      <main className={styles["content"]}>
        <section className={styles["weekly-recommendation"]}>
          <h2 className={styles["recommendation-title"]}>
            This Week's Specials
          </h2>

          <div className={styles["recommendation-card-container"]}>
            {data.map(({ id, title, author, time, serving, difficulty }) => {
              return (
                <Card
                  key={id}
                  onClick={() => {
                    navigate(`/post/${id}`);
                  }}
                  cardType="post"
                  cardLoaded={true}
                  postImg={`/src/assets/Food_thumb_${id}.jpg`}
                  title={title}
                  author={author}
                  time={time}
                  difficulty={difficulty}
                  serving={serving}
                  likeCount={0}
                  heartCount={0}
                  dislikeCount={0}
                  isBookmarked={false}
                />
              );
            })}
          </div>

          <button
            onClick={() => {
              navigate("/discover");
            }}
            className={styles["discover-more"]}
          >
            Discover More
          </button>
        </section>

        <section className={styles["about"]}>
          <h3>About Happy Recipe</h3>
          <p>
            Happy Recipe is a small and passionate project aimed at&nbsp;
            <b>
              bringing recipes from all around the world to the comfort of your
              own kitchen
            </b>
            .
            <br />
            We provide a platform where passionate users and chefs can connect
            and share their own culture through the lens of cuisine.
            <br />
            We believe that cooking is meant to be a joyful time and hope to
            bring that vision to life.
          </p>
        </section>
      </main>

      <footer className={styles["footer"]}>
        <section className={styles["footer-info-wrapper"]}>
          <img src="/src/assets/happy-recipe-logo.png" width="128px" />

          <div className={styles["footer-hyperlink"]}>
            <div className={styles["hyperlink-section"]}>
              <h3>Contacts</h3>
              <div></div>
              <FaSquareFacebook
                className={`${styles["hyperlink-item"]} ${styles["contact-icon"]}`}
                onClick={() => {
                  window.open("https://facebook.com", "_blank");
                }}
              />
              <FaYoutube
                className={`${styles["hyperlink-item"]} ${styles["contact-icon"]}`}
                onClick={() => {
                  window.open("https://youtube.com", "_blank");
                }}
              />
              <FaSquareGithub
                className={`${styles["hyperlink-item"]} ${styles["contact-icon"]}`}
                onClick={() => {
                  window.open("https://github.com", "_blank");
                }}
              />
            </div>
          </div>
        </section>

        <img className={styles["footer-banner"]} src="/src/assets/Footer.jpg" />
      </footer>
    </>
  );
};

export default Home;
