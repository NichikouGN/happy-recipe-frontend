import styles from "./Discover.module.css";
import { useState, useEffect } from "react";
import DiscoverSkeleton from "./DiscoverSkeleton";
import DiscoverContent from "./DiscoverContent";
import { useNavigate } from "react-router-dom";
import { FaArrowRotateRight } from "react-icons/fa6";
import { usePosts } from "../../context/PostContext";

const Discover = () => {
  const { postList, isFetchingNextPage, discoverScrollY } = usePosts();

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

  useEffect(() => {
    //Restore scroll position when navigating back to discover page
    window.scrollTo(0, discoverScrollY.current);
  }, []);

  return (
    <>
      <div
        className={styles["header"]}
        style={{ transform: `translateY(${topBarPos}px)` }}
      >
        <div className={`${styles["header-item"]} ${styles["current"]}`}>
          Discover
        </div>
        <div
          className={styles["header-item"]}
          onClick={() => {
            navigate("/search");
          }}
        >
          Search
        </div>
      </div>
      <div className={styles["content"]}>
        <div className={styles["recommendation-card-container"]}>
          {postList.length === 0 ? <DiscoverSkeleton /> : <DiscoverContent />}
        </div>
      </div>
      <div className={styles["footer"]}>
        {isFetchingNextPage && (
          <FaArrowRotateRight className={styles["footer-item"]} />
        )}
      </div>
    </>
  );
};

export default Discover;
