import styles from "./Search.module.css";
import { useNavigate } from "react-router-dom";
import { TbMessageChatbot, TbMessageChatbotFilled } from "react-icons/tb";
import { useSearchContext } from "../../context/SearchContext";
import { useEffect, useState } from "react";
import SearchResult from "../SearchResult/SearchResult";
import { FaSearch } from "react-icons/fa";

const tags = [
  { tag: "Pasta", color: "yellow" },
  { tag: "Vegan", color: "green" },
  { tag: "Chicken", color: "red" },
  { tag: "Salad", color: "green" },
  { tag: "Dessert", color: "blue" },
  { tag: "Soup", color: "blue" },
];

const Search = () => {
  const navigate = useNavigate();
  const {
    engagedAI,
    setEngagedAI,
    searchQuery,
    setSearchQuery,
    handleSearch,
    engagedSearch,
    setEngagedSearch,
  } = useSearchContext();

  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  const [searchTitle, setSearchTitle] = useState<string>(
    "What do you fancy today?"
  );
  const [searchInputPlaceholder, setSearchInputPlaceholder] =
    useState<string>("");
  useEffect(() => {
    if (engagedAI) {
      setSearchTitle("AI Assistant Engaged!");
      setSearchInputPlaceholder("Tell me what you want to cook...");
    } else {
      setSearchTitle("What do you fancy today?");
      setSearchInputPlaceholder("Search for recipes, ingredients, or users...");
    }
  }, [engagedAI]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  useEffect(() => {
    return () => {
      setSearchQuery("");
      setEngagedAI(false);
      setEngagedSearch(false);
    };
  }, []);

  useEffect(() => {
    setTransitioning(engagedSearch !== showSearchResults);
  }, [engagedSearch, showSearchResults]);

  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        setTransitioning(false);
        setShowSearchResults(engagedSearch);
      }, 400); // Duration of the outro animation

      return () => clearTimeout(timer);
    }
  }, [engagedSearch, transitioning]);

  return (
    <>
      {showSearchResults ? (
        <SearchResult
          searchQuery={searchQuery}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          engagedAI={engagedAI}
          setEngagedAI={setEngagedAI}
          searchInputPlaceholder={searchInputPlaceholder}
          handleSearch={handleSearch}
        />
      ) : (
        <>
          <header className={styles["header"]}>
            <div
              className={styles["header-item"]}
              onClick={() => {
                handleInputChange({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
                navigate("/discover");
              }}
            >
              Discover
            </div>
            <div
              className={`${styles["header-item"]} ${styles["current"]}`}
              onClick={() => {
                handleInputChange({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
                setEngagedSearch(false);
                setShowSearchResults(false);
                navigate("/search");
              }}
            >
              Search
            </div>
          </header>

          <main
            className={styles["content"]}
            style={{
              justifyContent: showSearchResults ? "flex-start" : "center",
              padding: showSearchResults ? "0" : "1rem",
            }}
          >
            <div
              className={`${styles["search-container"]}  ${
                transitioning ? styles["outro"] : ""
              }`}
            >
              <div className={styles["search-title"]}>{searchTitle}</div>
              <div className={styles["search-suggestion-container"]}>
                {tags.map(({ tag, color }) => (
                  <button
                    key={tag}
                    className={`${styles["search-suggestion-item"]} ${styles[color]}`}
                    onClick={() => {
                      handleInputChange({
                        target: { value: tag },
                      } as React.ChangeEvent<HTMLInputElement>);
                      handleSearch(tag);
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className={`${styles["search-input-container"]}`}>
                <form
                  className={styles["search-form"]}
                  onSubmit={handleFormSubmit}
                >
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
                    <TbMessageChatbot
                      className={styles["search-input-btn-icon"]}
                    />
                  )}
                </div>

                <div
                  className={styles["search-input-btn"]}
                  onClick={() => handleSearch(searchQuery)}
                >
                  <FaSearch className={styles["search-input-btn-icon"]} />
                </div>
              </div>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Search;
