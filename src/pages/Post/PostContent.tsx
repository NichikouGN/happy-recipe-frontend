import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePosts } from "../../context/PostContext";
import styles from "./Post.module.css";
import { IoClose } from "react-icons/io5";
import { IoIosShareAlt } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaHeart, FaRegBookmark } from "react-icons/fa";
import type { CommentStructure, FullPostStructure } from "../../types/PostType";
import Button from "../../components/Button/Button";
import Comments from "../../components/Comments/Comments";
import { formatConsoleError } from "../../consoleError";
import { Toast } from "../../stores/toastStore";
import { computeReactionState } from "../../api/posts";
import { AiFillLike } from "react-icons/ai";
import { GiForkKnifeSpoon } from "react-icons/gi";

export const reactionType = [
  { reactionType: "like", icon: AiFillLike, color: "var(--sky-500)" },
  { reactionType: "heart", icon: FaHeart, color: "var(--red-500)" },
  { reactionType: "yum", icon: GiForkKnifeSpoon, color: "var(--yellow-600)" },
] as const;

export const Donut = ({ size = 120, strokeWidth = 10, progress = 30, text = "" }) => {
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
        stroke="#ddd"
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

const PostContent = ({ detailedPost }: { detailedPost: FullPostStructure }) => {
  const { handleUserBookmark, handleUserReaction } = usePosts();

  const [commentPage, setCommentPage] = useState<number>(1);
  const [comments, SetComments] = useState<CommentStructure[]>([]);
  const [commentInitialized, setCommentInitialized] = useState<boolean>(false);

  const [isCollapsed, setIsCollapsed] = useState(Array(detailedPost.steps.length + 1).fill(false));
  const [scrollY, setScrollY] = useState<number>(0); //Parallax Var
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const navigate = useNavigate();

  const headerRef = useRef<HTMLHeadingElement | null>(null);
  const heightRef = useRef<(HTMLDivElement | null)[]>([]);
  const fetchTrigger = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${
          detailedPost.postId
        }/comments?page=${commentPage}&limit=5`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      // Append new comments to existing list
      const data = await res.json();

      SetComments((prev) => [...prev, ...data.comments]);
      setCommentPage((prev) => prev + 1);
      setCommentInitialized(true);
    } catch (error) {
      formatConsoleError("PostContent.tsx", "fetchComments", error);
    }
  };

  /**
   * Fetch replies for a specific parent comment
   * @param parentCommentID The ID of the parent comment to fetch replies for
   * @globals detailedPost, SetComments
   */
  const fetchReplies = async (parentCommentID: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/post/${
          detailedPost.postId
        }/comments/${parentCommentID}/replies?page=1&limit=15`,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch replies");
      }

      const data = await res.json();
      SetComments((prev) => {
        const curComments = prev.find((c) => c.commentId === parentCommentID);
        if (curComments) {
          curComments.replies = data.replies;
          curComments.nextRepliesPage = data.nextRepliesPage;
        }

        return [...prev];
      });
    } catch (error) {
      formatConsoleError("PostContent.tsx", "fetchReplies", error);
    }
  };

  // Intersection Observer to fetch comments when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          observer.disconnect();
          fetchComments();
        }
      },
      { threshold: 0.5 } //half of the reference is needed to trigger observer
    );

    if (fetchTrigger.current) observer.observe(fetchTrigger.current);

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  // Parallax effect for header
  useEffect(() => {
    if (headerRef.current) setHeaderHeight(headerRef.current.scrollHeight);

    const handleScroll = () => {
      setScrollY(Math.min(Math.max(0, window.scrollY)));
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const translateVal = Math.min(headerHeight / 4, scrollY / 4);

  /**
   * Copy text to clipboard
   * @param text The text to copy to the clipboard
   */
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

  // Handle share functionality
  const handleShare = async () => {
    if (!navigator.share) {
      copyToClipboard(window.location.href);
      Toast({
        type: "info",
        title: "Share",
        message: "Copied link to clipboard",
      });
    } else {
      navigator
        .share({
          title: detailedPost.title,
          url: window.location.href,
        })
        .catch((error) => {
          formatConsoleError("PostContent.tsx", "handleShare", error);
        });
    }
  };

  // Handle collapse/expand of card content
  const handleCollapse = useCallback(
    (index: number) => {
      setIsCollapsed((prev) =>
        prev.map((state, i) => {
          return i === index ? !state : state;
        })
      );
    },
    [isCollapsed]
  );

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
       url("${detailedPost.coverImgUrl}")`,
        }}
      >
        <div className={styles["action-bar"]}>
          <Button variant="rounded" size="medium" onClick={() => navigate("/discover")}>
            <IoClose className={styles["btn-icon"]} />
          </Button>

          <Button variant="rounded" size="medium" onClick={handleShare}>
            <IoIosShareAlt className={styles["btn-icon"]} />
          </Button>
        </div>

        <div className={`${styles["action-bar"]} ${styles["bookmark-bar"]}`}>
          <Button
            variant="rounded"
            size="medium"
            onClick={() => {
              handleUserBookmark(detailedPost.postId, !detailedPost.userActions.userBookmark);
            }}
          >
            {detailedPost.userActions.userBookmark ? (
              <FaBookmark className={styles["btn-icon"]} />
            ) : (
              <FaRegBookmark className={styles["btn-icon"]} />
            )}
          </Button>
        </div>
      </header>
      <main className={styles["content"]}>
        <h1 className={styles["title"]}>{detailedPost.title}</h1>

        <section className={styles["author-group"]}>
          <span className={styles["author-name"]}>{detailedPost.authorName}</span>
        </section>

        <section className={styles["info-panel"]}>
          <div className={styles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: Math.min((Number(detailedPost.cookTime) / 60) * 100, 100),
              text: detailedPost.cookTime?.toString(),
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
              // text: detailedPost?.difficulty[0]?.toUpperCase(),
            })}
            <div className={styles["info"]}>Difficulty</div>
          </div>
          <div className={styles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: Math.min((detailedPost.servings / 8) * 100, 100),
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
                handleCollapse(0);
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
                height: isCollapsed[0] ? "0" : heightRef.current[0]?.scrollHeight,
              }}
              className={`${styles["card-content"]} ${
                styles[`${isCollapsed[0] ? "collapsed" : "expanded"}`]
              }`}
            >
              <div className={styles["card-content-inner"]}>{detailedPost.description}</div>
            </div>
          </div>

          {detailedPost.steps.map((item, index) => {
            return (
              <div key={index + 1} className={styles["card"]}>
                <button
                  className={styles["card-title-group"]}
                  onClick={() => {
                    handleCollapse(index + 1);
                  }}
                >
                  <div className={styles["card-title"]}>Step {item.stepNum}</div>

                  <IoClose
                    className={`${styles["card-title-icon"]} ${
                      styles[`${isCollapsed[index + 1] ? "collapsed" : "expanded"}`]
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
                    styles[`${isCollapsed[index + 1] ? "collapsed" : "expanded"}`]
                  }`}
                >
                  {item.stepImgURL && (
                    <img height="auto" className={styles["card-image"]} src={item.stepImgURL} />
                  )}
                  <div className={styles["card-content-inner"]}>{item.stepDesc}</div>
                </div>
              </div>
            );
          })}
        </section>

        <section className={`${styles["reaction-wrapper"]}`}>
          {reactionType.map(({ reactionType, icon: Icon, color }) => {
            return (
              <button
                key={reactionType}
                style={{ "--reaction-color": color } as React.CSSProperties}
                className={`${styles["reaction-item"]} ${
                  detailedPost.userActions.userReaction === reactionType &&
                  styles[`reaction-highlight`]
                }`}
                onClick={() =>
                  handleUserReaction(
                    detailedPost.postId,
                    computeReactionState(reactionType, detailedPost.userActions.userReaction)
                  )
                }
              >
                <Icon className={`${styles["reaction-item-icon"]} `} />
                <span>{detailedPost.reactions[reactionType]}</span>
              </button>
            );
          })}
        </section>

        <section className={styles["comment-section"]} ref={fetchTrigger}>
          <div className={styles["user-comments"]}>
            <div></div>
            <input className={styles["comment-input"]} placeholder="Add a comment..." />
          </div>

          <div className={styles["comment-list"]}>
            <Comments
              comments={comments}
              fetchReplies={fetchReplies}
              commentInitialized={commentInitialized}
              layer={0}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default PostContent;
