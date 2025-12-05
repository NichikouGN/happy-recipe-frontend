import React, { Fragment } from "react";
import { TbMessageChatbot, TbMessageChatbotFilled } from "react-icons/tb";
import styles from "./SearchResult.module.css";
import { useSearchContext } from "../../context/SearchContext";
import Card from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft } from "react-icons/fa";

interface searchResultProps {
  searchQuery: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  engagedAI: boolean;
  setEngagedAI: (engaged: boolean) => void;
  searchInputPlaceholder: string;
  handleSearch: (query: string) => void;
  setSearchQuery: (query: string) => void;
}

const SearchResult = ({
  searchQuery,
  handleInputChange,
  handleFormSubmit,
  engagedAI,
  setEngagedAI,
  searchInputPlaceholder,
  handleSearch,
  setSearchQuery,
}: searchResultProps) => {
  const { searchResults, setEngagedSearch } = useSearchContext();
  const navigate = useNavigate();
  return (
    <>
      <header className={styles["header"]}>
        <button
          className={styles["return-btn"]}
          onClick={() => {
            setEngagedSearch(false);
            setSearchQuery("");
          }}
        >
          <FaArrowLeft />
        </button>
        <div className={styles["search-input-container"]}>
          <form className={styles["search-form"]} onSubmit={handleFormSubmit}>
            <input
              type="text"
              className={styles["search-input"]}
              placeholder={searchInputPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </form>

          <div
            className={styles["search-input-btn"]}
            onClick={() => setEngagedAI(!engagedAI)}
          >
            {engagedAI ? (
              <TbMessageChatbotFilled
                className={styles["search-input-btn-icon"]}
              />
            ) : (
              <TbMessageChatbot className={styles["search-input-btn-icon"]} />
            )}
          </div>

          <div
            className={styles["search-input-btn"]}
            onClick={() => handleSearch(searchQuery)}
          >
            <FaSearch className={styles["search-input-btn-icon"]} />
          </div>
        </div>
      </header>

      <main className={styles["content"]}>
        <div className={styles["search-result-count"]}>
          {searchResults && searchResults.length > 0 ? searchResults.length : 0}{" "}
          results found
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
                    coverImgURL,
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
                      postImg={coverImgURL}
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
