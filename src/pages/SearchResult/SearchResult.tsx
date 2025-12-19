import React, { Fragment, useEffect, useState } from "react";
import styles from "./SearchResult.module.css";
import Card from "../../components/Card/Card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import type { PostStructure } from "../../types/PostType";

const SearchResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const [inputQuery, setInputQuery] = useState<string>(searchQuery);
  const [searchResults, setSearchResults] = useState<PostStructure[]>([]);

  useEffect(() => {
    const fetchResulsts = async () => {
      console.log("Fetching search results for query:", searchQuery);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/search?query=${encodeURIComponent(searchQuery)}`
        );

        if (!res.ok) throw new Error("Failed to fetch search results");

        const data = await res.json();
        setSearchResults(data.searchResults);
      } catch (error) {
        setSearchResults([]);
      }
    };

    fetchResulsts();
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search/results?query=${encodeURIComponent(inputQuery)}`);
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
        <div className={styles["search-result-count"]}>
          {searchResults && searchResults.length > 0 ? searchResults.length : 0} results found
        </div>

        <div className={styles["search-results-container"]}>
          {searchResults && searchResults.length > 0
            ? searchResults.map(
                (
                  {
                    postId,
                    title,
                    authorName,
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
                      author={authorName}
                      time={cookTime}
                      difficulty={difficulty}
                      serving={servings}
                      reactions={reactions}
                      userActions={userActions}
                    />
                    {index === searchResults.length - 4
                      ? null
                      : // <div ref={fetchTrigger} style={{ lineHeight: "0" }}></div>
                        undefined}
                  </Fragment>
                )
              )
            : null}
        </div>
      </main>
    </>
  );
};

export default SearchResult;
