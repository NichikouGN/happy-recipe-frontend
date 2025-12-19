import styles from "./Home.module.css";
import { useState, useEffect, useMemo } from "react";
import { FaSquareFacebook, FaSquareGithub, FaYoutube } from "react-icons/fa6";
import Card from "../../components/Card/Card";
import { formatConsoleError } from "../../consoleError";

interface popularIngredientsStructure {
  id: string;
  title: string;
  coverImg: string;
}

const contacts = [
  {
    icon: FaSquareFacebook,
    url: "https://facebook.com",
    title: "Facebook",
  },

  {
    icon: FaYoutube,
    url: "https://youtube.com",
    title: "YouTube",
  },
  {
    icon: FaSquareGithub,
    url: "https://github.com",
    title: "GitHub",
  },
];

const Home = () => {
  //Parallax Var
  const [scrollY, setScrollY] = useState<number>(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  //Popular Dish State
  const [popularIngredients, setPopularIngredients] = useState<popularIngredientsStructure[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  //Parallax Effect - Update scrollY state on scroll;
  useEffect(() => {
    setHeaderHeight(document.getElementsByClassName(styles.header)[0].clientHeight);

    const handleScroll = () => {
      setScrollY(Math.min(Math.max(0, window.scrollY)));
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //Transform translate value with hard limit tie to the header height
  const translateVal = useMemo(() => Math.min(headerHeight, scrollY / 4), [headerHeight, scrollY]);

  useEffect(() => {
    //Fetch popular dish from backend
    const fetchPopularIngredients = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/ranking/popular-dish`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!res.ok) throw new Error("Unable to fetch popular dish data");
        const data = await res.json();

        setPopularIngredients(data.popularIngredients);
      } catch (e) {
        formatConsoleError("Home.tsx", "fetchPopularIngredients", e);
      }
    };

    // fetchPopularIngredients();
  }, []);

  //Set loaded state based on popularIngredients data
  useEffect(() => {
    popularIngredients.length !== 0 ? setLoaded(true) : setLoaded(false);
  }, [popularIngredients]);

  return (
    <div className={styles["container"]}>
      {/*Banner Image with parallax inline styling*/}
      <header className={styles["header"]} style={{ transform: `translateY(${translateVal}px)` }}>
        <h1 className={styles["header-title"]}>
          Bring&nbsp;
          <span style={{ color: "#ef4444", fontWeight: "900" }}>joy</span>
          &nbsp;to your cooking
        </h1>
      </header>

      {/* Main content - Popular Ingredients Section */}
      <main className={styles["content"]}>
        <div className={styles["content-wrapper"]}>
          <section className={styles["popular-dish-section"]}>
            <h2>Popular Dishes</h2>

            <div className={styles["popular-dish-container"]}>
              {loaded
                ? popularIngredients.map((item) => {
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
                : Array.from({ length: 8 }).map((_, i) => {
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
          </section>

          <section className={styles["about-us-section"]}>
            <h2>About us</h2>

            <p>
              Happy Recipe is a passionate project aimed at&nbsp;
              <b>delivering joy and comfort to your own cooking</b>. We provide a platform where
              users can connect and share fantastic cuisine from all around the world. We believe
              that cooking is meant to be a joyful time and we hope to bring that vision to life.
            </p>
          </section>
        </div>
      </main>

      {/* Footer Section */}
      <footer className={styles["footer"]}>
        <section className={styles["contact-us"]}>
          <h2>Contacts</h2>

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
        </section>
      </footer>

      <img className={styles["footer-banner"]} src="/src/assets/Footer.jpg" />
    </div>
  );
};

export default Home;
