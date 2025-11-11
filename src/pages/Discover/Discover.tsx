import styles from "./Discover.module.css";
import { useState, useEffect } from "react";
import { useDiscoveryContext } from "../../context/DiscoveryContext";
import DiscoverSkeleton from "./DiscoverSkeleton";
import DiscoverContent from "./DiscoverContent";
import { useNavigate } from "react-router-dom";
import { FaArrowRotateRight } from "react-icons/fa6";

const Discover = () => {
  const { postList, loadState, fetchPost, scrollY, setScrollY } =
    useDiscoveryContext();
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
      setScrollY(currentScrollY);

      delta = currentScrollY - lastScrollY;

      setTopBarPos(Math.max(-topBarHeight, Math.min(0, topBarPos - delta)));
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  //Init Fetch
  useEffect(() => {
    if (postList.length === 0) fetchPost();
  }, []);

  //Remember where the user was on the discover page
  useEffect(() => {
    if (loadState === "loading") window.scrollTo(0, 0);

    return () => window.scrollTo(0, scrollY);
  }, [loadState]);

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
          {loadState === "loading" ? <DiscoverSkeleton /> : <DiscoverContent />}
        </div>
      </div>
      <div className={styles["footer"]}>
        <FaArrowRotateRight className={styles["footer-item"]} />
      </div>
    </>
  );
};

export default Discover;
