import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { FaSquareFacebook, FaSquareGithub, FaYoutube } from "react-icons/fa6";
import { useToastContext } from "../../context/ToastContext";
import Card from "../../components/Card/Card";

interface popularDishStructure {
  id: string;
  title: string;
  coverImg: string;
}

// const popularDish = [
//   {
//     id: "1",
//     title: "Food",
//     coverImg: "/src/assets/Food_thumb_01.jpg",
//   },
//   {
//     id: "2",
//     title: "Banana",
//     coverImg: "/src/assets/Food_thumb_02.jpg",
//   },
//   {
//     id: "3",
//     title: "Pasta",
//     coverImg: "/src/assets/Food_thumb_03.jpg",
//   },
//   {
//     id: "4",
//     title: "Burger",
//     coverImg: "/src/assets/Food_thumb_04.jpg",
//   },
//   {
//     id: "5",
//     title: "Salad",
//     coverImg: "/src/assets/Food_thumb_05.jpg",
//   },
//   {
//     id: "6",
//     title: "Pizza",
//     coverImg: "/src/assets/Food_thumb_06.jpg",
//   },
//   {
//     id: "7",
//     title: "Sushi",
//     coverImg: "/src/assets/Food_thumb_07.jpg",
//   },
//   {
//     id: "8",
//     title: "Steak",
//     coverImg: "/src/assets/Food_thumb_08.jpg",
//   },
//   {
//     id: "9",
//     title: "Ice Cream",
//     coverImg: "/src/assets/Food_thumb_09.jpg",
//   },
//   {
//     id: "10",
//     title: "Soup",
//     coverImg: "/src/assets/Food_thumb_10.jpg",
//   },
// ];

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
  const [scrollY, setScrollY] = useState<number>(0); //Parallax Var
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [popularDish, setPopularDish] = useState<popularDishStructure[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const { Toast } = useToastContext();

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

  const fetchPopularDish = async () => {
    try {
      const res = await fetch("http://localhost:4000/ranking/popular-dish");

      if (!res.ok) throw new Error("xdd");

      const data = await res.json();

      setPopularDish(data.popularDish);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPopularDish();
  }, []);

  useEffect(() => {
    popularDish.length !== 0 ? setLoaded(true) : setLoaded(false);
  }, [popularDish]);

  //Transform translate value with hard limit tie to the header height
  const translateVal = Math.min(headerHeight / 4, scrollY / 4);

  return (
    <>
      {/*Banner Image with parallax inline styling*/}
      <header
        className={styles["header"]}
        style={{ transform: `translateY(${translateVal}px)` }}
        onClick={() =>
          Toast({ type: "error", title: "Error", message: "Error message" })
        }
      >
        <div className={styles["header-title"]}>
          Bring&nbsp;
          <span style={{ color: "#ef4444", fontWeight: "900" }}>joy</span>
          &nbsp;to your cooking
        </div>
      </header>

      <main className={styles["content"]}>
        <section className={styles["popular-ingredients"]}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginBottom: "1rem",
            }}
          >
            Popular Dishes
          </div>

          <div
            style={{
              display: "grid",
              gap: "0.5rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(8rem, 1fr))",
            }}
          >
            <>
              {loaded &&
                popularDish.map((item) => {
                  return (
                    <Card
                      key={item.id}
                      postID={item.id}
                      title={item.title}
                      cardType="food"
                      postImg={item.coverImg}
                      cardLoaded={true}
                      rounded={true}
                    />
                  );
                })}

              {!loaded &&
                Array.from({ length: 10 }).map((_, i) => {
                  return (
                    <Card
                      key={i}
                      postID={i.toString()}
                      title={""}
                      cardType="food"
                      postImg={""}
                      cardLoaded={false}
                      rounded={true}
                    />
                  );
                })}
            </>
          </div>
        </section>
      </main>

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
        <section className={styles["contacts"]}>
          <img src="/src/assets/happy-recipe-logo.png" width="128px" />

          <div className={styles["contacts-hyperlink"]}>
            <div className={styles["hyperlink-section"]}>
              <h3>Contacts</h3>

              <ul style={{ listStyle: "none" }}>
                {contacts.map((item) => {
                  return (
                    <li
                      key={item.title}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                      onClick={() => {
                        window.open(item.url, "_blank");
                      }}
                    >
                      <item.icon
                        style={{ textAlign: "left" }}
                        className={`${styles["hyperlink-item"]} ${styles["contact-icon"]}`}
                      />

                      <span>{item.title}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      </footer>

      <img className={styles["footer-banner"]} src="/src/assets/Footer.jpg" />
    </>
  );
};

export default Home;
