import { useState, useEffect } from "react";
import styles from "./Search.module.css";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [topBarPos, setTopBarPos] = useState<number>(0);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const navigate = useNavigate();

  //Top bar parallax
  useEffect(() => {
    //Retrieve height of the top bar
    const topBarHeight = document.getElementsByClassName(styles.header)[0]
      .clientHeight;

    //Calculate parallax on scroll
    const handleScroll = () => {
      let delta = 0;
      let currentScrollY = Math.max(0, window.scrollY);

      delta = currentScrollY - lastScrollY;

      setTopBarPos(Math.max(-topBarHeight, Math.min(0, topBarPos - delta)));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <header
        className={styles["header"]}
        style={{ transform: `translateY(${topBarPos}px)` }}
      >
        <div
          className={styles["header-item"]}
          onClick={() => {
            navigate("/discover");
          }}
        >
          Discover
        </div>
        <div className={`${styles["header-item"]} ${styles["current"]}`}>
          Search
        </div>
      </header>
      <main className={styles["content"]}></main>
      <footer className={styles["footer"]}></footer>
    </>
  );
};

export default Search;
