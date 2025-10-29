import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSquareFacebook, FaSquareGithub, FaYoutube } from "react-icons/fa6";
import Card from "../../components/Card/Card";

//Dummy Data
const data = [
  {
    id: "01",
    title: "Zesty Curry",
    author: "Alan",
    time: "17 min",
    difficulty: "easy",
    serving: "2-4",
  },
  {
    id: "02",
    title: "Sweet Burger",
    author: "Bella",
    time: "43 min",
    difficulty: "hard",
    serving: "2-4",
  },
  {
    id: "03",
    title: "Crispy Salad",
    author: "Chris",
    time: "25 min",
    difficulty: "medium",
    serving: "2-4",
  },
  {
    id: "04",
    title: "Hearty Soup",
    author: "Dyson",
    time: "9 min",
    difficulty: "easy",
    serving: "2-4",
  },
  {
    id: "05",
    title: "Tangy Sandwich",
    author: "Eve",
    time: "32 min",
    difficulty: "easy",
    serving: "2-4",
  },
];

const chefList = [
  {
    id: "1",
    name: "Nichikou",
    description: "Head chef at ABC",
  },
  {
    id: "2",
    name: "Hanami",
    description: "Cheft at ABC",
  },
  {
    id: "3",
    name: "Haruki",
    description: "HR",
  },

  {
    id: "4",
    name: "Haruki",
    description: "HR",
  },

  {
    id: "5",
    name: "Haruki",
    description: "HR",
  },
];

const Home = () => {
  const [scrollY, setScrollY] = useState<number>(0); //Parallax Var
  const navigate = useNavigate();

  //update Scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const margin_top = scrollY * 0.25; //Transform Translate

  return (
    <>
      {/*Banner Image*/}
      <header
        className={styles["header"]}
        style={{ transform: `translateY(${margin_top}px)` }}
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
                  postId={id}
                  onClick={() => {
                    navigate(`/post/${id}`);
                  }}
                  cardType="post"
                  postImg={`/src/assets/Food_thumb_${id}.jpg`}
                  title={title}
                  author={author}
                  time={time}
                  difficulty={difficulty}
                  serving={serving}
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

          <div className={styles["chef-card-container"]}>
            {chefList.map(({ id, name, description }) => {
              return (
                <div key={id} className={styles["chef-card-item"]}>
                  <img
                    src="/src/assets/home-image.png"
                    width={"100px"}
                    className={styles["chef-profile-image"]}
                  />
                  <div className={styles["chef-name"]}>{name}</div>
                  <div className={styles["chef-description"]}>
                    {description}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        {/* <section className={styles["chef-recommendation"]}>
          <h2 className={styles["recommendation-title"]}>
            Recipes from our professional chefs
          </h2>

          <div className={styles["recommendation-card-container"]}>
            {data.map(({ id, title, author, time, serving, difficulty }) => {
              return (
                <Card
                  key={id}
                  postId={id}
                  onClick={() => {
                    navigate(`/post/${id}`);
                  }}
                  postImg={`/src/assets/Food_thumb_${id}.jpg`}
                  title={title}
                  author={author}
                  time={time}
                  difficulty={difficulty}
                  serving={serving}
                />
              );
            })}

            <button
              className={`${styles["card-item"]} ${styles["see-more"]}`}
              onClick={() => {
                navigate("xdd");
              }}
            >
              More Recipe
            </button>
          </div>
        </section> */}
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
