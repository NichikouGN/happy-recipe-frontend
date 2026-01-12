import styles from "./Upload.module.css";
import postStyles from "../Post/Post.module.css";
import { IoClose } from "react-icons/io5";
import { Donut } from "../../utils/Post";
import { useCallback, useRef, useState } from "react";
import type { uploadPostStructure } from "./Upload";
import type { userInformation } from "../../types/userType";
import { FaCircleUser } from "react-icons/fa6";

const Preview = ({
  uploadPost,
  userInformation,
  setShowPreview,
}: {
  uploadPost: uploadPostStructure;
  userInformation: userInformation;
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(Array(uploadPost.steps.length + 1).fill(false));

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
       url("${uploadPost.coverImgFile && URL.createObjectURL(uploadPost.coverImgFile)}")`,
        }}
      >
        <div className={styles["close-preview-container"]}>
          <button className={styles["close-preview"]} onClick={() => setShowPreview(false)}>
            <IoClose size={32} />
          </button>
        </div>
      </header>
      <main className={postStyles["content"]}>
        <h1 className={postStyles["title"]}>{uploadPost.title}</h1>

        <section className={postStyles["author-group"]}>
          {userInformation.profileImageUrl ? (
            <button
              style={{ backgroundImage: `url('${userInformation.profileImageUrl}')` }}
              className={postStyles["author-avatar"]}
            />
          ) : (
            <FaCircleUser className={postStyles["author-avatar"]} />
          )}
          <span className={postStyles["author-name"]}>{userInformation.username}</span>
        </section>

        <section className={postStyles["info-panel"]}>
          <div className={postStyles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: Math.min((Number(uploadPost.cookTime) / 60) * 100, 100),
              text: uploadPost.cookTime != null ? uploadPost.cookTime.toString() : "-",
            })}
            <div className={postStyles["info"]} style={{ fontSize: "1.1rem" }}>
              Minute
            </div>
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
            <div className={postStyles["info"]} style={{ fontSize: "1.1rem" }}>
              Difficulty
            </div>
          </div>
          <div className={postStyles["info"]}>
            {Donut({
              size: 60,
              strokeWidth: 4,
              progress: Math.min(
                ((uploadPost.servings != null ? uploadPost.servings : 0) / 8) * 100,
                100
              ),
              text: uploadPost.servings != null ? uploadPost.servings.toString() : "-",
            })}
            <div className={postStyles["info"]} style={{ fontSize: "1.1rem" }}>
              Servings
            </div>
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
                height: isCollapsed[0] ? "0" : heightRef.current[0]?.scrollHeight,
              }}
              className={`${postStyles["card-content"]} ${
                postStyles[`${isCollapsed[0] ? "collapsed" : "expanded"}`]
              }`}
            >
              <div className={postStyles["card-content-inner"]}>{uploadPost.description}</div>
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
                  <div className={postStyles["card-title"]}>Step {item.stepNum}</div>
                  <IoClose
                    className={`${postStyles["card-title-icon"]} ${
                      postStyles[`${isCollapsed[index + 1] ? "collapsed" : "expanded"}`]
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
                    postStyles[`${isCollapsed[index + 1] ? "collapsed" : "expanded"}`]
                  }`}
                >
                  {item.stepImgFile && (
                    <img
                      height="auto"
                      className={postStyles["card-image"]}
                      src={URL.createObjectURL(item.stepImgFile)}
                    />
                  )}

                  <div className={postStyles["card-content-inner"]}>{item.stepDesc}</div>
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
