import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaClock, FaFireFlameCurved } from "react-icons/fa6";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

const data = [
  { title: "Zesty Curry", time: "17 min", difficulty: "medium" },
  { title: "Sweet Burger", time: "43 min", difficulty: "hard" },
  { title: "Crispy Salad", time: "25 min", difficulty: "easy" },
  { title: "Hearty Soup", time: "9 min", difficulty: "medium" },
  { title: "Tangy Sandwich", time: "32 min", difficulty: "hard" },
  { title: "Spicy Pasta", time: "6 min", difficulty: "easy" },
];
const Home = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const margin_top = scrollY * 0.2;
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
            Bring joy to your cooking
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
        <div className={styles["chef-group"]}>
          <div className={styles["chef-group__title"]}>
            - Recipes from our professional chefs -
          </div>

          <div className={styles["chef-group__card-container"]}>
            {data.map(({ title, time, difficulty }) => {
              return (
                <div className={styles["card-item"]}>
                  <img
                    src="/src/assets/home-image.png"
                    className={styles["card-item__image"]}
                  />

                  <div className={styles["card-item__info-group"]}>
                    <div className={styles["info-group__label"]}>{title}</div>
                    <div className={styles["info-group__wrapper"]}>
                      <div className={styles["time"]}>
                        <FaClock className={styles["time-icon"]} />
                        <div className={styles["time-label"]}>{time}</div>
                      </div>

                      <div className={styles["time"]}>
                        <FaFireFlameCurved className={styles["time-icon"]} />
                        <div className={styles["time-label"]}>{difficulty}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              className={styles["see-more"]}
              onClick={() => {
                navigate("xdd");
              }}
            >
              -- Explore More Recipe --
            </button>
          </div>
        </div>
      </main>

      <div className={styles["footer"]}></div>
    </>
  );
};

export default Home;
