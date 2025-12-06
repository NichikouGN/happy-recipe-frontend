import styles from "./Upload.module.css";
import postStyles from "../Post/Post.module.css";
import { IoClose } from "react-icons/io5";
import { Donut } from "../Post/PostContent";
import { useCallback, useRef, useState } from "react";
import type { uploadPostStructure } from "./Upload";

const Preview = ({
  uploadPost,
  authorName,
  setShowPreview,
}: {
  uploadPost: uploadPostStructure;
  authorName: string;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(uploadPost.steps.length + 1).fill(false)
  );

  const heightRef = useRef<(HTMLDivElement | null)[]>([]);

  // Handle collapse toggle
  const handleCollapse = useCallback((index: number) => {
    setIsCollapsed((prev) =>
      prev.map((state, i) => {
        return i === index ? !state : state;
      })
    );
  }, []);

  return (
    <div className={styles["preview-overlay"]}>
      <header
        className={postStyles["header"]}
        style={{
          backgroundImage: `radial-gradient(
         rgba(0, 0, 0, 0.25) 0%,
         rgba(0, 0, 0, 0.25) 100%
      ),
       url("${uploadPost.coverImgUrl}")`,
        }}
      >
        <div className={styles["close-preview-container"]}>
          <button
            className={styles["close-preview"]}
            onClick={() => setShowPreview(false)}
          >
            <IoClose size={32} />
          </button>
        </div>
      </header>
      <main className={postStyles["content"]}>
        <h1 className={postStyles["title"]}>{uploadPost.title}</h1>

        <section className={postStyles["author-group"]}>
          <img />
          <span className={postStyles["author-name"]}>{authorName}</span>
        </section>

        <section className={postStyles["info-panel"]}>
          <div className={postStyles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: Math.min((Number(uploadPost.cookTime) / 60) * 100, 100),
              text: uploadPost.cookTime.toString(),
            })}
            <div className={postStyles["info"]}>Minute</div>
          </div>
          <div className={postStyles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress:
                uploadPost.difficulty === "easy"
                  ? 33
                  : uploadPost.difficulty === "medium"
                  ? 67
                  : 100,
              text: uploadPost.difficulty[0].toUpperCase(),
            })}
            <div className={postStyles["info"]}>Difficulty</div>
          </div>
          <div className={postStyles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: Math.min((uploadPost.servings / 8) * 100, 100),
              text: uploadPost.servings.toString(),
            })}
            <div className={postStyles["info"]}>Servings</div>
          </div>
        </section>

        <section className={postStyles["card-container"]}>
          <div className={postStyles["card"]} style={{ border: "none" }}>
            <button
              className={postStyles["card-title-group"]}
              onClick={() => {
                handleCollapse(0);
              }}
            >
              <div className={postStyles["card-title"]}>Description</div>
              <IoClose
                className={`${postStyles["card-title-icon"]} ${
                  postStyles[`${isCollapsed[0] ? "collapsed" : "expanded"}`]
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
              className={`${postStyles["card-content"]} ${
                postStyles[`${isCollapsed[0] ? "collapsed" : "expanded"}`]
              }`}
            >
              <div className={postStyles["card-content-inner"]}>
                {uploadPost.description}
              </div>
            </div>
          </div>

          {uploadPost.steps.map((item, index) => {
            return (
              <div key={index + 1} className={postStyles["card"]}>
                <button
                  className={postStyles["card-title-group"]}
                  onClick={() => {
                    handleCollapse(index + 1);
                  }}
                >
                  <div className={postStyles["card-title"]}>
                    Step {item.stepNum}
                  </div>
                  <IoClose
                    className={`${postStyles["card-title-icon"]} ${
                      postStyles[
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
                  className={`${postStyles["card-content"]} ${
                    postStyles[
                      `${isCollapsed[index + 1] ? "collapsed" : "expanded"}`
                    ]
                  }`}
                >
                  {item.stepImgURL && (
                    <img
                      height="auto"
                      className={postStyles["card-image"]}
                      src={item.stepImgURL}
                    />
                  )}

                  <div className={postStyles["card-content-inner"]}>
                    {item.stepDesc}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Preview;
