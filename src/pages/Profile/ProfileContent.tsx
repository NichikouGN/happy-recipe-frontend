import { FaUser } from "react-icons/fa";
import { useUserStore } from "../../stores/userStore";
import styles from "./Profile.module.css";
import { IoCopySharp, IoSettingsSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card";

const ProfileContent = ({ handleShare }: { handleShare: (text: string) => void }) => {
  const userInformation = useUserStore.getState().userInformation;

  const [postListType, setPostListType] = useState<"posts" | "bookmarks">("posts");
  return (
    <>
      <header className={styles["header"]}>
        <Link to="/profile/edit" className={styles["settings-button"]}>
          <MdEdit className={styles["settings-button-icon"]} />
        </Link>
        <Link to="/settings" className={styles["settings-button"]}>
          <IoSettingsSharp className={styles["settings-button-icon"]} />
        </Link>
      </header>
      <main className={styles["content"]}>
        {userInformation.profileImageUrl ? (
          <img src={userInformation.profileImageUrl} alt="Avatar" className={styles["avatar"]} />
        ) : (
          <FaUser className={styles["avatar"]} />
        )}
        <section
          className={styles["username"]}
          onClick={() => {
            handleShare(userInformation.userId);
          }}
        >
          <div>{userInformation.username}</div>
          <div className={styles["share-uid"]}>
            <IoCopySharp className={styles["share-uid-icon"]} />
          </div>
        </section>

        <section className={styles["follow-info"]}>
          <span>Followers</span>
          <span>Following</span>
        </section>

        <section className={styles["post-list"]}>
          <div className={styles["post-list-toggle-container"]}>
            <button
              className={`${styles["post-list-toggle"]} ${
                postListType === "posts" ? styles["current"] : ""
              }`}
              onClick={() => setPostListType("posts")}
            >
              <span>My Posts</span>
            </button>

            <button
              className={`${styles["post-list-toggle"]} ${
                postListType === "bookmarks" ? styles["current"] : ""
              }`}
              onClick={() => setPostListType("bookmarks")}
            >
              <span>Bookmarks</span>
            </button>
          </div>

          <div className={styles["post-list-content"]}>
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <Card
                  key={i}
                  postId={i.toString()}
                  cardType="post"
                  cardLoaded={false}
                  excludeReactionSection={true}
                  rounded={true}
                />
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfileContent;
