import { FaUser } from "react-icons/fa";
import styles from "../Profile/Profile.module.css";
import { IoCopySharp } from "react-icons/io5";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/Card/Card";
import type { PostStructure } from "../../types/PostType";
import { handleUIDShare } from "../../utils/Profile";
import type { userInformation } from "../../types/userType";
import { FaHome } from "react-icons/fa";

const UserContent = ({ userInformation }: { userInformation: userInformation }) => {
  const navigate = useNavigate();

  const [userPosts, setUserPosts] = useState<PostStructure[]>([]);
  const [userPostsPage, setUserPostsPage] = useState(1);

  const postTrigger = useRef<HTMLDivElement>(null);

  // Initial fetch
  useEffect(() => {
    if (!userInformation.userId) return;

    setUserPosts([]);
    setUserPostsPage(1);
    fetchUserPosts();
  }, []);

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
  }, [userPosts.length, userInformation.userId, userPostsPage]);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${
          userInformation.userId
        }/posts?page=${userPostsPage}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok) {
        const error = await res.text();
        console.error("Error fetching user posts:", error);
        throw new Error("Unable to fetch user posts");
      }

      const data: { userPosts: PostStructure[] } = await res.json();
      setUserPosts(data.userPosts);
    } catch (error: any) {
      //
    }
  };

  return (
    <>
      <header className={styles["header"]}>
        <Link to="/" className={styles["settings-button"]}>
          <FaHome className={styles["settings-button-icon"]} />
        </Link>
      </header>
      <main className={styles["content"]}>
        {userInformation.profileImageUrl ? (
          <img src={userInformation.profileImageUrl} alt="Avatar" className={styles["avatar"]} />
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
            <button className={`${styles["post-list-toggle"]} ${styles["current"]}`}>
              <span>Posts</span>
            </button>
          </div>
          <div className={styles["post-list-content"]}>
            {userPosts && userPosts.length > 0 ? (
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
                    time={post.cookTime}
                    difficulty={post.difficulty}
                    serving={post.servings}
                    rounded={true}
                  />
                  {index === userPosts.length - 4 ? (
                    <div ref={postTrigger} style={{ height: "0" }} />
                  ) : undefined}
                </Fragment>
              ))
            ) : (
              <div className={styles["post-list-content-no-result"]}>
                {userInformation.displayName} has not posted any recipes yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default UserContent;
