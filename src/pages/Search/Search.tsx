import styles from "./Search.module.css";
import { Link } from "react-router-dom";
import { TbMessageChatbot, TbMessageChatbotFilled } from "react-icons/tb";
import { useSearchStore } from "../../stores/searchStore";
import { useEffect, useState } from "react";
import SearchResult from "../SearchResult/SearchResult";
import { FaSearch } from "react-icons/fa";

// Example tags for search suggestions
const tags = [
  { tag: "Pasta", color: "yellow" },
  { tag: "Vegan", color: "green" },
  { tag: "Chicken", color: "red" },
  { tag: "Salad", color: "green" },
  { tag: "Dessert", color: "blue" },
  { tag: "Soup", color: "blue" },
];

const Search = () => {
  const engagedAI = useSearchStore((state) => state.engagedAI);
  const setEngagedAI = useSearchStore((state) => state.setEngagedAI);
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const handleSearch = useSearchStore((state) => state.handleSearch);
  const engagedSearch = useSearchStore((state) => state.engagedSearch);
  const setEngagedSearch = useSearchStore((state) => state.setEngagedSearch);

  // State to manage transition animation
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  const [searchTitle, setSearchTitle] = useState<string>("What do you fancy today?");
  const [searchInputPlaceholder, setSearchInputPlaceholder] = useState<string>("");

  // Update titles and placeholders based on AI mode
  useEffect(() => {
    if (engagedAI) {
      setSearchTitle("AI Assistant Engaged!");
      setSearchInputPlaceholder("Tell me what you want to cook...");
    } else {
      setSearchTitle("What do you fancy today?");
      setSearchInputPlaceholder("Search for recipes, ingredients, or users...");
    }
  }, [engagedAI]);

  // Handle transition when engagedSearch changes
  useEffect(() => {
    setTransitioning(engagedSearch !== showSearchResults);
  }, [engagedSearch, showSearchResults]);

  // After transition, update the display of search results
  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => {
        setTransitioning(false);
        setShowSearchResults(engagedSearch);
      }, 400); // Duration of the outro animation

      return () => clearTimeout(timer);
    }
  }, [engagedSearch, transitioning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSearchQuery("");
      setEngagedAI(false);
      setEngagedSearch(false);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

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
          setSearchQuery={setSearchQuery}
        />
      ) : (
        <>
          <header className={styles["header"]}>
            <Link to="/discover" className={styles["header-item"]}>
              Discover
            </Link>
            <button
              className={`${styles["header-item"]} ${styles["current"]}`}
              onClick={() => {
                !transitioning && setSearchQuery("");
              }}
            >
              Search
            </button>
          </header>

          <main className={styles["content"]}>
            <div
              className={`${styles["search-container"]}  ${transitioning ? styles["outro"] : ""}`}
            >
              <h1 className={styles["search-title"]}>{searchTitle}</h1>
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
                    <TbMessageChatbotFilled className={styles["search-input-btn-icon"]} />
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
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Search;
