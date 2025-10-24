import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../../components/Card/Card";

//Dummy Data
const data = [
  { id: "01", title: "Zesty Curry", author: "Alan", time: "17 min" },
  { id: "02", title: "Sweet Burger", author: "Bella", time: "43 min" },
  { id: "03", title: "Crispy Salad", author: "Chris", time: "25 min" },
  { id: "04", title: "Hearty Soup", author: "Dyson", time: "9 min" },
  { id: "05", title: "Tangy Sandwich", author: "Eve", time: "32 min" },
];

const Home = () => {
  const [bookmarked, setBookmarked] = useState<boolean>(true);
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
      <div
        className={styles["header"]}
        style={{ transform: `translateY(${margin_top}px)` }}
      >
        <img
          src="/src/assets/home-image.png"
          width="100%"
          className={styles["header-image"]}
        />
        <div className={styles["header-label-wrapper"]}>
          <div className={styles["header-quote"]}>
            Bring&nbsp;
            <span style={{ color: "#ef4444", textDecoration: "underline" }}>
              joy
            </span>
            &nbsp;to your cooking
          </div>
          <button
            className={styles["header-link"]}
            onClick={() => {
              navigate("/about");
            }}
          >
            About Us
          </button>
        </div>
      </div>

      <main className={styles["content"]}>
        <section className={styles["recommendation"]}>
          <h2 className={styles["recommendation-title"]}>
            Recipes from our professional chefs
          </h2>

          <div className={styles["recommendation-card-container"]}>
            {data.map(({ id, title, author, time }) => {
              return (
                <Card
                  key={id}
                  id={id}
                  onClick={() => {
                    navigate(`/${id}`);
                  }}
                  image="/src/assets/home-image.png"
                  title={title}
                  author={author}
                  time={time}
                  useLike={true}
                  Like={bookmarked}
                  onLike={(e) => {
                    e.stopPropagation();
                    setBookmarked(!bookmarked);
                  }}
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
        </section>
      </main>

      <div className={styles["footer"]}>
        <img
          className={styles["footer-logo"]}
          src="/src/assets/happy-recipe-logo.png"
          width="100px"
        />
        <div className={styles["footer-details"]}>
          <div className={styles["footer-title"]}>Learn More</div>
          <div className={styles["footer-item"]}>About us</div>
          <div className={styles["footer-title"]}>Contacts</div>
          <div className={styles["footer-item"]}>A</div>
          <div className={styles["footer-item"]}>B</div>
        </div>

        <img
          className={styles["footer-logo"]}
          src="/src/assets/happy-recipe-logo.png"
          width="100px"
        />
      </div>
    </>
  );
};

export default Home;
