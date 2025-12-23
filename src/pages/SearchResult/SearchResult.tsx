import React, { Fragment, useEffect, useState } from "react";
import styles from "./SearchResult.module.css";
import cardStyles from "../../components/Card/Card.module.css";
import Card from "../../components/Card/Card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import type { PostStructure } from "../../types/PostType";
import { formatConsoleError } from "../../consoleError";
import { FaCircleUser } from "react-icons/fa6";

interface searchUserType {
  userId: string;
  displayName: string;
  userImgUrl: string;
  bio: string;
}

const SearchResult = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const category = searchParams.get("category") || "post";

  const [inputQuery, setInputQuery] = useState<string>(searchQuery);
  const [searchPage, setSearchPage] = useState<number>(1);
  const [searchPostResults, setSearchPostResults] = useState<PostStructure[]>([]);
  const [searchUserResults, setSearchUserResults] = useState<searchUserType[]>([]);

  const fetchTrigger = React.useRef<HTMLDivElement | null>(null);
  const fetchResulsts = async () => {
    console.log("Fetching search results for query:", searchQuery);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search/results?category=${encodeURIComponent(
          category
        )}&query=${encodeURIComponent(searchQuery)}&page=${searchPage}`
      );

      if (!res.ok) throw new Error("Failed to fetch search results");

      const data = await res.json();

      if (category === "post") {
        console.log("Search post results:", data.results);
        setSearchPostResults(
          searchPage === 1 ? data.results || [] : [...searchPostResults, ...(data.results || [])]
        );
      } else if (category === "user") {
        console.log("Search user results:", data.results);
        setSearchUserResults(
          searchPage === 1 ? data.results || [] : [...searchUserResults, ...(data.results || [])]
        );
      }
    } catch (error) {
      setSearchPostResults([]);
      setSearchUserResults([]);
      formatConsoleError("SearchResult", "useEffect-fetchResults", error);
    }
  };

  useEffect(() => {
    fetchResulsts();
  }, [searchQuery, category]); // End of

  useEffect(() => {
    const postObserver = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting) {
          postObserver.disconnect();

          setSearchPage((prev) => prev + 1);
          fetchResulsts();
        }
      },
      { threshold: 0.5 } //half of the reference is needed to trigger observer
    );

    if (fetchTrigger.current) postObserver.observe(fetchTrigger.current);

    return () => {
      if (postObserver) postObserver.disconnect();
    };
  }, [searchPostResults.length, searchUserResults.length, category]); // End of

  const handleNewParams = (category: string, query: string) => {
    setSearchPage(1);
    setSearchPostResults([]);
    setSearchUserResults([]);
    fetchResulsts();

    setSearchParams({
      category: category,
      query: query,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNewParams(category, inputQuery);
  };

  return (
    <>
      <header className={styles["header"]}>
        <button
          className={styles["return-btn"]}
          onClick={() => {
            navigate("/search");
          }}
        >
          <FaArrowLeft />
        </button>
        <div className={styles["search-input-container"]}>
          <form className={styles["search-form"]} onSubmit={handleFormSubmit}>
            <input
              type="text"
              className={styles["search-input"]}
              value={inputQuery}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </form>
        </div>
      </header>

      <main className={styles["content"]}>
        <div className={styles["search-results-header"]}>
          <select
            className={styles["search-input-category-select"]}
            onChange={(e) => handleNewParams(e.target.value, searchQuery)}
            value={category}
          >
            <option value="post">Post</option>
            <option value="user">User</option>
          </select>
          <div className={styles["search-result-count"]}>
            {category === "post"
              ? searchPostResults && searchPostResults.length > 0
                ? searchPostResults.length
                : 0
              : searchUserResults && searchUserResults.length > 0
              ? searchUserResults.length
              : 0}
            &nbsp;results found
          </div>
        </div>

        <div className={styles["search-results-container"]}>
          {category === "post"
            ? searchPostResults && searchPostResults.length > 0
              ? searchPostResults.map(
                  (
                    {
                      postId,
                      title,
                      authorName,
                      authorId,
                      authorImgUrl,
                      cookTime,
                      servings,
                      difficulty,
                      coverImgUrl,
                      reactions,
                      userActions,
                    },
                    index
                  ) => (
                    <Fragment key={postId}>
                      <Card
                        key={postId}
                        postId={postId}
                        onClick={() => {
                          navigate(`/post/${postId}`);
                        }}
                        cardType="post"
                        cardLoaded={true}
                        postImg={coverImgUrl}
                        title={title}
                        authorName={authorName}
                        authorId={authorId}
                        authorImgUrl={authorImgUrl}
                        time={cookTime}
                        difficulty={difficulty}
                        serving={servings}
                        reactions={reactions}
                        userActions={userActions}
                      />
                      {index === searchPostResults.length - 4
                        ? null
                        : // <div ref={fetchTrigger} style={{ lineHeight: "0" }}></div>
                          undefined}
                    </Fragment>
                  )
                )
              : null
            : searchUserResults && searchUserResults.length > 0
            ? searchUserResults.map(({ userId, displayName, userImgUrl, bio }, index) => (
                <Fragment key={userId}>
                  <button
                    className={`${styles["card-item"]}`}
                    onClick={() => {
                      navigate(`/user/${userId}`);
                    }}
                  >
                    {userImgUrl ? (
                      <div
                        className={cardStyles["card-author-logo"]}
                        style={{ backgroundImage: `url(${userImgUrl})` }}
                      />
                    ) : (
                      <FaCircleUser className={styles["card-author-logo"]} />
                    )}

                    <div className={styles["user-info"]}>
                      <h2 className={styles["user-display-name"]}>{displayName}</h2>
                      <p className={styles["user-bio"]}>{bio}</p>
                    </div>
                  </button>
                  {index === searchUserResults.length - 4 ? (
                    <div ref={fetchTrigger} style={{ lineHeight: "0" }} />
                  ) : null}
                </Fragment>
              ))
            : null}
        </div>
      </main>
    </>
  );
};

export default SearchResult;
