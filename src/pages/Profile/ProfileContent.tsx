import { FaUser } from "react-icons/fa";
import { useUserStore } from "../../stores/userStore";
import styles from "./Profile.module.css";
import { IoCopySharp, IoSettingsSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card/Card";
import type { PostStructure } from "../../types/PostType";
import { Toast } from "../../stores/toastStore";

const ProfileContent = ({ handleShare }: { handleShare: (text: string) => void }) => {
  const userInformation = useUserStore.getState().userInformation;
  const [postListType, setPostListType] = useState<"posts" | "bookmarks">("posts");

  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostStructure[]>([]);
  const [bookmarkedPage, setBookmarkedPage] = useState(1);

  const [userPosts, setUserPosts] = useState<PostStructure[]>([]);
  const [userPostsPage, setUserPostsPage] = useState(1);

  const postTrigger = useRef<HTMLDivElement>(null);
  const bookmarkTrigger = useRef<HTMLDivElement>(null);

  const fetchBookmarkedPosts = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/${
          userInformation.userId
        }/bookmarks?page=${bookmarkedPage}`
      );
      const data = await res.json();
      setBookmarkedPosts(data.bookmarkedPosts);
    } catch (error) {
      Toast({ type: "error", title: "Error", message: "Unable to Fetch" });
    }
  }, [bookmarkedPage]);

  const fetchUserPosts = useCallback(async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/${
          userInformation.userId
        }/posts?page=${userPostsPage}`
      );
      const data = await res.json();
      setUserPosts(data.userPosts);
    } catch (error) {
      Toast({ type: "error", title: "Error", message: "Unable to Fetch" });
    }
  }, [userPostsPage]);

  useEffect(() => {
    const postObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          postObserver.disconnect();

          setUserPostsPage((prev) => prev + 1);
          fetchUserPosts();
        }
      },
      { threshold: 0.5 } //half of the reference is needed to trigger observer
    );

    if (postTrigger.current) postObserver.observe(postTrigger.current);

    return () => {
      if (postObserver) postObserver.disconnect();
    };
  }, [postListType]);

  useEffect(() => {
    const bookmarkObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          bookmarkObserver.disconnect();
          setBookmarkedPage((prev) => prev + 1);
          fetchBookmarkedPosts();
        }
      },
      { threshold: 0.5 }
    );

    if (bookmarkTrigger.current) bookmarkObserver.observe(bookmarkTrigger.current);

    return () => {
      if (bookmarkObserver) bookmarkObserver.disconnect();
    };
  }, [postListType]);

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

        <section className={styles["bio"]}>
          <span>{userInformation.bio}</span>
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
            {postListType === "posts"
              ? userPosts && userPosts.length > 0
                ? userPosts.map((post, index) => (
                    <>
                      <Card
                        key={post.postId}
                        postId={post.postId}
                        cardLoaded={true}
                        cardType="post"
                        excludeReactionSection={true}
                      />
                      {index === userPosts.length - 4 ? (
                        <div ref={postTrigger} style={{ height: "0" }} />
                      ) : undefined}
                    </>
                  ))
                : Array.from({ length: 3 }).map((_, index) => (
                    <Card
                      key={`${index}`}
                      postId={`${index}`}
                      cardLoaded={false}
                      cardType="post"
                      rounded={true}
                      excludeReactionSection={true}
                    />
                  ))
              : bookmarkedPosts && bookmarkedPosts.length > 0
              ? bookmarkedPosts.map((post, index) => (
                  <>
                    <Card
                      key={post.postId}
                      postId={post.postId}
                      cardLoaded={true}
                      cardType="post"
                      excludeReactionSection={true}
                    />
                    {index === userPosts.length - 4 ? (
                      <div ref={bookmarkTrigger} style={{ height: "0" }} />
                    ) : undefined}
                  </>
                ))
              : Array.from({ length: 3 }).map((_, index) => (
                  <Card
                    key={`${index + 3}`}
                    postId={`${index + 3}`}
                    cardLoaded={false}
                    cardType="post"
                    rounded={true}
                    excludeReactionSection={true}
                  />
                ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfileContent;
