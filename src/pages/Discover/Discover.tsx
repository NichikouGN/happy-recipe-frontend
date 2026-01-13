import styles from "./Discover.module.css";
import { useState, useEffect } from "react";
import DiscoverSkeleton from "./DiscoverSkeleton";
import DiscoverContent from "./DiscoverContent";
import { Link } from "react-router-dom";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useDiscover } from "../../context/DiscoverContext";

const Discover = () => {
  const { postList, isFetchingNextPage, discoverScrollY } = useDiscover();

  const [topBarPos, setTopBarPos] = useState<number>(0);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  //Top bar parallax
  useEffect(() => {
    const topBarHeight = document.getElementsByClassName(styles.header)[0].clientHeight;

    const handleScroll = () => {
      let currentScrollY = Math.max(0, window.scrollY);
      let delta = currentScrollY - lastScrollY;

      setTopBarPos(Math.max(-topBarHeight, Math.min(0, topBarPos - delta)));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    window.scrollTo(0, discoverScrollY.current);
  }, []);

  return (
    <>
      <header className={styles["header"]} style={{ transform: `translateY(${topBarPos}px)` }}>
        <div className={`${styles["header-item"]} ${styles["current"]}`}>Discover</div>
        <Link to="/search" className={styles["header-item"]}>
          Search
        </Link>
      </header>
      <main className={styles["content"]}>
        <div className={styles["recommendation-card-container"]}>
          {postList.length === 0 ? <DiscoverSkeleton /> : <DiscoverContent />}
        </div>
      </main>
      <footer className={styles["footer"]}>
        {isFetchingNextPage && <FaArrowRotateRight className={styles["footer-item"]} />}
      </footer>
    </>
  );
};

export default Discover;
