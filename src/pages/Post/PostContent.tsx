import { useCallback, useEffect, useRef, useState } from "react";
import type { FullPostStructure } from "../../context/PostContext";
import styles from "./Post.module.css";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../../context/ToastContext";
import { FaClock, FaFire, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdDinnerDining } from "react-icons/md";
import { FaCircleUser, FaHeart } from "react-icons/fa6";
import { LuText } from "react-icons/lu";
import { AiFillLike } from "react-icons/ai";
import { GiForkKnifeSpoon } from "react-icons/gi";

interface POST_CONTENT_PROPS {
  detailedPost: FullPostStructure;
}

const Donut = ({ size = 120, strokeWidth = 10, progress = 30, text = "" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size}>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#bbb"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#f87171"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // start from top
      />

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="1.25rem"
        fill="black"
        fontWeight="bolder"
      >
        {text}
      </text>
    </svg>
  );
};

const PostContent = ({ detailedPost }: POST_CONTENT_PROPS) => {
  const { Toast } = useToastContext();
  const [isCollapsed, setIsCollapsed] = useState(
    Array(detailedPost.steps.length + 1).fill(false)
  );
  const [scrollY, setScrollY] = useState<number>(0); //Parallax Var
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const navigate = useNavigate();
  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const heightRef = useRef<(HTMLDivElement | null)[]>([]);

  <div></div>;

  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.scrollHeight);

    const handleScroll = () => {
      setScrollY(Math.min(Math.max(0, window.scrollY)));
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const translateVal = Math.min(headerHeight / 4, scrollY / 4);

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Prevent keyboard from showing
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleClick = useCallback(
    (index: number) => {
      setIsCollapsed((prev) =>
        prev.map((state, i) => {
          return i === index ? !state : state;
        })
      );
    },
    [isCollapsed]
  );

  useEffect(() => {
    console.log(isCollapsed);
  }, [isCollapsed]);

  return (
    <>
      <header
        ref={headerRef}
        className={styles["header"]}
        style={{
          transform: `translateY(${translateVal}px)`,
          backgroundImage: `radial-gradient(
         rgba(0, 0, 0, 0.25) 0%,
         rgba(0, 0, 0, 0.25) 100%
      ),
       url("${detailedPost.coverImgURL}")`,
        }}
      >
        <div className={styles["action-bar"]}>
          <button
            className={styles["action-btn"]}
            onClick={() => {
              navigate("/");
            }}
          >
            <IoClose />
          </button>
          <button
            className={styles["action-btn"]}
            onClick={() => {
              copyToClipboard(window.location.href);
              Toast({
                type: "info",
                title: "Share",
                message: "Successfully copied link to clipboard",
              });
            }}
          >
            <IoIosShareAlt />
          </button>
        </div>
      </header>
      <main className={styles["content"]}>
        <h1 className={styles["title"]}>{detailedPost.title}</h1>

        <section className={styles["author-group"]}>
          <img />
          <span className={styles["author-name"]}>
            {detailedPost.authorName}
          </span>
        </section>

        <section className={styles["info-panel"]}>
          <div className={styles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: Math.min(
                (Number(detailedPost.cookTime) / 60) * 100,
                100
              ),
              text: detailedPost.cookTime.toString(),
            })}
            <div className={styles["info"]}>Minute</div>
          </div>
          <div className={styles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress:
                detailedPost.difficulty === "easy"
                  ? 33
                  : detailedPost.difficulty === "medium"
                  ? 67
                  : 100,
              text: detailedPost.difficulty[0].toUpperCase(),
            })}
            <div className={styles["info"]}>Difficulty</div>
          </div>
          <div className={styles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: (detailedPost.servings / 8) * 100,
              text: detailedPost.servings.toString(),
            })}
            <div className={styles["info"]}>Servings</div>
          </div>
        </section>

        <section className={styles["card-container"]}>
          <div className={styles["card"]} style={{ border: "none" }}>
            <button
              className={styles["card-title-group"]}
              onClick={() => {
                handleClick(0);
              }}
            >
              <div className={styles["card-title"]}>Description</div>
              <IoClose
                className={`${styles["card-title-icon"]} ${
                  styles[`${isCollapsed[0] ? "collapsed" : "expanded"}`]
                }`}
              />
            </button>
            <div
              ref={(el) => {
                heightRef.current[0] = el;
              }}
              style={{
                height: isCollapsed[0]
                  ? "0"
                  : heightRef.current[0]?.scrollHeight,
              }}
              className={`${styles["card-content"]} ${
                styles[`${isCollapsed[0] ? "collapsed" : "expanded"}`]
              }`}
            >
              <div className={styles["card-content-inner"]}>
                {detailedPost.description}
              </div>
            </div>
          </div>

          {detailedPost.steps.map((item, index) => {
            return (
              <div key={index + 1} className={styles["card"]}>
                <button
                  className={styles["card-title-group"]}
                  onClick={() => {
                    handleClick(index + 1);
                  }}
                >
                  <div className={styles["card-title"]}>
                    Step {item.stepNum}
                  </div>
                  <IoClose
                    className={`${styles["card-title-icon"]} ${
                      styles[
                        `${isCollapsed[index + 1] ? "collapsed" : "expanded"}`
                      ]
                    }`}
                  />
                </button>
                <div
                  ref={(el) => {
                    heightRef.current[index + 1] = el;
                  }}
                  style={{
                    height: isCollapsed[index + 1]
                      ? "0"
                      : heightRef.current[index + 1]?.scrollHeight,
                  }}
                  className={`${styles["card-content"]} ${
                    styles[
                      `${isCollapsed[index + 1] ? "collapsed" : "expanded"}`
                    ]
                  }`}
                >
                  <div className={styles["card-content-inner"]}>
                    {item.stepDesc}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
};

export default PostContent;
