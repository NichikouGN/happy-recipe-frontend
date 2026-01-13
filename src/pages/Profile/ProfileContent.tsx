import { FaUser } from "react-icons/fa";
import { useUserStore } from "../../stores/userStore";
import styles from "./Profile.module.css";
import { IoCopySharp, IoSettingsSharp } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import type { PostStructure } from "../../types/PostType";
import { handleUIDShare } from "../../utils/Profile";
import { fetchBookmarkedPosts, fetchUserPosts } from "../../api/profile";

const ProfileContent = () => {
  const navigate = useNavigate();
  const userInformation = useUserStore((state) => state.userInformation);
  const [postListType, setPostListType] = useState<"posts" | "bookmarks">("posts");

  const [bookmarkedPosts, setBookmarkedPosts] = useState<PostStructure[]>([]);
  const [bookmarkedPage, setBookmarkedPage] = useState(1);

  const [userPosts, setUserPosts] = useState<PostStructure[]>([]);
  const [userPostsPage, setUserPostsPage] = useState(1);

  const postTrigger = useRef<HTMLDivElement>(null);
  const bookmarkTrigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!userInformation.userId) return;

      setUserPosts([]);
      setUserPostsPage(1);
      await fetchUserPosts(userInformation.userId, 1, setUserPosts);

      setBookmarkedPosts([]);
      setBookmarkedPage(1);
      await fetchBookmarkedPosts(userInformation.userId, 1, setBookmarkedPosts);
    };

    fetchData();
  }, [userInformation.userId]);

  useEffect(() => {
    if (postListType !== "posts" || userPostsPage === 1) return;

    const postObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          postObserver.disconnect();

          const nextPage = userPostsPage + 1;
          setUserPostsPage(nextPage);
          fetchUserPosts(userInformation.userId, nextPage, setUserPosts);
        }
      },
      { threshold: 0.5 } //half of the reference is needed to trigger observer
    );

    if (postTrigger.current) postObserver.observe(postTrigger.current);

    return () => {
      if (postObserver) postObserver.disconnect();
    };
  }, [postListType, userPostsPage, userInformation.userId]);

  useEffect(() => {
    if (postListType !== "bookmarks" || bookmarkedPage === 1) return;

    const bookmarkObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          bookmarkObserver.disconnect();
          const nextPage = bookmarkedPage + 1;
          setBookmarkedPage(nextPage);
          fetchBookmarkedPosts(userInformation.userId, nextPage, setBookmarkedPosts);
        }
      },
      { threshold: 0.5 }
    );

    if (bookmarkTrigger.current) bookmarkObserver.observe(bookmarkTrigger.current);

    return () => {
      if (bookmarkObserver) bookmarkObserver.disconnect();
    };
  }, [postListType, bookmarkedPage, userInformation.userId]);

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
          <div
            style={{ backgroundImage: `url(${userInformation.profileImageUrl})` }}
            className={styles["avatar"]}
          />
        ) : (
          <FaUser className={styles["avatar"]} />
        )}
        <section
          className={styles["display-name"]}
          onClick={() => {
            handleUIDShare(userInformation.userId);
          }}
        >
          <div>{userInformation.displayName}</div>
          <div className={styles["share-uid"]}>
            <IoCopySharp className={styles["share-uid-icon"]} />
          </div>
        </section>

        <section className={styles["username"]}>@{userInformation.username}</section>

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
            {postListType === "posts" ? (
              userPosts && userPosts.length > 0 ? (
                userPosts.map((post, index) => (
                  <Fragment key={post.postId}>
                    <Card
                      key={post.postId}
                      postId={post.postId}
                      onClick={() => {
                        navigate(`/post/${post.postId}`);
                      }}
                      cardType="post"
                      cardLoaded={true}
                      excludeReactionSection={true}
                      postImg={post.coverImgUrl}
                      title={post.title}
                      authorName={post.authorName}
                      authorId={post.authorId}
                      authorImgUrl={post.authorImgUrl}
                      currentUserId={userInformation.userId}
                      time={post.cookTime}
                      difficulty={post.difficulty}
                      serving={post.servings}
                      rounded={true}
                    />
                    {index === userPosts.length - 4 && userPosts.length >= 10 && (
                      <div
                        ref={postTrigger}
                        style={{ position: "absolute", visibility: "hidden" }}
                      />
                    )}
                  </Fragment>
                ))
              ) : (
                <div className={styles["post-list-content-no-result"]}>
                  You haven't posted anything yet.
                </div>
              )
            ) : bookmarkedPosts && bookmarkedPosts.length > 0 ? (
              bookmarkedPosts.map((post, index) => (
                <Fragment key={post.postId}>
                  <Card
                    key={post.postId}
                    postId={post.postId}
                    onClick={() => {
                      navigate(`/post/${post.postId}`);
                    }}
                    cardType="post"
                    cardLoaded={true}
                    excludeReactionSection={true}
                    postImg={post.coverImgUrl}
                    title={post.title}
                    authorName={post.authorName}
                    authorId={post.authorId}
                    authorImgUrl={post.authorImgUrl}
                    time={post.cookTime}
                    difficulty={post.difficulty}
                    serving={post.servings}
                    rounded={true}
                  />
                  {index === bookmarkedPosts.length - 4 && bookmarkedPosts.length >= 10 && (
                    <div
                      ref={bookmarkTrigger}
                      style={{ position: "absolute", visibility: "hidden" }}
                    />
                  )}
                </Fragment>
              ))
            ) : (
              <div className={styles["post-list-content-no-result"]}>
                You haven't bookmarked anything yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfileContent;
