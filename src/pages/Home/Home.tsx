import styles from "./Home.module.css";
import { useState, useEffect, useMemo } from "react";
import { FaSquareFacebook, FaSquareGithub, FaYoutube } from "react-icons/fa6";
import Card from "../../components/Card/Card";

interface popularDishStructure {
  id: string;
  title: string;
  coverImg: string;
}

const contacts = [
  {
    icon: FaSquareFacebook,
    url: "https://facebook.com",
    title: "Fb",
  },

  {
    icon: FaYoutube,
    url: "https://youtube.com",
    title: "Ytb",
  },
  {
    icon: FaSquareGithub,
    url: "https://github.com",
    title: "Git",
  },
];

const Home = () => {
  //Parallax Var
  const [scrollY, setScrollY] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  //Popular Dish State
  const [popularDish, setPopularDish] = useState<popularDishStructure[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  //Parallax Effect - Update scrollY state on scroll;
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
  const translateVal = useMemo(
    () => Math.min(headerHeight / 4, scrollY / 4),
    [headerHeight, scrollY]
  );


  useEffect(() => {
    //Fetch popular dish from backend
    const fetchPopularIngredients = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/ranking/popular-dish`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        if (!res.ok) throw new Error("Unable to fetch popular dish data");
        const data = await res.json();

        setPopularDish(data.popularDish);
      } catch (e) {
        console.log(e);
      }
    };

    fetchPopularIngredients();
  }, []);

  //Set loaded state based on popularDish data
  useEffect(() => {
    popularDish.length !== 0 ? setLoaded(true) : setLoaded(false);
  }, [popularDish]);

  return (
    <>
      {/*Banner Image with parallax inline styling*/}
      <header
        className={styles["header"]}
        style={{ transform: `translateY(${translateVal}px)` }}
      >
        <h1 className={styles["header-title"]}>
          Bring&nbsp;
          <span style={{ color: "#ef4444", fontWeight: "800" }}>joy</span>
          &nbsp;to your cooking
        </h1>
      </header>

      {/* Main content - Popular Ingredients Section */}
      <main className={styles["content"]}>
        <h2 className={styles["popular-dish-title"]}>Popular Dishes</h2>

        <div className={styles["popular-dish-container"]}>
          {loaded
            ? popularDish.map((item) => {
                return (
                  <Card
                    key={item.id}
                    postId={item.id}
                    title={item.title}
                    cardType="ingredients"
                    postImg={item.coverImg}
                    cardLoaded={true}
                    rounded={true}
                  />
                );
              })
            : Array.from({ length: 10 }).map((_, i) => {
                return (
                  <Card
                    key={i}
                    postId={i.toString()}
                    cardType="ingredients"
                    cardLoaded={false}
                    rounded={true}
                  />
                );
              })}
        </div>
      </main>

      {/* Footer Section */}
      <footer className={styles["footer"]}>
        <section className={styles["about-us"]}>
          <h3>About us</h3>

          <p>
            Happy Recipe is a passionate project aimed at&nbsp;
            <b>delivering joy and comfort to your own cooking</b>. We provide a
            platform where users can connect and share fantastic cuisine from
            all around the world. We believe that cooking is meant to be a
            joyful time and we hope to bring that vision to life.
          </p>
        </section>

        <section className={styles["contact-us"]}>
          <img src="/src/assets/happy-recipe-logo.png" />

          <div className={styles["contact-container"]}>
            <h3>Contacts</h3>

            <ul className={styles["contact-list"]}>
              {contacts.map((item) => {
                return (
                  <li
                    key={item.title}
                    onClick={() => {
                      window.open(item.url, "_blank");
                    }}
                    className={styles["contact-item"]}
                  >
                    <item.icon className={styles["contact-icon"]} />
                    <span>{item.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </footer>

      <img className={styles["footer-banner"]} src="/src/assets/Footer.jpg" />
    </>
  );
};

export default Home;
